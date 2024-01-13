import xml.etree.ElementTree as ET


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
        self._player_ref = 0
        self._team = team
        self._team_ref = 0

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

        entry_element.set("player_ref", str(self._player_ref))
        entry_element.set("team_ref", str(self._team_ref))

        return entry_element
    
    def get_id(self):
        return self._id
    
    def get_player(self):
        return self._player
    
    def get_team(self):
        return self._team
    
    def set_player_ref(self, player_ref):
        self._player_ref = player_ref

    def set_team_ref(self, team_ref):
        self._team_ref = team_ref

    def __str__(self):
        return f"{self._season} ({self._id}"


Entry.counter = 0
