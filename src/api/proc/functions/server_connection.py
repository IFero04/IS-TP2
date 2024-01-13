import xmlrpc.client


class RPCServer:
    def __init__(self):
        self.server = None
        self.connect_to_server()

    def __enter__(self):
        self.connect_to_server()
        return self.server
    
    def __exit__(self, exc_type, exc_value, traceback):
        self.close_connection()

    def connect_to_server(self):
        try:
            self.server = xmlrpc.client.ServerProxy('http://rpc-server:9000')
            response = self.server.ping('Ping')
            if response != 'Pong':
                raise ValueError("Invalid response from the server")
            
        except Exception as e:
            raise ValueError(f"Failed to connect to the server: {e}")
    
    def close_connection(self):
        self.server = None