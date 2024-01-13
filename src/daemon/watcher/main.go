package main

import (
	"watcher/types"
	"watcher/db"
	"watcher/querys"
	"watcher/rabbitmq"

	"log"	
	"time"
	"fmt"
)

func _loadDB() {
	log.Println("Loading DataBase ...")
	for {
		err := db.Init()
		if err != nil {
			log.Println(err)
			log.Println("Retrying in 30 seconds ...")
			time.Sleep(30 * time.Second)
		} else {
			log.Println("DataBase loaded.")
			break	
		}
	}
}

func _loadRabbitMQ() {
	log.Println("Loading RabbitMQ ...")
	for {
		err := rabbitmq.Init()
		if err != nil {
			log.Println(err)
			log.Println("Retrying in 30 seconds ...")
			time.Sleep(30 * time.Second)
		} else {
			log.Println("RabbitMQ loaded.")
			break	
		}
	}
}

func main() {
	_loadDB()

	_loadRabbitMQ()
	
	ticker := time.NewTicker(30 * time.Second) 
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			document , err := querys.GetDocumentToMigrate()
			if err != nil {
				log.Fatal("Error checking for new entry:", err)
			} 
			
			if document != nil {
				if types.ValidateDocument(document){
					log.Printf("New entry found: ID=%d, Name=%s\n", document.ID, document.Name)

					messageBody := fmt.Sprintf("Document|%d", document.ID)
					err = rabbitmq.AddToQueue("migrate", messageBody)
					if err != nil {
						log.Fatal("Error adding to queue:", err)
					} else {
						err := querys.SetMigrated(document.ID)
						if err != nil {
							log.Fatal("Error setting migrated:", err)
						} else {
							log.Println("Added to queue.")
						}
					}
				}
			} else {
				log.Println("No new entry found.")
				log.Println("Retrying in 30 seconds ...")
			}
		}
	}
}