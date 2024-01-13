package rabbitmq

import (
	"fmt"
	"log"
	"time"

	"github.com/streadway/amqp"
)

var connection *amqp.Connection

func CreateConnection() (*amqp.Connection, error) {
	var (
		user = "is"
		pass = "is"
		vshost = "is"
		connStr = fmt.Sprintf("amqp://%s:%s@broker:5672/%s", user, pass, vshost)
	)
	conn, err := amqp.Dial(connStr)

	if err != nil {
		return nil, err
	}

	return conn, nil
}

func Init() error {
	conn, err := CreateConnection()
	if err != nil {
		return err
	}

	connection = conn

	return nil
}


func ConsumeQueue(queueName string) ([]string, error) {
	timeDuration := 10 * time.Second

    channel, err := connection.Channel()
    if err != nil {
        return nil, err
    }
    defer channel.Close()

    msgs, err := channel.Consume(
        queueName,
        "",
        false,
        false,
        false,
        false,
        nil,
    )
    if err != nil {
		if amqpErr, ok := err.(*amqp.Error); ok && amqpErr.Code == 404 {
			log.Printf("Waiting for %s queue\n", queueName)
			return nil, nil
		}

        return nil, err
    }

	log.Println("Waiting for messages...")
    data := make([]string, 0)

    go func() {
        for msg := range msgs {
			messageBody := string(msg.Body)
            data = append(data, messageBody)
			msg.Ack(false)
        }
    }()

	time.Sleep(timeDuration)
	if len(data) != 0 {
		log.Println("Done receiving messages.")
	}

    return data, nil
}

func AddToQueue(queueName string, messageBody string) error {
    channel, err := connection.Channel()
    if err != nil {
        return err
    }
    defer channel.Close()

    queue, err := channel.QueueDeclare(
        queueName,
        false,
        false,
        false,
        false,
        nil, 
    )
    if err != nil {
        return err
    }

    err = channel.Publish(
        "",
        queue.Name,
        false,
        false,
        amqp.Publishing{
            ContentType: 	"text/plain",
            Body:        	[]byte(messageBody),
			DeliveryMode:	amqp.Persistent,
        },
    )
    if err != nil {
        return err
    }

    return nil
}