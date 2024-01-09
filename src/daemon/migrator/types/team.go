package types

type Team struct {
	ID 				int		`json:"id"`
	Abbreviation	string	`json:"abbreviation"`
}

type TeamResponse struct {
	Status		string      `json:"status"`
	Message 	string      `json:"message"`
	Result  	Team 		`json:"result"`
}

type TeamsResponse struct {
	Status		string      `json:"status"`
	Message 	string      `json:"message"`
	Result  	[]Team 		`json:"result"`
}
