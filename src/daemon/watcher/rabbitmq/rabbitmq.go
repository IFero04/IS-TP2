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

	log.Println("Adding to queue:", id)

	// Add your logic for adding to the queue here

	// Return nil to indicate success
	return nil
}