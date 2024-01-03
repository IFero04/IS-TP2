package querys

import (
	"watcher/db"
	"watcher/types"

	"database/sql"
	"log"
)


func GetDocumentToMigrate() (*types.Document, error) {
	query := "SELECT id, file_name, migrated FROM imported_documents WHERE migrated = false AND deleted_on IS NULL ORDER BY id ASC LIMIT 1"
	row := db.DB.QueryRow(query)

	var id int
	var file_name string
	var migrated bool

	err := row.Scan(&id, &file_name, &migrated)
	if err == sql.ErrNoRows {
		log.Println("No new entry found.")
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &types.Document{
		ID:       id,
		Name:     file_name,
		Migrated: migrated,
	}, nil
}