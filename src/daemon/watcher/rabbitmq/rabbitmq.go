package rabbitmq

import (
	"fmt"
	"log"
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


func AddToQueue(id int) error {
	channel, err := connection.Channel()
	if err != nil {
		log.Println(err)
	}
	defer channel.Close()

	queue, err := channel.QueueDeclare(
		"migrate",
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
			ContentType: "text/plain",
			Body: []byte(fmt.Sprintf("%d", id)),
		},
	)
	if err != nil {
		return err
	}
	
	fmt.Println("Queue status:", queue)
	fmt.Println("Successfully published message")

	return nil
}