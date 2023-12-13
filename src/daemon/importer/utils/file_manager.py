def store_converted(db, src, file_size):
    try:
        query = '''
            INSERT INTO converted_documents(src, file_size)
            VALUES (%s, %s)
            ON CONFLICT (src) DO NOTHING
            RETURNING id, created_on, updated_on
        '''

        parameters = (src, file_size, )
        response = db.execute_query(query=query, parameters=parameters,multi=False)

        if response is not None:
            csv_id, created_on, updated_on = response

            if created_on == updated_on:
                return "stored", csv_id
            else:
                return "updated", csv_id

        return None, None

    except Exception as e:
        raise Exception(f'Error Storing Converted: {e}')

def import_xml(db, file_name, xml, csv_id):
    try:
        query = '''
            INSERT INTO imported_documents(file_name, xml, csv_id) 
            VALUES (%s, %s, %s)
            ON CONFLICT (file_name) DO UPDATE 
            SET xml = EXCLUDED.xml, updated_on = CURRENT_TIMESTAMP
            RETURNING created_on, updated_on, deleted_on
        '''

        parameters = (file_name, xml, csv_id,)

        response = db.execute_query(query=query, parameters=parameters,multi=False)

        if response is not None:
            created_on, updated_on, deleted_on = response

            if created_on == updated_on:
                return "stored"
            else:
                return "updated"

        return None

    except Exception as e:
        raise Exception(f'Error Storing XML: {e}')

def list_converted(db):
    try:
        query = '''
            SELECT src
            FROM converted_documents
        '''

        response = db.execute_query(query=query, multi=True)

        if response is not None:
            data = []
            for item in response:
                file_src = item[0]

                data.append(file_src)

            return data

        return []

    except Exception as e:
        raise Exception(f'Error Listing Converted: {e}')
