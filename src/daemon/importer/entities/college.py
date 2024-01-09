import xml.etree.ElementTree as ET


class College:

    def __init__(self, name: str):
        College.counter += 1
        self._id = College.counter
        self._name = name.strip()

    def is_valid(self):
        if self._name in ['No College', '', ]:
            return False

        return True

    def to_xml(self):
        college_element = ET.Element("college")
        college_element.set("id", str(self._id))

        ET.SubElement(college_element, "name").text = str(self._name)

        return college_element

    def get_id(self):
        return self._id
    
    def get_name(self):
        return self._name

    def __str__(self):
        return f"name: {self._name}, id:{self._id}"


College.counter = 0

