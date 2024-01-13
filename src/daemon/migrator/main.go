package main

import (
    "migrator/db"
    "migrator/rabbitmq"
    "migrator/handler"

    "os"
    "log"
    "time"
    "strconv"
    "strings"
)



func _loadDB() {
	log.Println("Loading DataBase ...")
	for {
		err := db.Init()
		if err != nil {
			log.Println("Error: ", err)
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
			log.Println("Error: ", err)
			log.Println("Retrying in 30 seconds ...")
			time.Sleep(30 * time.Second)
		} else {
			log.Println("RabbitMQ loaded.")
			break	
		}
	}
}


func _loadEnvFile() int {
    log.Println("Loading env file ...")
            
    POLLING_FREQ := os.Getenv("POLLING_FREQ")

    if POLLING_FREQ != "" {
        pollingFreq, err := strconv.Atoi(POLLING_FREQ)
        if err != nil {
            log.Println("Invalid polling frequency: ", err)
            log.Println("Using default value: 60 seconds")
            return 60
        }

        log.Println("Env file loaded.")
        return pollingFreq
    }

    log.Println("POLLING_FREQ not found in env file.")
    log.Println("Using default value: 60 seconds")
    return 60
}


func _checkAPI() {
    log.Println("Checking API ...")
    for {
        err := handler.CheckAPI()
        if err != nil {
            log.Println("Error: ", err)
            log.Println("Retrying in 30 seconds ...")
            time.Sleep(30 * time.Second)
        } else {
            log.Println("API checked.")
            break
        }
    }
}

func main() {
    pollingFreq := _loadEnvFile()
    sleep_message := "Sleeping for " + strconv.Itoa(pollingFreq) + " seconds..."

    _loadDB()

    _loadRabbitMQ()

    _checkAPI()
    
    ticker := time.NewTicker(time.Duration(pollingFreq) * time.Second)
	defer ticker.Stop()

    for {
		select {
		case <-ticker.C:
            msgs, err := rabbitmq.ConsumeQueue("migrate")
            if err != nil {
                log.Fatal(err)
            }
            
            for _, msg := range msgs {
                messageInfo := strings.Split(msg, "|")
                if len(messageInfo) != 2 {
                    log.Println("Invalid message format")
                    continue
                }
                if messageInfo[0] != "Document" {
                    log.Println("Invalid message format")
                    continue
                }
                id, err := strconv.Atoi(messageInfo[1])
                if err != nil {
                    log.Println("Invalid message format: ", err)
                    continue
                }

                log.Println("Migrating document with id: ", id)
                err = handler.MigrateDocument(id)
                if err != nil {
                    log.Fatal(err)
                }
                log.Println("Migrated document: ", id)
            }
            log.Println(sleep_message)
        }
    }
}