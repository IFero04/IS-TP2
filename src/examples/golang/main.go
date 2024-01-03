package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"
)

const (
	host = db-xml
	port = 5432
	user = is
	password = is
	dbname = is
)


func checkForNewEntry(db *sql.DB) error {
	query := "
		SELECT id, migrated
		FROM imported_documents
		WHERE migrated = false AND deleted_on IS NULL
		ORDER BY updated_on DESC
	"
	row := db.QueryRow(query)

	var id int
	var migrated bool

	err := row.Scan(&id, &migrated)
	if err == sql.ErrNoRows {
		log.Println("No new entry found.")
		return nil
	} else if err != nil {
		return err
	}

	log.Printf("New entry found: ID=%d, Migrated=%v\n", id, migrated)

	return nil
}


func main() {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			err := checkForNewEntry(db)
			if err != nil {
				log.Println("Error checking for new entry:", err)
			}
		}
	}
}
