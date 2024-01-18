"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

// PlayerStats component
function PlayerStats() {
  const [procData, setProcData] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [loadedFilters, setLoadedFilters] = useState(false);

  // useEffect to fetch data from the new API
  useEffect(() => {
    setLoading(true);
    setProcData(null);

    const apiUrl = "http://localhost:20004/api/avgStatsPlayers";

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from ${apiUrl}`);
        if (data.result && data.result.length > 0) {
          // LOADING FILTERS
          if (!loadedFilters) {
            const players = new Set();

            data.result.forEach((item) => {
              players.add(item.player);
            });

            setAvailablePlayers([...players]);
            setLoadedFilters(true);
          }   
          // LOADING DATA
          const player_data = []
          data.result.forEach((item) => {

            console.log(item.stats)
          });


          setProcData(data.result);
        }
      })
      .catch((error) => {
        console.error(`Error fetching data from ${apiUrl}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Function to handle sorting
  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  // Sorting logic
  const sortedData = procData
    ? [...procData].sort((a, b) => {
        const aValue = a.stats.find((stat) => stat.stat === orderBy)?.value || 0;
        const bValue = b.stats.find((stat) => stat.stat === orderBy)?.value || 0;

        return order === "asc" ? aValue - bValue : bValue - aValue;
      })
    : null;

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Player Stats
      </Typography>

      {/* Player filter dropdown */}
      <FormControl fullWidth>
        <InputLabel id="player-select-label">Select Player</InputLabel>
        <Select
          labelId="player-select-label"
          id="player-select"
          value={selectedPlayer}
          label="Select Player"
          onChange={(e) => setSelectedPlayer(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="">
            <em>All Players</em>
          </MenuItem>
          {availablePlayers.map((player) => (
            <MenuItem key={player} value={player}>
              {player}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress style={{ marginTop: "1rem" }} />
      ) : (
        // Displaying the player stats table
        <TableContainer style={{ marginTop: "1rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "player"}
                    direction={orderBy === "player" ? order : "asc"}
                    onClick={() => handleSort("player")}
                  >
                    Player
                  </TableSortLabel>
                </TableCell>
                {/* Table headers for player stats */}
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "gp"}
                    direction={orderBy === "gp" ? order : "asc"}
                    onClick={() => handleSort("gp")}
                  >
                    Games Played
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "pts"}
                    direction={orderBy === "pts" ? order : "asc"}
                    onClick={() => handleSort("pts")}
                  >
                    Points
                  </TableSortLabel>
                </TableCell>
                {/* Include headers for other stats as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Displaying player stats rows */}
              {sortedData ? (
                sortedData.map((player) => (
                  <TableRow key={player.player}>
                    <TableCell>{player.player}</TableCell>
                    {player.stats.map((stat) => (
                      <TableCell key={stat.stat}>{stat.value}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                // Displayed when there is no data
                <TableRow>
                  <TableCell colSpan={3}>No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default PlayerStats;
