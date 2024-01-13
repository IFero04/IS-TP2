import time
import signal, sys
from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler

from db.db import check_db
from functions.ping import ping
from functions.manage_files import list_files, remove_file
from functions.querys import team_season_stats, team_players_per_season, top_players, tallest_country, avg_stats_players

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 9000


if __name__ == "__main__":
    print("Loading DataBase ...")
    while not check_db():
        print("Retrying in 30 seconds ...")
        time.sleep(30)
    print("DataBase loaded.")

    class RequestHandler(SimpleXMLRPCRequestHandler):
        rpc_paths = ('/RPC2',)

    with SimpleXMLRPCServer(('0.0.0.0', PORT), requestHandler=RequestHandler) as server:
        server.register_introspection_functions()

        def signal_handler(signum, frame):
            print("received signal")
            server.server_close()

            # perform clean up, etc. here...
            print("exiting, gracefully")
            sys.exit(0)

        # signals
        signal.signal(signal.SIGTERM, signal_handler)
        signal.signal(signal.SIGHUP, signal_handler)
        signal.signal(signal.SIGINT, signal_handler)

        # register functions
        server.register_function(ping)
        server.register_function(list_files)
        server.register_function(remove_file)
        server.register_function(team_season_stats)
        server.register_function(team_players_per_season)
        server.register_function(top_players)
        server.register_function(tallest_country)
        server.register_function(avg_stats_players)

        # start the server
        print(f"Starting the RPC Server in port {PORT}...")
        server.serve_forever()
