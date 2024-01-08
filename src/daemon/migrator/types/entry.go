package types

type Entry struct {
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