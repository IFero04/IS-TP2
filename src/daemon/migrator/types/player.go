package types

type Player struct {
	Name			string	`json:"name"`
    Age 			int		`json:"age"`
    Height 			float64	`json:"height"`
    Weight 			float64	`json:"weight"`
    DraftYear 		int		`json:"draftYear"`
    DraftRound 		int		`json:"draftRound"`
    DraftNumber 	int		`json:"draftNumber"`
    College_ref 	int		`json:"college_ref"` 
    Country_ref 	int		`json:"country_ref"` 
	Abbreviation	string	`json:"abbreviation"`
}
