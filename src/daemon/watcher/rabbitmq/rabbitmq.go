package rabbitmq

import (
	"fmt"
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
