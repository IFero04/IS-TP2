import psycopg2


class PostgresDB:
    def __init__(self, host, port, database, user, password):
        self.__exited = False
        self.cursor = None
        self.connection = None
        self.create_connection(host, port, database, user, password)

    def __enter__(self):
        return self.init_transaction()

    def __exit__(self, exc_type, exc_value, traceback):
        self.__exited = True
        if exc_type is None:
            self.connection.commit()
            print("Transaction committed successfully!")
        else:
            self.connection.rollback()
            print(f"Transaction rolled back. Error: {exc_type}: {exc_value}")
        self.close_cursor()
        self.close_connection()

    def create_connection(self, host, port, database, user, password):
        self.connection = psycopg2.connect(
            dbname=database,
            user=user,
            password=password,
            host=host,
            port=port
        )

    def close_connection(self):
        if self.connection is not None:
            self.close_cursor()
            self.connection.close()
            self.connection = None

    def close_cursor(self):
        if self.cursor is not None:
            self.cursor.close()
            self.cursor = None

    def init_transaction(self):
        self.connection.autocommit = False
        self.cursor = self.connection.cursor()
        return self

    def end_transaction(self):
        try:
            self.connection.commit()
            print("Transaction committed successfully!")
        except Exception as e:
            self.connection.rollback()
            raise Exception(f'Transaction rolled back. Error: {e}')
        finally:
            self.close_cursor()

    def execute_query(self, query, parameters=None, multi=True):
        if self.__exited: raise Exception("PostgresTransaction already exited")
        if not self.cursor: raise Exception("No transaction initiated")

        try:
            if parameters:
                self.cursor.execute(query, parameters)
            else:
                self.cursor.execute(query)

            if multi:
                return self.cursor.fetchall()

            return self.cursor.fetchone()

        except psycopg2.DatabaseError as exception:
            self.close_cursor()
            raise Exception(exception)