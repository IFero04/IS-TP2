import asyncio
import time
import uuid

import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileCreatedEvent

from utils.csv_to_xml_converter import CSVtoXMLConverter
from utils.db import PostgresTransaction
from utils.file_manager import *


def get_csv_files_in_input_folder():
    return [os.path.join(dp, f) for dp, dn, filenames in os.walk(CSV_INPUT_PATH) for f in filenames if
            os.path.splitext(f)[1] == '.csv']


def generate_unique_file_name(directory):
    file_name = str(uuid.uuid4())
    file_path = f"{directory}/{file_name}.xml"

    return file_path, file_name


def convert_csv_to_xml(in_path, out_path):
    converter = CSVtoXMLConverter(in_path)
    try:
        xml_str = converter.xml_to_str()
        with open(out_path, "w") as file:
            file.write(xml_str)

        return xml_str
    except Exception as e:
        exit(e)


class CSVHandler(FileSystemEventHandler):
    def __init__(self, input_path, output_path):
        self._output_path = output_path
        self._input_path = input_path

        # generate file creation events for existing files
        for file in [os.path.join(dp, f) for dp, dn, filenames in os.walk(input_path) for f in filenames]:
            event = FileCreatedEvent(os.path.join(input_path, file))
            event.event_type = "created"
            self.dispatch(event)

    async def convert_csv(self, csv_path):
        if csv_path in await self.get_converted_files():
            return

        print(f"new file to convert: '{csv_path}'")

        xml_path, xml_name = generate_unique_file_name(self._output_path)

        xml_str = convert_csv_to_xml(csv_path, xml_path)
        print(f"new xml file generated: '{xml_path}'")

        with PostgresTransaction('db-xml', '5432', 'is', 'is', 'is') as cursor:
            try:
                response = store_converted(cursor, csv_path, os.path.getsize(csv_path), xml_path)
                print(f"new insert on database: converted file was {response}")

                response = import_xml(cursor, xml_name, xml_str)
                print(f"new insert on database: xml file was {response}")

            except Exception as e:
                exit(e)


    async def get_converted_files(self):
        try:
            files_converted = set(list_converted())

            return files_converted
        except Exception as e:
            exit(e)


    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith(".csv"):
            asyncio.run(self.convert_csv(event.src_path))


if __name__ == "__main__":

    CSV_INPUT_PATH = "/csv"
    XML_OUTPUT_PATH = "/xml"

    # create the file observer
    observer = Observer()
    observer.schedule(
        CSVHandler(CSV_INPUT_PATH, XML_OUTPUT_PATH),
        path=CSV_INPUT_PATH,
        recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        observer.join()
