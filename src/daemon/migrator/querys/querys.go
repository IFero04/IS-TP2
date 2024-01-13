package querys

import (
	"migrator/db"
	"migrator/types"

	"fmt"
)


func _defaultGetColleges(id int) ([]*types.College, error){
	query := fmt.Sprintf("SELECT unnest(xpath('//colleges/college/@id', xml::xml))::text AS college_id, unnest(xpath('//colleges/college/name/text()', xml::xml))::text AS college_name FROM imported_documents WHERE deleted_on IS NULL AND id = %d", id)

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var colleges []*types.College

	for rows.Next() {
		var collegeID int
		var collegeName string

		err := rows.Scan(&collegeID, &collegeName)
		if err != nil {
			return nil, err
		}

		college := &types.College{
			ID: collegeID,
			Name: collegeName,
		}

		colleges = append(colleges, college)
	}

	return colleges, nil
}
func _defaultGetCountries(id int) ([]*types.Country, error){
	query := fmt.Sprintf("SELECT unnest(xpath('//countries/country/@id', xml::xml))::text AS country_id, unnest(xpath('//countries/country/name/text()', xml::xml))::text AS country_name FROM imported_documents WHERE deleted_on IS NULL AND id = %d", id)

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var countries []*types.Country

	for rows.Next() {
		var countryID int
		var countryName string

		err := rows.Scan(&countryID, &countryName)
		if err != nil {
			return nil, err
		}

		country := &types.Country{
			ID: countryID,
			Name: countryName,
		}

		countries = append(countries, country)
	}

	return countries, nil
}
func _defaultGetTeams(id int) ([]*types.Team, error){
	query := fmt.Sprintf("SELECT unnest(xpath('//teams/team/@id', xml::xml))::text AS team_id, unnest(xpath('//teams/team/abbreviation/text()', xml::xml))::text AS team_name FROM imported_documents WHERE deleted_on IS NULL AND id = %d", id)

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teams []*types.Team

	for rows.Next() {
		var teamID int
		var teamName string

		err := rows.Scan(&teamID, &teamName)
		if err != nil {
			return nil, err
		}

		team := &types.Team{
			ID: teamID,
			Abbreviation: teamName,
		}

		teams = append(teams, team)
	}

	return teams, nil
}
func _defaultGetPlayers(id int) ([]*types.Player, error){
	query := fmt.Sprintf("SELECT unnest(xpath('//players/player/@id', xml::xml))::text AS player_id, unnest(xpath('//players/player/name/text()', xml::xml))::text AS player_name FROM imported_documents WHERE deleted_on IS NULL AND id = %d", id)

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var players []*types.Player

	for rows.Next() {
		var playerID int
		var playerName string

		err := rows.Scan(&playerID, &playerName)
		if err != nil {
			return nil, err
		}

		player := &types.Player{
			ID: playerID,
			Name: playerName,
		}
		
		players = append(players, player)
	}

	return players, nil
}


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

func GetAllTeams(id int) ([]*types.Team, error) {
	query := fmt.Sprintf("SELECT unnest(xpath('//teams/team/abbreviation/text()', xml::xml))::text AS team_name FROM imported_documents WHERE deleted_on IS NULL AND id = %d", id)

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close() 

	var teams []*types.Team

	for rows.Next() {
		var teamName string

		err := rows.Scan(&teamName)
		if err != nil {
			return nil, err
		}

		team := &types.Team{
			Abbreviation: teamName, 
		}

		teams = append(teams, team)
	}

	return teams, nil
}

