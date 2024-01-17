from db.db import PostgresDB


def __calculate_average(data):
    total = sum(data)
    count = len(data)
    if count == 0:
        return 0
    return round((total / count), 2)


def avg_stats_players():
    players = all_players()

    if not players:
        return []

    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT DISTINCT  
                    unnest(xpath('//entries/entry/@player_ref', xml::xml))::text AS player_ref,
                    unnest(xpath('//entries/entry/gp/text()', xml::xml))::text AS gp,
                    unnest(xpath('//entries/entry/pts/text()', xml::xml))::text AS pts,
                    unnest(xpath('//entries/entry/reb/text()', xml::xml))::text AS reb,
                    unnest(xpath('//entries/entry/ast/text()', xml::xml))::text AS ast,
                    unnest(xpath('//entries/entry/net_rating/text()', xml::xml))::text AS net_rating,
                    unnest(xpath('//entries/entry/oreb_pct/text()', xml::xml))::text AS oreb_pct,
                    unnest(xpath('//entries/entry/dreb_pct/text()', xml::xml))::text AS dreb_pct,
                    unnest(xpath('//entries/entry/usg_pct/text()', xml::xml))::text AS usg_pct,
                    unnest(xpath('//entries/entry/ts_pct/text()', xml::xml))::text AS ts_pct,
                    unnest(xpath('//entries/entry/ast_pct/text()', xml::xml))::text AS ast_pct
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''
            entries = db.execute_query(query, multi=True)

            player_stats = {}
            for entry in entries:
                player = players[entry[0]]
                stats = {
                    'gp': int(entry[1]),
                    'pts': float(entry[2]),
                    'reb': float(entry[3]),
                    'ast': float(entry[4]),
                    'net_rating': float(entry[5]),
                    'oreb_pct': float(entry[6]),
                    'dreb_pct': float(entry[7]),
                    'usg_pct': float(entry[8]),
                    'ts_pct': float(entry[9]),
                    'ast_pct': float(entry[10]),
                }
                if player not in player_stats:
                    player_stats[player] = {
                        'gp': [],
                        'pts': [],
                        'reb': [],
                        'ast': [],
                        'net_rating': [],
                        'oreb_pct': [],
                        'dreb_pct': [],
                        'usg_pct': [],
                        'ts_pct': [],
                        'ast_pct': [],
                    }
                for stat, value in stats.items():
                    player_stats[player][stat].append(value)
            averages = {}
            for player, stats in player_stats.items():
                averages[player] = {
                    stat: __calculate_average(data) for stat, data in stats.items()
                }

            result = []
            for player, stats in averages.items():
                player_stats = {'player': player, 'stats': []}
                for stat, value in stats.items():
                    player_stats['stats'].append({'stat': stat, 'value': value})
                result.append(player_stats)

            return result
    except Exception as e:
        print(f"Error: {e}")
        return []


