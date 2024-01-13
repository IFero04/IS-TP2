package types

type HandleEntry struct {
    ID 				int		`json:"id"`
	Season 			string	`json:"season"`
    Gp 				int		`json:"gp"`
    Pts 			float64	`json:"pts"`
    Reb 			float64	`json:"reb"`
    Ast 			float64	`json:"ast"`
    Net_rating 		float64	`json:"net_rating"`
    Oreb_pct 		float64	`json:"oreb_pct"`
    Dreb_pct 		float64	`json:"dreb_pct"`
    Usg_pct 		float64	`json:"usg_pct"`
    Ts_pct 			float64	`json:"ts_pct"`
    Ast_pct 		float64	`json:"ast_pct"`
	Player_ref 		int		`json:"player_ref"`
    Team_ref 		int		`json:"team_ref"`
    Player_name 	string	`json:"player_name"`
    Team_name 		string	`json:"team_name"`
}

type Entry struct {
    ID 				int		`json:"id"`
	Season 			string	`json:"season"`
    Gp 				int		`json:"gp"`
    Pts 			float64	`json:"pts"`
    Reb 			float64	`json:"reb"`
    Ast 			float64	`json:"ast"`
    Net_rating 		float64	`json:"net_rating"`
    Oreb_pct 		float64	`json:"oreb_pct"`
    Dreb_pct 		float64	`json:"dreb_pct"`
    Usg_pct 		float64	`json:"usg_pct"`
    Ts_pct 			float64	`json:"ts_pct"`
    Ast_pct 		float64	`json:"ast_pct"`
	Player_ref 		int		`json:"player_ref"`
    Team_ref 		int		`json:"team_ref"`
}

type EntryResponse struct {
    Status		string      `json:"status"`
    Message 	string      `json:"message"`
    Result  	Entry 		`json:"result"`
}

type EntriesResponse struct {
    Status		string      `json:"status"`
    Message 	string      `json:"message"`
    Result  	[]Entry 	`json:"result"`
}