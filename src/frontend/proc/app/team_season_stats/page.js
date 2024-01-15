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
  Slider,
  Grid,
} from "@mui/material";

function TeamSeasonStats() {
  const [procData, setProcData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedYearRange, setSelectedYearRange] = useState([0, 0]);
  const [seasonYearRange, setSeasonYearRange] = useState([0, 0]);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProcData(null);

    const apiUrl = `http://${process.env.NEXT_PUBLIC_API_PROC_URL}/api/teamSeasonStats`;

    setLoading(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from ${apiUrl}`);
        if (data.result && data.result.length > 0) {
          const seasons = new Set();
          data.result.forEach((entry) => {
            entry.seasons.forEach((season) => {
              seasons.add(season.season);
            });
          });

          const season_years = [...seasons].map((season) => parseInt(season.split("-")[0]));

          setSeasonYearRange([Math.min(...season_years), Math.max(...season_years) + 1]);

          const teams = new Set();
          data.result.forEach((entry) => {
            teams.add(entry.team);
          });

          const sortedTeams = [...teams].sort();

          setAvailableTeams(sortedTeams);

          if (selectedTeam) {
            const filteredData = data.result.filter((team) => team.team === selectedTeam);
            setProcData(filteredData);
          } else {
            setProcData(data.result);
          }
        }
      })
      .catch((error) => {
        console.error(`Error fetching data from ${apiUrl}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedTeam]);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const handleSeasonYearRangeChange = (event, newValue) => {
    setSelectedYearRange(newValue);
  };

  const filteredData = procData
    ? procData.filter(
        (team) =>
          (!selectedTeam || team.team === selectedTeam) &&
          (selectedYearRange.length === 0 ||
            team.seasons.some(
              (season) =>
                seasonYearRange[0] <= parseInt(season.season.split("-")[0]) &&
                parseInt(season.season.split("-")[0]) <= seasonYearRange[1]
            ))
      )
    : null;

  const sortedData = filteredData
    ? [...filteredData].sort((a, b) => {
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
        Team Season Stats
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="team-select-label">Select Team</InputLabel>
        <Select
          labelId="team-select-label"
          id="team-select"
          value={selectedTeam}
          label="Select Team"
          onChange={(e) => setSelectedTeam(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="">
            <em>All Teams</em>
          </MenuItem>
          {availableTeams.map((team) => (
            <MenuItem key={team} value={team}>
              {team}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Typography>Season Year: {seasonYearRange[0]} - {seasonYearRange[1]}</Typography>
        </Grid>
        <Grid item xs>
          <Slider
            value={selectedYearRange}
            onChange={handleSeasonYearRangeChange}
            valueLabelDisplay="auto"
            min={seasonYearRange[0]}
            max={seasonYearRange[1]}
            step={1}
          />
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress style={{ marginTop: "1rem" }} />
      ) : (
        <TableContainer style={{ marginTop: "1rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "team"}
                    direction={orderBy === "team" ? order : "asc"}
                    onClick={() => handleSort("team")}
                  >
                    Team
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "season"}
                    direction={orderBy === "season" ? order : "asc"}
                    onClick={() => handleSort("season")}
                  >
                    Season
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "total_pts"}
                    direction={orderBy === "total_pts" ? order : "asc"}
                    onClick={() => handleSort("total_pts")}
                  >
                    Total Points
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData ? (
                sortedData.map((team) =>
                  team.seasons.map((season) => (
                    <TableRow key={`${team.team}-${season.season}`}>
                      <TableCell>{team.team}</TableCell>
                      <TableCell>{season.season}</TableCell>
                      <TableCell>{season.total_pts}</TableCell>
                    </TableRow>
                  ))
                )
              ) : (
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

export default TeamSeasonStats;
