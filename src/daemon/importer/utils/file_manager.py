from utils.db import PostgresDB

def store_converted(cursor, src, file_size, dst):
    try:
        query = '''
            INSERT INTO converted_documents(src, file_size, dst)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING
            RETURNING created_on, updated_on
        '''

        parameters = (src, file_size, dst, )

        cursor.execute(query, parameters)
        response = cursor.fetchone()

        if response:
            created_on, updated_on = response

            if created_on == updated_on:
                return "stored"
            else:
                return "updated"

        return 'not stored/updated'

    except Exception as e:
        raise Exception(f'Error Storing Converted: {e}')

def import_xml(cursor, file_name, xml):
    try:
        query = '''
            INSERT INTO imported_documents(file_name, xml) 
            VALUES (%s, %s)
            ON CONFLICT (file_name) DO UPDATE 
            SET xml = EXCLUDED.xml, updated_on = CURRENT_TIMESTAMP
            RETURNING created_on, updated_on, deleted_on
        '''

        parameters = (file_name, xml, )

        cursor.execute(query, parameters)
        response = cursor.fetchone()

        if response:
            created_on, updated_on, deleted_on = response

            if created_on == updated_on:
                return "stored"
            else:
                return "updated"

        return 'not stored/updated'

    except Exception as e:
        raise Exception(f'Error Storing XML: {e}')

def list_converted():
    try:
        query = '''
            SELECT src
            FROM converted_documents
        '''

        db = PostgresDB('db-xml', '5432', 'is', 'is', 'is')

        response = db.execute_query(query)

        if response:
            data = []
            for item in response:
                file_src = item[0]

                data.append(file_src)

            return data

        return []

    except Exception as e:
        raise Exception(f'Error Listing Converted: {e}')
