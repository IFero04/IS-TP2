package handler

import (
	"migrator/querys"
	"migrator/types"

	"fmt"
	"bytes"
	"net/http"
	"encoding/json"
)

var apiUrl = "http://api-entities:8080/api/"


func CheckAPI() error {
	response, err := http.Get(apiUrl + "teams")
	if err != nil {
		return err
	}
	defer response.Body.Close()

	var apiResponse types.Response
	if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
		return err
	}

	if apiResponse.Status != "OK!" {
        return fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
	}

	return nil
}


func MigrateDocument(id int) error {
	countries, err := querys.GetAllCountries(id)
	if err != nil {
		return err
	}

	for _, country := range countries {
		err = _MigrateCountry(country)
		if err != nil {
			return err
		}
	}

	colleges, err := querys.GetAllColleges(id)
	if err != nil {
		return err
	}

	

	for _, college := range colleges {
		err = _MigrateCollege(college)
		if err != nil {
			return err
		}
	}


	return nil
}


func _MigrateCountry(country *types.Country) error {
	response, err := http.Get(apiUrl + "countries/name/" + country.Name)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	var apiResponse types.Response
    if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
        return err
    }

	var requestBody = &bytes.Buffer{}



	json.NewEncoder(requestBody).Encode(country)


	return nil
}

func _MigrateCollege(college *types.College) error {
	var requestBody = &bytes.Buffer{}

	json.NewEncoder(requestBody).Encode(college)

	return nil
}