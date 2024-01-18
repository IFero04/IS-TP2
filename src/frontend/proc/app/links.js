import {Home, PersonSearch, People, Star,Terrain, QueryStats} from "@mui/icons-material";


const LINKS = [
    {text: 'Home', href: '/', icon: Home},
    {text: 'Players Stats', href: '/player_stats', icon: PersonSearch},
    {text: 'Top Players', href: '/top_players', icon: Star},
    {text: 'Tallest Country', href: '/tallest_country', icon: Terrain},
    {text: 'Team Season Stats', href: '/team_season_stats', icon: QueryStats},
    {text: 'Team Roaster', href: '/team_roaster', icon: People},
];
export default LINKS;