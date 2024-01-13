package types

type Country struct {
	ID		int		`json:"id"`
	Name	string	`json:"name"`
}

type CountryResponse struct {
	Status		string      `json:"status"`
	Message 	string      `json:"message"`
	Result  	Country 	`json:"result"`
}

type CountriesResponse struct {
	Status		string      `json:"status"`
	Message 	string      `json:"message"`
	Result  	[]Country 	`json:"result"`
}