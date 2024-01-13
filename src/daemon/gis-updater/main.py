import sys
import time

from utilis.rabbitmq import Rabbitmq
from utilis.requests import check_api, get_coords, update_country_coordinates

POLLING_FREQ = int(sys.argv[1]) if len(sys.argv) >= 2 else 60


def load_rabbitmq():
    print("Loading RabbitMQ...")
    while True:
        try:
            rabbitmq = Rabbitmq("is", "is", "is")
            print("RabbitMQ loaded successfully!")
            break
        except Exception as e:
            print(f"Error: {e}")
            print("Retrying in 30 seconds...")
            time.sleep(30)
    return rabbitmq


if __name__ == "__main__":
    rabbitmq = load_rabbitmq()

    print("Checking API ...")
    while not check_api():
        print("Retrying in 30 seconds...")
        time.sleep(30)
    print("API checked successfully!")

    while True:
        try:
            messages = rabbitmq.consume_from_queue("gis-updater", 5)

            if len(messages) == 0:
                print("No messages received!")
                continue

            for message in messages:
                message_info = message.split("|")

                if len(message_info) != 3:
                    print("Invalid message format!")
                    continue
                if message_info[0] != "Country":
                    print("Invalid message type!")
                    continue
                try:
                    country_id = int(message_info[1])
                    country_name = str(message_info[2])

                    latitude, longitude = get_coords(country_name)

                    success = update_country_coordinates(country_id, {
                        "latitude": latitude,
                        "longitude": longitude
                    })

                    if success:
                        print(f"Updated Successfully for country {country_name}!")
                    else:
                        raise Exception(f"Failed to update country {country_name}!")
                except:
                    print("Invalid message format!")
                    continue
        except Exception as e:
            print(f"Error: {e}")
        finally:
            print(f"Sleeping for {POLLING_FREQ} seconds...")
            time.sleep(POLLING_FREQ)
