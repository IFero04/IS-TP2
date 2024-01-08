package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func CreateDataBase() (*sql.DB, error) {
	var (
		host     = "db-xml"
		port     = 5432
		user     = "is"
		password = "is"
		dbname   = "is"
		connStr  = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)
	)
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		return nil, err
	}

	return db, nil
}

func Init() error {
	db, err := CreateDataBase()
	if err != nil {
		return err
	}

	DB = db

	return nil
}