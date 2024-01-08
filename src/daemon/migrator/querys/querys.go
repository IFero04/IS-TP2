package querys

import (
	"migrator/db"
	"migrator/types"

	"fmt"
)


func GetAllCountries(id int) ([]*types.Country, error) {
    query := fmt.Sprintf("SELECT unnest(xpath('//countries/country/name/text()', xml::xml))::text AS country_name FROM imported_documents WHERE deleted_on IS NULL AND id = %d", id)

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close() 

	var countries []*types.Country

	for rows.Next() {
		var countryName string

		err := rows.Scan(&countryName)
		if err != nil {
			return nil, err
		}

		country := &types.Country{
			Name: countryName, 
		}

		countries = append(countries, country)
	}

	return countries, nil
}

func GetAllColleges(id int) ([]*types.College, error) {
    query := fmt.Sprintf("SELECT unnest(xpath('//colleges/college/name/text()', xml::xml))::text AS college_name FROM imported_documents WHERE deleted_on IS NULL AND id = %d", id)

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close() 

	var colleges []*types.College

	for rows.Next() {
		var collegeName string

		err := rows.Scan(&collegeName)
		if err != nil {
			return nil, err
		}

		college := &types.College{
			Name: collegeName, 
		}

		colleges = append(colleges, college)
	}

	return colleges, nil
}