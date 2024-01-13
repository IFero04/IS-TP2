package handler

import (
	"migrator/querys"
	"migrator/types"
	"migrator/rabbitmq"

	"fmt"
	"bytes"		
	"net/http"
	"encoding/json"
)

var apiUrl = "http://api-entities:8080/api/"


func _formatFloat(f float64, decimals int) float64 {
	scale := 1.0
	for i := 0; i < decimals; i++ {
		scale *= 10
	}
	return float64(int(f*scale)) / scale
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

	teams, err := querys.GetAllTeams(id)
	if err != nil {
		return err
	}
	for _, team := range teams {
		err = _MigrateTeam(team)
		if err != nil {
			return err
		}
	}

	players, err := querys.GetAllPlayers(id)
	if err != nil {
		return err
	}
	for _, player := range players {
		err = _MigratePlayer(player)
		if err != nil {
			return err
		}
	}

	entries, err := querys.GetAllEntries(id)
	if err != nil {
		return err
	}
	for _, entry := range entries {
		err = _MigrateEntry(entry)
		if err != nil {
			return err
		}
	}

	return nil
}

func _GetFromApi(entityType string, endPoint string, singular bool) (interface{}, error) {
	switch entityType {
	case "country":
		response, err := http.Get(apiUrl + "countries" + endPoint)
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		if singular {
			apiResponse := types.CountryResponse{}

			if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
				return nil, err
			}

			if apiResponse.Status == "ERROR!" {
				return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
			}
		
			if apiResponse.Status == "OK!" {
				return apiResponse.Result, nil
			}
			
			return nil, nil
		}
		apiResponse := types.CountriesResponse{}

		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status == "ERROR!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}
	
		if apiResponse.Status == "OK!" {
			return apiResponse.Result, nil
		}
	
		return nil, nil
	
	case "college":
		response, err := http.Get(apiUrl + "colleges" + endPoint)
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		if singular {
			apiResponse := types.CollegeResponse{}

			if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
				return nil, err
			}

			if apiResponse.Status == "ERROR!" {
				return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
			}
		
			if apiResponse.Status == "OK!" {
				return apiResponse.Result, nil
			}
			
			return nil, nil
		}
		apiResponse := types.CollegesResponse{}

		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status == "ERROR!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}
	
		if apiResponse.Status == "OK!" {
			return apiResponse.Result, nil
		}
	
		return nil, nil
	case "team":
		response, err := http.Get(apiUrl + "teams" + endPoint)
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		if singular {
			apiResponse := types.TeamResponse{}

			if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
				return nil, err
			}

			if apiResponse.Status == "ERROR!" {
				return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
			}
		
			if apiResponse.Status == "OK!" {
				return apiResponse.Result, nil
			}
			
			return nil, nil
		}
		apiResponse := types.TeamsResponse{}

		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status == "ERROR!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}
	
		if apiResponse.Status == "OK!" {
			return apiResponse.Result, nil
		}
	
		return nil, nil
	case "player":
		response, err := http.Get(apiUrl + "players" + endPoint)
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		if singular {
			apiResponse := types.PlayerResponse{}

			if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
				return nil, err
			}

			if apiResponse.Status == "ERROR!" {
				return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
			}
		
			if apiResponse.Status == "OK!" {
				return apiResponse.Result, nil
			}
			
			return nil, nil
		}
		apiResponse := types.PlayersResponse{}

		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status == "ERROR!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}
	
		if apiResponse.Status == "OK!" {
			return apiResponse.Result, nil
		}
	
		return nil, nil
	case "entry":
		response, err := http.Get(apiUrl + "entries" + endPoint)
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		if singular {
			apiResponse := types.EntryResponse{}

			if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
				return nil, err
			}

			if apiResponse.Status == "ERROR!" {
				return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
			}
		
			if apiResponse.Status == "OK!" {
				return apiResponse.Result, nil
			}
			
			return nil, nil
		}
		apiResponse := types.EntriesResponse{}

		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status == "ERROR!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}
	
		if apiResponse.Status == "OK!" {
			return apiResponse.Result, nil
		}
	
		return nil, nil
	}
	
	return nil, nil
}

func _PostToApi(entityType string, requestBody []byte) (interface{}, error) {
	switch entityType {
	case "country":
		response, err := http.Post(apiUrl + "countries", "application/json", bytes.NewBuffer(requestBody))
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		apiResponse := types.CountryResponse{}
		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status != "OK!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}

		return apiResponse.Result, nil
	case "college":
		response, err := http.Post(apiUrl + "colleges", "application/json", bytes.NewBuffer(requestBody))
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		apiResponse := types.CollegeResponse{}
		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status != "OK!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}

		return apiResponse.Result, nil
	case "team":
		response, err := http.Post(apiUrl + "teams", "application/json", bytes.NewBuffer(requestBody))
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		apiResponse := types.TeamResponse{}
		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status != "OK!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}

		return apiResponse.Result, nil
	case "player":
		response, err := http.Post(apiUrl + "players", "application/json", bytes.NewBuffer(requestBody))
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		apiResponse := types.PlayerResponse{}
		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status != "OK!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}

		return apiResponse.Result, nil
	case "entry":
		response, err := http.Post(apiUrl + "entries", "application/json", bytes.NewBuffer(requestBody))
		if err != nil {
			return nil, err
		}
		defer response.Body.Close()

		apiResponse := types.EntryResponse{}
		if err := json.NewDecoder(response.Body).Decode(&apiResponse); err != nil {
			return nil, err
		}

		if apiResponse.Status != "OK!" {
			return nil, fmt.Errorf("API status is not OK! - %s", apiResponse.Message)
		}

		return apiResponse.Result, nil
	}

	return nil, nil
}



