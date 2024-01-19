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
  Grid,
} from "@mui/material";

function TallestCountry() {
  const [procData, setProcData] = useState(null);
  const [graphqlData, setGraphqlData] = useState(null);

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setProcData(null);
    setGraphqlData(null);

    const apiUrlProc = "http://localhost:20004/api/tallestCountry";

    fetch(apiUrlProc)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from ${apiUrlProc}:`, data);

        setProcData(data.result);
      })
      .catch((error) => {
        console.error(`Error fetching data from ${apiUrlProc}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
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
        Tallest Country
      </Typography>

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
                        active={orderBy === "rank"}
                        direction={orderBy === "rank" ? order : "asc"}
                        onClick={() => handleSort("rank")}
                      >
                        Rank
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "country"}
                        direction={orderBy === "country" ? order : "asc"}
                        onClick={() => handleSort("country")}
                      >
                        Country
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "avg_height"}
                        direction={orderBy === "avg_height" ? order : "asc"}
                        onClick={() => handleSort("avg_height")}
                      >
                        Average Height
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "num_players"}
                        direction={orderBy === "num_players" ? order : "asc"}
                        onClick={() => handleSort("num_players")}
                      >
                        Number of Players
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProcData ? (
                    sortedProcData.map((data) => (
                      <TableRow key={data.country}>
                        <TableCell>{data.rank}</TableCell>
                        <TableCell>{data.country}</TableCell>
                        <TableCell>{data.avg_height}</TableCell>
                        <TableCell>{data.num_players}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>No data available</TableCell>
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
                        active={orderBy === "rank"}
                        direction={orderBy === "rank" ? order : "asc"}
                        onClick={() => handleSort("rank")}
                      >
                        Rank
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "country"}
                        direction={orderBy === "country" ? order : "asc"}
                        onClick={() => handleSort("country")}
                      >
                        Country
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "avg_height"}
                        direction={orderBy === "avg_height" ? order : "asc"}
                        onClick={() => handleSort("avg_height")}
                      >
                        Average Height
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "num_players"}
                        direction={orderBy === "num_players" ? order : "asc"}
                        onClick={() => handleSort("num_players")}
                      >
                        Number of Players
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedGraphqlData ? (
                    sortedGraphqlData.map((data) => (
                      <TableRow key={data.country}>
                        <TableCell>{data.rank}</TableCell>
                        <TableCell>{data.country}</TableCell>
                        <TableCell>{data.avg_height}</TableCell>
                        <TableCell>{data.num_players}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>No data available</TableCell>
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

export default TallestCountry;
