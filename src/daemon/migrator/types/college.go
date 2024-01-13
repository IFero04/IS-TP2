package types

type College struct {
	ID		int		`json:"id"`
	Name	string	`json:"name"`
}

type CollegeResponse struct {
	Status		string      `json:"status"`
	Message 	string      `json:"message"`
	Result  	College 	`json:"result"`
}

type CollegesResponse struct {
	Status		string      `json:"status"`
	Message 	string      `json:"message"`
	Result  	[]College 	`json:"result"`
}