func _MigrateCountry(country *types.Country) error {
	result, err := _GetFromApi("country", "/name/" + country.Name, true)
	if err != nil {
		return err
	}

	if result != nil {
		return nil
	}

	requestBody, err := json.Marshal(country)
	if err != nil {
		return err
	}
	result, err = _PostToApi("country", requestBody)
	if err != nil {
		return err
	}

	if result != nil {
		messageBody := fmt.Sprintf("Country|%d|%s", result.(types.Country).ID, result.(types.Country).Name)
		err = rabbitmq.AddToQueue("gis-updater", messageBody)
		if err != nil {
			return err
		}
	}

	return nil
}

func _MigrateCollege(college *types.College) error {
	result, err := _GetFromApi("college", "/name/" + college.Name, true)
	if err != nil {
		return err
	}

	if result != nil {
		return nil
	}

	requestBody, err := json.Marshal(college)
	if err != nil {
		return err
	}
	result, err = _PostToApi("college", requestBody)
	if err != nil {
		return err
	}

	return nil
}

func _MigrateTeam(team *types.Team) error {
	result, err := _GetFromApi("team", "/abbreviation/" + team.Abbreviation, true)
	if err != nil {
		return err
	}

	if result != nil {
		return nil
	}

	requestBody, err := json.Marshal(team)
	if err != nil {
		return err
	}
	result, err = _PostToApi("team", requestBody)
	if err != nil {
		return err
	}

	return nil
}

func _MigratePlayer(player *types.HandlePlayer) error {
	result, err := _GetFromApi("player", "/name/" + player.Name, true)
	if err != nil {
		return err
	}

	if result != nil {
		return nil
	}

	if player.Country_name != "" {
		country, err := _GetFromApi("country", "/name/" + player.Country_name, true)
		if err != nil {
			return err
		}
		if country != nil {
			countryID := country.(types.Country).ID
			player.Country_ref = countryID
		}
	}

	if player.College_name != "" {
		college, err := _GetFromApi("college", "/name/" + player.College_name, true)
		if err != nil {
			return err
		}
		if college != nil {
			collegeID := college.(types.College).ID
			player.College_ref = collegeID
		}

		normal_player := &types.Player{
			Name: player.Name,
			Age: player.Age,
			Height: _formatFloat(player.Height, 2),
			Weight: _formatFloat(player.Weight, 2),
			DraftYear: player.DraftYear,
			DraftRound: player.DraftRound,
			DraftNumber: player.DraftNumber,
			College_ref: player.College_ref,
			Country_ref: player.Country_ref,
		}

		requestBody, err := json.Marshal(normal_player)
		if err != nil {
			return err
		}

		result, err = _PostToApi("player", requestBody)
		if err != nil {
			return err
		}

		return nil
	} 

	no_college_player := &types.PlayerNoCollege{
		Name: player.Name,
		Age: player.Age,
		Height: _formatFloat(player.Height, 2),
		Weight: _formatFloat(player.Weight, 2),
		DraftYear: player.DraftYear,
		DraftRound: player.DraftRound,
		DraftNumber: player.DraftNumber,
		Country_ref: player.Country_ref,
	}

	requestBody, err := json.Marshal(no_college_player)
	if err != nil {
		return err
	}

	result, err = _PostToApi("player", requestBody)
	if err != nil {
		return err
	}

	return nil
}

func _MigrateEntry(entry *types.HandleEntry) error {
	player, err := _GetFromApi("player", "/name/" + entry.Player_name, true)
	if err != nil {
		return err
	}
	if player != nil {
		playerID := player.(types.Player).ID
		entry.Player_ref = playerID
	}

	team, err := _GetFromApi("team", "/abbreviation/" + entry.Team_name, true)
	if err != nil {
		return err
	}
	if team != nil {
		teamID := team.(types.Team).ID
		entry.Team_ref = teamID
	}

	endPoint := fmt.Sprintf("/unique/%s/%d/%d", entry.Season, entry.Player_ref, entry.Team_ref)
	result, err := _GetFromApi("entry", endPoint, true)
	if err != nil {
		return err
	}
	if result != nil {
		return nil
	}

	normal_entry := &types.Entry{
		Season: entry.Season,
		Gp: entry.Gp,
		Pts: _formatFloat(entry.Pts, 2),
		Reb: _formatFloat(entry.Reb, 2),
		Ast: _formatFloat(entry.Ast, 2),
		Net_rating: _formatFloat(entry.Net_rating, 2),
		Oreb_pct: _formatFloat(entry.Oreb_pct, 2),
		Dreb_pct: _formatFloat(entry.Dreb_pct, 2),
		Usg_pct: _formatFloat(entry.Usg_pct, 2),
		Ts_pct: _formatFloat(entry.Ts_pct, 2),
		Ast_pct: _formatFloat(entry.Ast_pct, 2),
		Player_ref: entry.Player_ref,
		Team_ref: entry.Team_ref,
	}

	requestBody, err := json.Marshal(normal_entry)
	if err != nil {
		return err
	}

	result, err = _PostToApi("entry", requestBody)
	if err != nil {
		return err
	}

	return nil
}

func CheckAPI() error {
	_, err := _GetFromApi("country", "", false)
	if err != nil {
		return err
	}

	return nil
}