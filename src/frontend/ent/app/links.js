import ChecklistIcon from "@mui/icons-material/Checklist";
import {Home, Flag, People, Person, School} from "@mui/icons-material";


const LINKS = [
    {text: 'Home', href: '/', icon: Home},
    {text: 'Players', href: '/players', icon: Person },
    {text: 'Teams', href: '/teams', icon: People},
    {text: 'Countries', href: '/countries', icon: Flag },
    {text: 'Colleges', href: '/colleges', icon: School },
    {text: 'Entries', href: '/entries', icon: ChecklistIcon}
];
export default LINKS;