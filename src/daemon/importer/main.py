import asyncio
import time
import uuid
import pandas
import io

import sys
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileCreatedEvent

from utils.csv_to_xml_converter import CSVtoXMLConverter
from utils.db import PostgresDB
from utils.file_manager import *

NUM_XML_PARTS = int(sys.argv[1]) if len(sys.argv) >= 2 else 10


def get_csv_files_in_input_folder():
    return [os.path.join(dp, f) for dp, dn, filenames in os.walk(CSV_INPUT_PATH) for f in filenames if
            os.path.splitext(f)[1] == '.csv']


def generate_unique_file_name(directory):
    file_name = str(uuid.uuid4())
    file_path = f"{directory}/{file_name}.xml"

    return file_path, file_name


def convert_csv_to_xml(csv, out_path):
    converter = CSVtoXMLConverter(csv)
    try:
        xml_str = converter.xml_to_str()
        # with open(out_path, "w") as file:
        #     file.write(xml_str)

        return xml_str
    except Exception as e:
        exit(e)


def divide_csv(csv_path, csv_parts):
    original_data = pandas.read_csv(csv_path)

    total_rows = len(original_data)
    rows_per_file = total_rows // csv_parts

    smaller_csvs = []

    for i in range(csv_parts):
        start_index = i * rows_per_file
        end_index = (i + 1) * rows_per_file if i < csv_parts - 1 else total_rows

        smaller_data = original_data.iloc[start_index:end_index]

        csv_string = smaller_data.to_csv(index=False)

        smaller_csvs.append(io.StringIO(csv_string))

    return smaller_csvs


class CSVHandler(FileSystemEventHandler):
    def __init__(self, input_path, output_path, xml_parts):
        self._output_path = output_path
        self._input_path = input_path
        self._xml_parts = xml_parts

        # generate file creation events for existing files
        for file in [os.path.join(dp, f) for dp, dn, filenames in os.walk(input_path) for f in filenames]:
            event = FileCreatedEvent(os.path.join(input_path, file))
            event.event_type = "created"
            self.dispatch(event)

    async def convert_csv(self, csv_path):
        if csv_path in await self.get_converted_files():
            return

        print(f"new file to convert: '{csv_path}'")

        smaller_csvs = divide_csv(csv_path, self._xml_parts)

        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            try:
                response, csv_id = store_converted(db, csv_path, os.path.getsize(csv_path))
                if response is not None:
                    print(f"new insert on database: converted file was {response}")
                else:
                    raise Exception(f"ERROR new insert on database: converted file was not stored / updated")

                for csv in smaller_csvs:
                    xml_path, xml_name = generate_unique_file_name(self._output_path)

                    xml_str = convert_csv_to_xml(csv, xml_path)
                    print(f"new xml file generated: '{xml_path}'")

                    response = import_xml(db, xml_name, xml_str, csv_id)
                    if response is not None:
                        print(f"new insert on database: xml file was {response}")
                    else:
                        raise Exception('ERROR new insert on database: xml file was not stored / updated')

            except Exception as e:
                exit(e)

    async def get_converted_files(self):
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            try:
                files_converted = set(list_converted(db))

                return files_converted
            except Exception as e:
                exit(e)

    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith(".csv"):
            asyncio.run(self.convert_csv(event.src_path))

def _check_db():
    query = """
        SELECT 1;
    """
    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            try:
                db.execute_query(query, multi=False)
            except Exception:
                return False
    except Exception:
        return False
    
    return True

if __name__ == "__main__":
    print("Loading DataBase ...")
    while True:
        leave = _check_db()
        if leave:
            print("DataBase loaded.")
            break
        print("Retrying in 30 seconds ...")
        time.sleep(30)

    CSV_INPUT_PATH = "/csv"
    XML_OUTPUT_PATH = "/xml"
    NUM_XML_PARTS = NUM_XML_PARTS

    # create the file observer
    observer = Observer()
    observer.schedule(
        CSVHandler(CSV_INPUT_PATH, XML_OUTPUT_PATH, NUM_XML_PARTS),
        path=CSV_INPUT_PATH,
        recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        observer.join()

