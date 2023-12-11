import xml.etree.ElementTree as ET
from utils.str_to_ascii import str_to_ascii


class Entry:

    def __init__(self, season, gp, pts, reb, ast, net_rating, oreb_pct
                 , dreb_pct, usg_pct, ts_pct, ast_pct, player, team):
        Entry.counter += 1
        self._id = Entry.counter
        self._season = season
        self._gp = gp
        self._pts = pts
        self._reb = reb
        self._ast = ast
        self._net_rating = net_rating
        self._oreb_pct = oreb_pct
        self._dreb_pct = dreb_pct
        self._usg_pct = usg_pct
        self._ts_pct = ts_pct
        self._ast_pct = ast_pct
        self._player = player
        self._team = team

    def to_xml(self):

        entry_element = ET.Element("entry")
        entry_element.set("id", str(self._id))

        ET.SubElement(entry_element, "season").text = str(self._season)
        ET.SubElement(entry_element, "gp").text = str(self._gp)
        ET.SubElement(entry_element, "pts").text = str(self._pts)
        ET.SubElement(entry_element, "reb").text = str(self._reb)
        ET.SubElement(entry_element, "ast").text = str(self._ast)
        ET.SubElement(entry_element, "net_rating").text = str(self._net_rating)
        ET.SubElement(entry_element, "oreb_pct").text = str(self._oreb_pct)
        ET.SubElement(entry_element, "dreb_pct").text = str(self._dreb_pct)
        ET.SubElement(entry_element, "usg_pct").text = str(self._usg_pct)
        ET.SubElement(entry_element, "ts_pct").text = str(self._ts_pct)
        ET.SubElement(entry_element, "ast_pct").text = str(self._ast_pct)

        entry_element.set("player_ref", str_to_ascii(str(self._player).strip()))
        entry_element.set("team_ref", str_to_ascii(str(self._team).strip()))

        return entry_element

    def __str__(self):
        return f"{self._season} ({self._id}"


Entry.counter = 0
