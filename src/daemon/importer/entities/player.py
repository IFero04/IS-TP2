import xml.etree.ElementTree as ET


class Player:

    def __init__(self, name, age, height, weight, draft_year, draft_round, draft_number, college, country):
        Player.counter += 1
        self._id = Player.counter
        self._name = name
        self._age = age
        self._height = height
        self._weight = weight
        self._draft_year = draft_year
        self._draft_round = draft_round
        self._draft_number = draft_number
        self._college = college
        self._college_ref = 0
        self._country = country
        self._country_ref = 0

    def to_xml(self):
        player_element = ET.Element("player")
        player_element.set("id", str(self._id))

        ET.SubElement(player_element, "name").text = self._name
        ET.SubElement(player_element, "age").text = str(round(float(self._age)))
        ET.SubElement(player_element, "height").text = str(self._height)
        ET.SubElement(player_element, "weight").text = str(self._weight)

        if str(self._draft_year).strip() == 'Undrafted':
            self._draft_year = 0
        ET.SubElement(player_element, "draft_year").text = str(self._draft_year)
        if str(self._draft_round).strip() == 'Undrafted':
            self._draft_round = 0
        ET.SubElement(player_element, "draft_round").text = str(self._draft_round)
        if str(self._draft_number).strip() == 'Undrafted':
            self._draft_number = 0
        ET.SubElement(player_element, "draft_number").text = str(self._draft_number)

        if str(self._college).strip() not in ['None', '', ' ', 'No College']:
            player_element.set("college_ref", str(self._college_ref))
        else:
            player_element.set("college_ref", "0")
        player_element.set("country_ref", str(self._country_ref))

        return player_element

    def get_id(self):
        return self._id
    
    def get_name(self):
        return self._name
    
    def get_college(self):
        return self._college
    
    def get_country(self):
        return self._country
    
    def set_college_ref(self, college_ref):
        self._college_ref = college_ref

    def set_country_ref(self, country_ref):
        self._country_ref = country_ref

    def __str__(self):
        return f"{self._name}, age:{self._age}, college:{self._college} ref:{self._college_ref}, country:{self._country} ref: {self._country_ref}"


Player.counter = 0
