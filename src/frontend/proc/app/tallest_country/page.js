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
} from "@mui/material";

function TallestCountry() {
  const [tallestCountryData, setTallestCountryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    setTallestCountryData(null);

    const apiUrl = "http://localhost:20004/api/tallestCountry";

    setLoading(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from ${apiUrl}:`, data);
        setTallestCountryData(data.result);
      })
      .catch((error) => {
        console.error(`Error fetching data from ${apiUrl}:`, error);
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

  const sortedData = tallestCountryData
    ? [...tallestCountryData].sort((a, b) => {
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
        Tallest Country
      </Typography>

      {loading ? (
        <CircularProgress style={{ marginTop: "1rem" }} />
      ) : (
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
              {sortedData ? (
                sortedData.map((data) => (
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
      )}
    </Container>
  );
}

export default TallestCountry;
