import xml.etree.ElementTree as ET


class Team:

    def __init__(self, abbreviation: str):
        Team.counter += 1
        self._id = Team.counter
        self._abbreviation = abbreviation

    def to_xml(self):
        team_element = ET.Element("team")
        team_element.set("id", str(self._id))

        ET.SubElement(team_element, "abbreviation").text = self._abbreviation

        return team_element
    
    def get_id(self):
        return self._id
    
    def get_abbreviation(self):
        return self._abbreviation

    def __str__(self):
        return f"{self._abbreviation} ({self._id})"


Team.counter = 0
