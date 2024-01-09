import xml.etree.ElementTree as ET



class Country:

    def __init__(self, name: str):
        Country.counter += 1
        self._id = Country.counter
        self._name = name

    def to_xml(self):
        country_element = ET.Element("country")
        country_element.set("id", str(self._id))

        ET.SubElement(country_element, "name").text = self._name

        return country_element

    def get_id(self):
        return self._id

    def get_name(self):
        return self._name

    def __str__(self):
        return f"name: {self._name}, id:{self._id}"


Country.counter = 0

