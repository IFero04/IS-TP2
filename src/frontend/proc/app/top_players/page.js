"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

function TopPlayers() {
  const [selectedYearRange, setSelectedYearRange] = useState("");
  const [procData, setProcData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    setProcData(null);

    const apiUrl = `http://${process.env.NEXT_PUBLIC_API_PROC_URL}/api/topPlayers`;

    setLoading(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from ${apiUrl}`);
        if (data.result && data.result.length > 0) {
          const years = data.result.map((player) => parseInt(player.draft_year, 10));
          const startYear = Math.min(...years);
          const endYear = Math.max(...years);
          setAvailableYears(generateYearList(startYear, endYear));
        }

        if (selectedYearRange) {
          const filteredData = data.result.filter((player) => player.draft_year >= selectedYearRange && player.draft_year <= (parseInt(selectedYearRange, 10) + 9));
          setProcData(filteredData);
        } else {
          setProcData(data.result);
        }
      })
      .catch((error) => {
        console.error(`Error fetching data from ${apiUrl}:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedYearRange]);

  const generateYearList = (startYear, endYear) => {
    const yearList = [];
    for (let year = startYear; year <= endYear; year += 10) {
      yearList.push(year.toString());
    }
    return yearList;
  };

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
        Top Players
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="year-select-label">Select Year Range</InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          value={selectedYearRange}
          label="Select Year Range"
          onChange={(e) => setSelectedYearRange(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="">
            <em>All Years</em>
          </MenuItem>
          {availableYears.map((year) => (
            <MenuItem key={year} value={year}>
              {`${year} - ${parseInt(year, 10) + 9}`}
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
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Name
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
                    active={orderBy === "draft_number"}
                    direction={orderBy === "draft_number" ? order : "asc"}
                    onClick={() => handleSort("draft_number")}
                  >
                    Draft Number
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "draft_round"}
                    direction={orderBy === "draft_round" ? order : "asc"}
                    onClick={() => handleSort("draft_round")}
                  >
                    Draft Round
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "height"}
                    direction={orderBy === "height" ? order : "asc"}
                    onClick={() => handleSort("height")}
                  >
                    Height
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "weight"}
                    direction={orderBy === "weight" ? order : "asc"}
                    onClick={() => handleSort("weight")}
                  >
                    Weight
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "draft_year"}
                    direction={orderBy === "draft_year" ? order : "asc"}
                    onClick={() => handleSort("draft_year")}
                  >
                    Year
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData ? (
                sortedData.map((data) => (
                  <TableRow key={data.name}>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.age}</TableCell>
                    <TableCell>{data.country}</TableCell>
                    <TableCell>{data.draft_number}</TableCell>
                    <TableCell>{data.draft_round}</TableCell>
                    <TableCell>{data.height}</TableCell>
                    <TableCell>{data.weight}</TableCell>
                    <TableCell>{data.draft_year}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>No players data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default TopPlayers;
