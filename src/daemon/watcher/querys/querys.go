package querys

import (
	"watcher/db"
	"watcher/types"

	"database/sql"
	"fmt"
)


func GetDocumentToMigrate() (*types.Document, error) {
	query := "SELECT id, file_name, migrated FROM imported_documents WHERE migrated = false AND deleted_on IS NULL ORDER BY id ASC LIMIT 1"
	row := db.DB.QueryRow(query)

	var id int
	var file_name string
	var migrated bool

	err := row.Scan(&id, &file_name, &migrated)
	if err == sql.ErrNoRows {
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


func SetMigrated(id int) error {
	query := fmt.Sprintf("UPDATE imported_documents SET migrated = true WHERE id = %d", id)
	_, err := db.DB.Exec(query)
	if err != nil {
		return err
	}

	return nil
}
