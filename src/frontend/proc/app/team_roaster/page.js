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
  Button,
  ButtonGroup,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

function TeamRoaster() {
  const [procData, setProcData] = useState(null);
  const [graphqlData, setGraphqlData] = useState(null);

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [availableSeasons] = useState([
    "1996-97",
    "1997-98",
    "1998-99",
    "1999-00",
    "2000-01",
    "2001-02",
    "2002-03",
    "2003-04",
    "2004-05",
    "2005-06",
    "2006-07",
    "2007-08",
    "2008-09",
    "2009-10",
    "2010-11",
    "2011-12",
    "2012-13",
    "2013-14",
    "2014-15",
    "2015-16",
    "2016-17",
    "2017-18",
    "2018-19",
    "2019-20",
    "2020-21",
    "2021-22",
    "2022-23",
  ]);
  const [selectedSeason, setSelectedSeason] = useState("1996-97");
  const [loading, setLoading] = useState(true);
  const [loadedFilters, setLoadedFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    setProcData(null);
    setGraphqlData(null);

    const apiUrlProc = `http://localhost:20004/api/teamPlayers/${selectedSeason}`;

    fetch(apiUrlProc)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from ${apiUrlProc}`);
        if (data.result && data.result.length > 0) {
          // LOADING FILTERS
          if (!loadedFilters) {
            const teams = new Set();
            data.result.forEach((item) => {
              teams.add(item.team);
            });
            const sortedTeams = [...teams].sort();

            setAvailableTeams(sortedTeams);
            setLoadedFilters(true);
          }
          // LOADING DATA
          if (selectedTeam) {
            const filteredData = data.result.filter((team) => team.team === selectedTeam);
            setProcData(filteredData);
          } else {
            setProcData(data.result);
          }
        }
      })
      .catch((error) => {
        console.error(`Error fetching data from ${apiUrlProc}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedSeason, selectedTeam]);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const handleNextSeason = () => {
    const currentIndex = availableSeasons.indexOf(selectedSeason);
    const nextIndex = currentIndex < availableSeasons.length - 1 ? currentIndex + 1 : 0;
    setSelectedSeason(availableSeasons[nextIndex]);
  };

  const handlePrevSeason = () => {
    const currentIndex = availableSeasons.indexOf(selectedSeason);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : availableSeasons.length - 1;
    setSelectedSeason(availableSeasons[prevIndex]);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const sortedProcData = procData
    ? [...procData].sort((a, b) => {
        if (order === "asc") {
          return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1;
        }
      })
    : null;

  const sortedGraphqlData = graphqlData
  ? [...graphqlData].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    })
  : null;

  return (
    <Container maxWidth="x1">
      <Typography variant="h3" align="center" gutterBottom>
        Team Roster
      </Typography>

      {availableSeasons.length > 0 && (
        <>
          <ButtonGroup style={{ marginBottom: "1rem" }}>
            <Button onClick={handlePrevSeason}>Previous Season</Button>
            <Button disabled>{selectedSeason}</Button>
            <Button onClick={handleNextSeason}>Next Season</Button>
          </ButtonGroup>
        </>
      )}

      <FormControl fullWidth style={{ marginBottom: "1rem" }}>
        <InputLabel id="team-select-label">Select Team</InputLabel>
        <Select
          labelId="team-select-label"
          id="team-select"
          value={selectedTeam}
          label="Select Team"
          onChange={handleTeamChange}
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

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress style={{ marginTop: "1rem" }} />
        </div>
      ) : (
        <Grid container spacing={3} style={{ marginTop: "1rem" }}>
          <Grid item xs={12} sm={6} style={{ textAlign: "left" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Data from Proc API
            </Typography>
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
                        active={orderBy === "player"}
                        direction={orderBy === "player" ? order : "asc"}
                        onClick={() => handleSort("player")}
                      >
                        Player
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "age"}
                        direction={orderBy === "age" ? order : "asc"}
                        onClick={() => handleSort("age")}
                      >
                        Age
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProcData ? (
                    sortedProcData.map((team) =>
                      team.players.map((player) => (
                        <TableRow key={`${team.team}-${player.name}`}>
                          <TableCell>{team.team}</TableCell>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{player.age}</TableCell>
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
          </Grid>
          <Grid item xs={12} sm={6} style={{ textAlign: "left" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Data from GraphQL API
            </Typography>
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
                        active={orderBy === "player"}
                        direction={orderBy === "player" ? order : "asc"}
                        onClick={() => handleSort("player")}
                      >
                        Player
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "age"}
                        direction={orderBy === "age" ? order : "asc"}
                        onClick={() => handleSort("age")}
                      >
                        Age
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedGraphqlData ? (
                    sortedGraphqlData.map((team) =>
                      team.players.map((player) => (
                        <TableRow key={`${team.team}-${player.name}`}>
                          <TableCell>{team.team}</TableCell>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{player.age}</TableCell>
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
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default TeamRoaster;
