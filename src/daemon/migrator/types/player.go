package types

type HandlePlayer struct {
    ID 				int		`json:"id"`
	Name			string	`json:"name"`
    Age 			int		`json:"age"`
    Height 			float64	`json:"height"`
    Weight 			float64	`json:"weight"`
    DraftYear 		int		`json:"draftYear"`
    DraftRound 		int		`json:"draftRound"`
    DraftNumber 	int		`json:"draftNumber"`
    College_ref 	int		`json:"college_ref"` 
    Country_ref 	int		`json:"country_ref"` 
    College_name 	string	
    Country_name 	string	
}   

type Player struct {
    ID 				int		`json:"id"`
	Name			string	`json:"name"`
    Age 			int		`json:"age"`
    Height 			float64	`json:"height"`
    Weight 			float64	`json:"weight"`
    DraftYear 		int		`json:"draftyear"`
    DraftRound 		int		`json:"draftround"`
    DraftNumber 	int		`json:"draftnumber"`
    College_ref 	int		`json:"college_ref"` 
    Country_ref 	int		`json:"country_ref"` 
}

type PlayerNoCollege struct {
    ID 				int		`json:"id"`
	Name			string	`json:"name"`
    Age 			int		`json:"age"`
    Height 			float64	`json:"height"`
    Weight 			float64	`json:"weight"`
    DraftYear 		int		`json:"draftyear"`
    DraftRound 		int		`json:"draftround"`
    DraftNumber 	int		`json:"draftnumber"`
    Country_ref 	int		`json:"country_ref"` 
}

type PlayerResponse struct {
    Status		string      `json:"status"`
    Message 	string      `json:"message"`
    Result  	Player 		`json:"result"`
}

type PlayersResponse struct {
    Status		string      `json:"status"`
    Message 	string      `json:"message"`
    Result  	[]Player 	`json:"result"`
}