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
  const [loadedFilters, setLoadedFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    setProcData(null);

    const apiUrl = `http://${process.env.NEXT_PUBLIC_API_PROC_URL}/api/teamSeasonStats`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from ${apiUrl}`);
        if (data.result && data.result.length > 0) {
          // LOADING FILTERS
          if (!loadedFilters) {
            const seasons = new Set();
            const teams = new Set();

            data.result.forEach((entry) => {
              entry.seasons.forEach((season) => {
                seasons.add(season.season);
              });
              teams.add(entry.team);
            });

            const seasonYears = [...seasons].map((season) => parseInt(season.split("-")[0]));
            const minYear = Math.min(...seasonYears);
            const maxYear = Math.max(...seasonYears) + 1;

            setSeasonYearRange([minYear, maxYear]);
            setSelectedYearRange([minYear, maxYear]);

            const sortedTeams = [...teams].sort();
            setAvailableTeams(sortedTeams);

            setLoadedFilters(true);
          }

          // LOADING DATA
          let filteredData = data.result;
          if (selectedTeam) {
            filteredData = data.result.filter((team) => team.team === selectedTeam);
          }

          filteredData.forEach((entry) => {
            entry.seasons = entry.seasons.filter((season) => {
              const seasonYear = parseInt(season.season.split("-")[0]);
              return seasonYear >= selectedYearRange[0] && seasonYear <= selectedYearRange[1];
            });
          });

          setProcData(filteredData);
        }
      })
      .catch((error) => {
        console.error(`Error fetching data from ${apiUrl}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedTeam, selectedYearRange, loadedFilters]);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedData = procData
    ? [...procData].sort((a, b) => {
        if (orderBy === "total_pts") {
          const aPoints = parseInt(a.seasons[0][orderBy]);
          const bPoints = parseInt(b.seasons[0][orderBy]);
          if (order === "asc") {
            return aPoints - bPoints;
          } else {
            return bPoints - aPoints;
          }
        } else if (orderBy === "season") {
          const aSeasonYear = a.seasons[0][orderBy] ? parseInt(a.seasons[0][orderBy].split("-")[0]) : 0;
          const bSeasonYear = b.seasons[0][orderBy] ? parseInt(b.seasons[0][orderBy].split("-")[0]) : 0;
          if (order === "asc") {
            return aSeasonYear - bSeasonYear;
          } else {
            return bSeasonYear - aSeasonYear;
          }
        } else {
          if (order === "asc") {
            return a[orderBy]?.localeCompare(b[orderBy]) || 0;
          } else {
            return b[orderBy]?.localeCompare(a[orderBy]) || 0;
          }
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
          <Typography>Season Year: {selectedYearRange[0]} - {selectedYearRange[1]}</Typography>
        </Grid>
        <Grid item xs>
          <Slider
            value={selectedYearRange}
            onChange={(_, newValue) => {
              // Ensure the values are not the same before updating the state
              if (newValue[0] !== newValue[1]) {
                setSelectedYearRange(newValue);
              }
            }}
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