func GetAllPlayers(id int) ([]*types.HandlePlayer, error) {
	collegesInfo, err := _defaultGetColleges(id)
	countriesInfo, err := _defaultGetCountries(id)

	query := fmt.Sprintf(`SELECT
            unnest(xpath('//players/player/name/text()', xml::xml))::text AS player_name,
            unnest(xpath('//players/player/age/text()', xml::xml))::text AS player_age,
            unnest(xpath('//players/player/height/text()', xml::xml))::text AS player_height,
            unnest(xpath('//players/player/weight/text()', xml::xml))::text AS player_weight,
            unnest(xpath('//players/player/draft_year/text()', xml::xml))::text AS player_draft_year,
            unnest(xpath('//players/player/draft_round/text()', xml::xml))::text AS player_draft_round,
            unnest(xpath('//players/player/draft_number/text()', xml::xml))::text AS player_draft_number,
            unnest(xpath('//players/player/@college_ref', xml::xml))::text AS player_college_ref,
			unnest(xpath('//players/player/@country_ref', xml::xml))::text AS player_country_ref
        FROM imported_documents WHERE deleted_on IS NULL AND id = %d`, id)

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var players []*types.HandlePlayer

	for rows.Next() {
		var playerName string
		var playerAge int
		var playerHeight float64
		var playerWeight float64
		var playerDraftYear int
		var playerDraftRound int
		var playerDraftNumber int
		var playerCollegeRef int
		var playerCountryRef int

		err := rows.Scan(&playerName, &playerAge, &playerHeight, &playerWeight, &playerDraftYear, &playerDraftRound, &playerDraftNumber, &playerCollegeRef, &playerCountryRef)
		if err != nil {
			return nil, err
		}

		var playerCollege string
		var playerCountry string

		playerCollege = ""
		if playerCollegeRef != 0 {
			for _, college := range collegesInfo {
				if college.ID == playerCollegeRef {
					playerCollege = college.Name
					break
				}
			}
		}

		for _, country := range countriesInfo {
			if country.ID == playerCountryRef {
				playerCountry = country.Name
				break
			}
		}

		player := &types.HandlePlayer{
			Name: playerName,
			Age: playerAge,
			Height: playerHeight,
			Weight: playerWeight,
			DraftYear: playerDraftYear,
			DraftRound: playerDraftRound,
			DraftNumber: playerDraftNumber,
			College_name: playerCollege,
			Country_name: playerCountry,
		}

		players = append(players, player)
	}

	return players, nil
}

func GetAllEntries(id int) ([]*types.HandleEntry, error) {
	playersInfo, err := _defaultGetPlayers(id)
	teamsInfo, err := _defaultGetTeams(id)

	query := fmt.Sprintf(`SELECT
			unnest(xpath('//entries/entry/season/text()', xml::xml))::text AS season,
			unnest(xpath('//entries/entry/gp/text()', xml::xml))::text AS gp,
			unnest(xpath('//entries/entry/pts/text()', xml::xml))::text AS pts,
			unnest(xpath('//entries/entry/reb/text()', xml::xml))::text AS reb,
			unnest(xpath('//entries/entry/ast/text()', xml::xml))::text AS ast,
			unnest(xpath('//entries/entry/net_rating/text()', xml::xml))::text AS net_rating,
			unnest(xpath('//entries/entry/oreb_pct/text()', xml::xml))::text AS oreb_pct,
			unnest(xpath('//entries/entry/dreb_pct/text()', xml::xml))::text AS dreb_pct,
			unnest(xpath('//entries/entry/usg_pct/text()', xml::xml))::text AS usg_pct,
			unnest(xpath('//entries/entry/ts_pct/text()', xml::xml))::text AS ts_pct,
			unnest(xpath('//entries/entry/ast_pct/text()', xml::xml))::text AS ast_pct,
			unnest(xpath('//entries/entry/@player_ref', xml::xml))::text AS player_ref,
			unnest(xpath('//entries/entry/@team_ref', xml::xml))::text AS team_ref
		FROM imported_documents WHERE deleted_on IS NULL AND id = %d`, id)

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []*types.HandleEntry

	for rows.Next() {
		var season string
		var gp int
		var pts float64
		var reb float64
		var ast float64
		var net_rating float64
		var oreb_pct float64
		var dreb_pct float64
		var usg_pct float64
		var ts_pct float64
		var ast_pct float64
		var player_ref int
		var team_ref int

		err := rows.Scan(&season, &gp, &pts, &reb, &ast, &net_rating, &oreb_pct, &dreb_pct, &usg_pct, &ts_pct, &ast_pct, &player_ref, &team_ref)
		if err != nil {
			return nil, err
		}

		var playerName string
		var teamName string

		for _, player := range playersInfo {
			if player.ID == player_ref {
				playerName = player.Name
			}
		}

		for _, team := range teamsInfo {
			if team.ID == team_ref {
				teamName = team.Abbreviation
			}
		}

		entry := &types.HandleEntry{
			Season: season,
			Gp: gp,
			Pts: pts,
			Reb: reb,
			Ast: ast,
			Net_rating: net_rating,
			Oreb_pct: oreb_pct,
			Dreb_pct: dreb_pct,
			Usg_pct: usg_pct,
			Ts_pct: ts_pct,
			Ast_pct: ast_pct,
			Player_name: playerName,
			Team_name: teamName,
		}

		entries = append(entries, entry)
	}

	return entries, nil
}