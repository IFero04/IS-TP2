import pika
import time

class Rabbitmq:
    def __init__(self, vhost, user, password):
        self._vhost = vhost
        self._user = user
        self._password = password
        self._connection = None
        self.init()

    def init(self):
        try:
            conn = self.create_connection()
            self._connection = conn
        except Exception as e:
            raise Exception(e)
        
    
    def create_connection(self):
        conn_str = f"amqp://{self._user}:{self._password}@broker:5672/{self._vhost}"
        try:
            connection = pika.BlockingConnection(pika.URLParameters(conn_str))
            return connection
        except Exception as e:
            raise Exception(f"Error connecting to RabbitMQ: {e}")


    def consume_from_queue(self, queue_name, time_duration):
        start_time = time.time()
        messages = []

        try:
            channel = self._connection.channel()
            _ = channel.queue_declare(queue=queue_name, durable=False)

            def callback(ch, method, properties, body):
                message_body = body.decode('utf-8')
                messages.append(message_body)
                ch.basic_ack(delivery_tag=method.delivery_tag)

            channel.basic_consume(queue=queue_name, on_message_callback=callback)
        
            print("Waiting for messages...")
            try:
                while time.time() - start_time < time_duration:
                    channel.connection.process_data_events(time_duration - (time.time() - start_time))
            except KeyboardInterrupt:
                pass
            if len(messages) > 0:
                print("Done receiving messages.")

            channel.close()
            return messages
        except Exception as e:
            raise Exception(f"Error consuming from queue: {e}")