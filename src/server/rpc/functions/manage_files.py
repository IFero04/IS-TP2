from db.db import PostgresDB


def list_files():
    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT id, file_name, migrated
                FROM imported_documents
                WHERE deleted_on IS NULL
            '''
            files = db.execute_query(query, multi=True)

            result = [{'id': file[0], 'name': file[1], 'migrated': file[2]} for file in files]

            print(result)
            return result
    except Exception as e:
        return f"Error: {e}"
    
    
def remove_file(file_name):
    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                UPDATE imported_documents
                SET deleted_on = CURRENT_TIMESTAMP
                WHERE 
                    file_name = %s 
                    AND deleted_on IS NULL 
                RETURNING deleted_on
            '''
            parameters = (file_name, )

            db.execute_query(query, parameters, fetch=False)

            return 'Ficheiro Removido'
    except Exception as e:
        return f"Error: {e}"
        