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


function PlayerStats() {
  const [procData, setProcData] = useState(null);
  const [selectedRange, setSelectedRange] = useState("");
  const [availableGroups, setAvailableGroups] = useState([
    "A - D",
    "E - H",
    "I - L",
    "M - P",
    "Q - T",
    "U - X",
    "Y - Z",
  ]);
  const [orderBy, setOrderBy] = useState("player");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setProcData(null);

    const apiUrl = "http://localhost:20004/api/avgStatsPlayers";

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from ${apiUrl}`);
        if (data.result && data.result.length > 0) {
          const players_data = data.result.map((item) => {
            return {
              player: item.player,
              gp: item.stats.find((stat) => stat.stat === "gp")?.value || 0,
              pts: item.stats.find((stat) => stat.stat === "pts")?.value || 0,
              reb: item.stats.find((stat) => stat.stat === "reb")?.value || 0,
              ast: item.stats.find((stat) => stat.stat === "ast")?.value || 0,
              net_rating: item.stats.find((stat) => stat.stat === "net_rating")?.value || 0,
              oreb_pct: item.stats.find((stat) => stat.stat === "oreb_pct")?.value || 0,
              dreb_pct: item.stats.find((stat) => stat.stat === "dreb_pct")?.value || 0,
              usg_pct: item.stats.find((stat) => stat.stat === "usg_pct")?.value || 0,
              ts_pct: item.stats.find((stat) => stat.stat === "ts_pct")?.value || 0,
              ast_pct: item.stats.find((stat) => stat.stat === "ast_pct")?.value || 0,
            };
          });

          if (selectedRange) {
            const [startLetter, endLetter] = selectedRange.split(" - ");
            const filteredData = players_data.filter(
              (item) =>
                item.player[0] >= startLetter && item.player[0] <= endLetter
            );
            setProcData(filteredData);
          } else {
            setProcData(players_data);
          }
        }
      })
      .catch((error) => {
        console.error(`Error fetching data from ${apiUrl}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRange]);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedData = procData
    ? [...procData].sort((a, b) => {
        if (order === "asc") {
          return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1;
        }
      })
    : null;

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Player Stats
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="letters-range-select-label">Select Range</InputLabel>
        <Select
          labelId="letters-range-select-label"
          id="letters-range-select"
          value={selectedRange}
          label="Select Range"
          onChange={(e) => setSelectedRange(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="">
            <em>All Players</em>
          </MenuItem>
          {availableGroups.map((group) => (
            <MenuItem key={group} value={group}>
              {group}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress style={{ marginTop: "1rem" }} />
      ) : (
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
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "reb"}
                    direction={orderBy === "reb" ? order : "asc"}
                    onClick={() => handleSort("reb")}
                  >
                    Rebounds
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "ast"}
                    direction={orderBy === "ast" ? order : "asc"}
                    onClick={() => handleSort("ast")}
                  >
                    Assists
                  </TableSortLabel>
                </TableCell>
                {/* Include other headers for additional stats */}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData ? (
                sortedData.map((player) => (
                  <TableRow key={player.player}>
                    <TableCell>{player.player}</TableCell>
                    <TableCell>{player.gp}</TableCell>
                    <TableCell>{player.pts}</TableCell>
                    <TableCell>{player.reb}</TableCell>
                    <TableCell>{player.ast}</TableCell>
                    {/* Include other cells for additional stats */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No data available</TableCell>
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
