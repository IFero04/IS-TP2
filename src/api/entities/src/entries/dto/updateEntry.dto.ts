export class UpdateEntryDto {
    season?: string;
    gp?: number;
    pts?: number;
    reb?: number;
    ast?: number;
    net_rating?: number;
    oreb_pct?: number;
    dreb_pct?: number;
    usg_pct?: number;
    ts_pct?: number;
    ast_pct?: number;

    player_ref?: number;
    team_ref?: number;
}