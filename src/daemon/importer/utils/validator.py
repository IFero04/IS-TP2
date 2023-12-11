from xmlschema import XMLSchema


def validate_xml(xml_document):
    # Load XML Schema
    schema = XMLSchema('utils/validators/nba_validator.xsd')

    if not schema:
        raise Exception('Dind´t found any schema')

    try:
        schema.validate(xml_document)
    except Exception as e:
        raise Exception(e)
