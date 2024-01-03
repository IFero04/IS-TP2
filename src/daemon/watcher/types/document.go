package types

type Document struct {
	ID			int		`json:"id"`
	Name 		string	`json:"name"`
    Migrated	bool	`json:"migrated"`
}

func ValidateDocument(d *Document) bool {
	if d.Migrated == true {
		return false
	}
	return true
}