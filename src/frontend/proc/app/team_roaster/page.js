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
} from "@mui/material";


function TeamRoaster() {
  const [procData, setProcData] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("1996-97");
  const [seasons] = useState([
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
        "2022-23"
    ]);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    setProcData(null);

    const apiUrl = `http://localhost:20004/api/teamPlayers/${selectedSeason}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from ${apiUrl}`);
        if (data.result && data.result.length > 0) {
          setProcData(data.result);
        }
      })
      .catch((error) => {
        console.error(`Error fetching data from ${apiUrl}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedSeason]);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const handleNextSeason = () => {
    const currentIndex = seasons.indexOf(selectedSeason);
    const nextIndex = currentIndex < seasons.length - 1 ? currentIndex + 1 : 0;
    setSelectedSeason(seasons[nextIndex]);
  };

  const handlePrevSeason = () => {
    const currentIndex = seasons.indexOf(selectedSeason);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : seasons.length - 1;
    setSelectedSeason(seasons[prevIndex]);
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
        Team Roster
      </Typography>

      {seasons.length > 0 && (
        <>
          <ButtonGroup style={{ marginBottom: "1rem" }}>
            <Button onClick={handlePrevSeason}>Previous Season</Button>
            <Button disabled>{selectedSeason}</Button>
            <Button onClick={handleNextSeason}>Next Season</Button>
          </ButtonGroup>
        </>
      )}

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
              {sortedData ? (
                sortedData.map((team) =>
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
      )}
    </Container>
  );
}

export default TeamRoaster;