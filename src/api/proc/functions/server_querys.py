def query_avg_stats_players(server):
    try:
        response = server.avg_stats_players()
        if not response:
            print('\n\nSEM RESULTADOS\n\n')
            return None
        
        return response
    except Exception as e:
        raise ValueError(f"Error retrieving files: {e}")


def query_team_players_per_season(server, season):
    try:
        response = server.team_players_per_season(season)

        if not response:
            print('\n\nSEM RESULTADOS\n\n')
            return None
        
        return response
    except Exception as e:
        raise ValueError(f"Error retrieving files: {e}")


def query_top_players(server):
    try:
        response = server.top_players()

        if not response:
            print('\n\nSEM RESULTADOS\n\n')
            return None
        
        return response	
    except Exception as e:
        raise ValueError(f"Error retrieving files: {e}")


def query_tallest_country(server):
    try:
        response = server.tallest_country()

        if not response:
            print('\n\nSEM RESULTADOS\n\n')
            return None
        
        return response
    except Exception as e:
        raise ValueError(f"Error retrieving files: {e}")


def query_team_season_stats(server):
    try:
        response = server.team_season_stats()
        if not response:
            print('\n\nSEM RESULTADOS\n\n')
            return None
        
        return response
    except Exception as e:
        raise ValueError(f"Error retrieving files: {e}")


def query_list_files(server):
    try:
        response = server.list_files()

        if not response:
            print('\n\nSEM RESULTADOS\n\n')
            return None
        
        return response
    except Exception as e:
        raise ValueError(f"Error retrieving files: {e}")
       

def query_remove_file(server, file_name):
    try:
        response = server.remove_file(file_name)

        if not response:
            print('\n\nSEM RESULTADOS\n\n')
            return None
        
        return response
    except Exception as e:
        raise ValueError(f"Error retrieving files: {e}")