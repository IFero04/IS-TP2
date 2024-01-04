package main

import (
	"watcher/db"
	"watcher/querys"
	"watcher/types"
	"watcher/rabbitmq"
	"log"	
	"time"
)


func main() {
	err := db.Init()
	if err != nil {
		log.Fatal(err)
	}

	err = rabbitmq.Init()
	if err != nil {
		log.Fatal(err)
	}
	
	ticker := time.NewTicker(5 * time.Second) 
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			document , err := querys.GetDocumentToMigrate()
			if err != nil {
				log.Println("Error checking for new entry:", err)
			} else {
				if document != nil {
					if types.ValidateDocument(document){
						log.Printf("New entry found: ID=%d, Name=%s\n", document.ID, document.Name)
						err := rabbitmq.AddToQueue(document.ID)
						if err != nil {
							log.Println("Error adding to queue:", err)
						} else{
							err := querys.SetMigrated(document.ID)
							if err != nil {
								log.Println("Error setting migrated:", err)
							}
						}
					}
				}
			}
		}
	}
}