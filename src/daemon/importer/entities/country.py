import xml.etree.ElementTree as ET
from utils.str_to_ascii import str_to_ascii


class Country:

    def __init__(self, name: str):
        self._id = str_to_ascii(name.strip())
        self._name = name

    def to_xml(self):
        country_element = ET.Element("country")
        country_element.set("id", str(self._id))

        ET.SubElement(country_element, "name").text = self._name

        return country_element

    def __str__(self):
        return f"name: {self._name}, id:{self._id}"