def team_players_per_season(season='2001-02'):
    teams = all_teams()

    if not teams:
        return []

    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT DISTINCT  
                    unnest(xpath('//entries/entry/@player_ref', xml::xml))::text AS player_ref,
                    unnest(xpath('//entries/entry/@team_ref', xml::xml))::text AS teamf_ref,
                    unnest(xpath('//entries/entry/season/text()', xml::xml))::text AS season
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''
            entries = db.execute_query(query, multi=True)
            entries = filter(lambda x: x[2] == season, entries)

            query = '''
                SELECT DISTINCT
                    unnest(xpath('//players/player/@id', xml::xml))::text AS player_id,
                    unnest(xpath('//players/player/name/text()', xml::xml))::text AS player_name,
                    unnest(xpath('//players/player/age/text()', xml::xml))::text AS player_age
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''

            players = db.execute_query(query, multi=True)
            players_info = {}
            for player in players:
                player_id = player[0]
                player_name = player[1]
                player_age = player[2]
                players_info[player_id] = {'name': player_name, 'age': player_age}

            team_data = {}
            for entry in entries:
                player_info = players_info.get(entry[0])
                player_team = teams.get(entry[1])

                if player_team not in team_data:
                    team_data[player_team] = []

                team_data[player_team].append(player_info)

            result = []
            for team, players_list in team_data.items():
                team_players = {'team': team, 'players': []}
                for player in players_list:
                    team_players['players'].append(player)
                result.append(team_players)

            return result
    except Exception as e:
        print(f"Error: {e}")
        return []


def top_players():
    countries = all_countries()

    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT DISTINCT  
                    unnest(xpath('//players/player/name/text()', xml::xml))::text AS player_name,
                    unnest(xpath('//players/player/draft_year/text()', xml::xml))::text AS draft_year,
                    unnest(xpath('//players/player/draft_round/text()', xml::xml))::text AS draft_round,
                    unnest(xpath('//players/player/draft_number/text()', xml::xml))::text AS draft_number,
                    unnest(xpath('//players/player/age/text()', xml::xml))::text AS player_age,
                    unnest(xpath('//players/player/height/text()', xml::xml))::text AS player_height,
                    unnest(xpath('//players/player/weight/text()', xml::xml))::text AS player_weight,
                    unnest(xpath('//players/player/@country_ref', xml::xml))::text AS player_country_ref
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''
            players = db.execute_query(query, multi=True)

            years = set(map(lambda x: x[1], filter(lambda x: x[1] != '0', players)))
            top_player_per_year = []

            for year in years:
                filtered_players = filter(lambda player: player[1] == year and player[3] != '0' and player[4] != '0', players)
                sorted_players = sorted(filtered_players, key=lambda x: (int(x[3]), int(x[4])))
                top_player_per_year.append(sorted_players[0])
            
            top_player_per_year = sorted(top_player_per_year, key=lambda x: int(x[1]))

            result = [{"name": player[0],
                        "age": player[4],
                        "height": player[5],
                        "weight": player[6],
                        "country": countries[player[7]],
                        "draft_year": player[1],
                        "draft_round": player[2],
                        "draft_number": player[3]
                    } for player in top_player_per_year]

            return result
    except Exception as e:
        print(f"Erro: {e}")
        return []


def tallest_country():
    countries = all_countries()

    if not countries:
        return []

    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT 
                    unnest(xpath('//players/player/name/text()', xml::xml))::text AS player_name,
                    unnest(xpath('//players/player/height/text()', xml::xml))::text AS player_height,
                    unnest(xpath('//players/player/@country_ref', xml::xml))::text AS player_country_ref
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''
            players = db.execute_query(query, multi=True)
            unique_players = set()
            filtered_players = []
            for player in players:
                key = player[0]
                if key not in unique_players:
                    unique_players.add(key)
                    filtered_players.append(player)

            country_num_players = {}
            country_total_height = {}
            for player in filtered_players:
                player_height = round(float(player[1]), 2)
                player_country = countries[player[2]]

                if player_country not in country_num_players:
                    country_num_players[player_country] = 0
                    country_total_height[player_country] = 0
                
                country_num_players[player_country] += 1
                country_total_height[player_country] += player_height

            countries_data = {}
            for country, num_players in country_num_players.items():
                if num_players >= 5:
                    countries_data[country] = round(country_total_height[country] / num_players, 2)

            countries_data_sorted = sorted(countries_data.items(), key=lambda x: x[1], reverse=True)
            rank = 1
            prev_avg_height = countries_data_sorted[0][1]

            result = []
            for country, avg_height in countries_data_sorted:
                if avg_height < prev_avg_height:
                    rank += 1
                result.append({"country": country, "num_players": country_num_players[country], "avg_height": avg_height, "rank": rank})
                prev_avg_height = avg_height

            return result
    except Exception as e:
        print(f"Erro: {e}")
        return []


def team_season_stats():
    teams = all_teams()

    if not teams:
        return []

    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT DISTINCT  
                    unnest(xpath('//entries/entry/season/text()', xml::xml))::text AS entry_season,
                    unnest(xpath('//entries/entry/pts/text()', xml::xml))::text AS entry_pts,
                    unnest(xpath('//entries/entry/@team_ref', xml::xml))::text AS entry_team
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''
            entries = db.execute_query(query, multi=True)

            team_data = {}
            for entry in entries:
                season = entry[0]
                pts = float(entry[1])
                team = teams[entry[2]]

                if team not in team_data:
                    team_data[team] = {}

                if season not in team_data[team]:
                    team_data[team][season] = 0

                team_data[team][season] += pts
                
            result = []
            for team, seasons in team_data.items():
                team_entry = {'team': team, 'seasons': []}
                for season, total_pts in sorted(seasons.items(), key=lambda x: x[1], reverse=True):
                    team_entry['seasons'].append({'season': season, 'total_pts': round(total_pts, 2)})
                result.append(team_entry)

            return result
    except Exception as e:
        print(f"Error: {e}")
        return []


""" DEFAULT """


def all_players():
    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT DISTINCT  
                    unnest(xpath('//players/player/name/text()', xml::xml))::text AS player_name,
                    unnest(xpath('//players/player/@id', xml::xml))::text AS player_id
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''
            players = db.execute_query(query, multi=True)

            players_dictionary = {}
            for player in players:
                player_name = player[0]
                player_id = player[1]
                players_dictionary[player_id] = player_name

            return players_dictionary
    except Exception as e:
        print(f"Error: {e}")
        return None


def all_teams():
    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT DISTINCT  
                    unnest(xpath('//teams/team/abbreviation/text()', xml::xml))::text AS team_name,
                    unnest(xpath('//teams/team/@id', xml::xml))::text AS team_id
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''
            teams = db.execute_query(query, multi=True)

            teams_dictionary = {}
            for team in teams:
                team_name = team[0]
                team_id = team[1]
                teams_dictionary[team_id] = team_name

            return teams_dictionary
    except Exception as e:
        print(f"Error: {e}")
        return None


def all_countries():
    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT DISTINCT
                unnest(xpath('//countries/country/name/text()', xml::xml))::text AS country_name,
                unnest(xpath('//countries/country/@id', xml::xml))::text AS country_id
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''
            countries = db.execute_query(query)

            countries_dictionary = {}
            for country in countries:
                country_name = country[0]
                country_id = country[1]
                countries_dictionary[country_id] = country_name

            return countries_dictionary
    except Exception as e:
        print(f"Error: {e}")
        return None


def all_colleges():
    try:
        with PostgresDB('db-xml', '5432', 'is', 'is', 'is') as db:
            query = '''
                SELECT DISTINCT
                unnest(xpath('//colleges/college/name/text()', xml::xml))::text AS college_name,
                unnest(xpath('//colleges/college/@id', xml::xml))::text AS college_id
                FROM imported_documents
                WHERE deleted_on IS NULL;
            '''
            colleges = db.execute_query(query)

            colleges_dictionary = {}
            for college in colleges:
                college_name = college[0]
                college_id = college[1]
                colleges_dictionary[college_id] = college_name

            return colleges_dictionary
    except Exception as e:
        print(f"Error: {e}")
        return None