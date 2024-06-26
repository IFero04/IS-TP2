"use client";
import { useCallback, useEffect, useState } from "react";
import {
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const PAGE_SIZE = 25;

export default function PlayersPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const [data, setData] = useState(null);
  const [maxDataSize, setMaxDataSize] = useState(null);
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data from ${process.env.NEXT_PUBLIC_API_ENTITIES_URL}`);

        const fetchDataForType = async (type) => {
          const apiUrl = `http://${process.env.NEXT_PUBLIC_API_ENTITIES_URL}/api/${type}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          return data.result || [];
        };

        const [collegesMap, countriesMap, playersData] = await Promise.all([
          fetchDataForType("colleges"),
          fetchDataForType("countries"),
          fetchDataForType("players"),
        ]);

        const collegesMapById = Object.fromEntries(collegesMap.map((college) => [college.id, college]));
        const countriesMapById = Object.fromEntries(countriesMap.map((country) => [country.id, country]));

        const players = playersData.map((player) => ({
          id: player.id,
          name: player.name,
          age: player.age,
          height: player.height,
          weight: player.weight,
          draftyear: player.draftyear,
          draftround: player.draftround,
          draftnumber: player.draftnumber,
          college: collegesMapById[player.college_ref]?.name || "N/A",
          country: countriesMapById[player.country_ref]?.name || "N/A",
        }));

        setMaxDataSize(players.length);

        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        setData(players.slice(startIndex, endIndex));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page]);

    return (
        <>
            <h1 sx={{fontSize: "100px"}}>Players</h1>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{backgroundColor: "lightgray"}}>
                            <TableCell component="th" width={"1px"} align="center">ID</TableCell>
                            <TableCell>Player Name</TableCell>
                            <TableCell align="center">Age</TableCell>
                            <TableCell align="center">Height</TableCell>
                            <TableCell align="center">Weight</TableCell>
                            <TableCell align="center">Draft Year</TableCell>
                            <TableCell align="center">Draft Round</TableCell>
                            <TableCell align="center">Draft Number</TableCell>
                            <TableCell align="center">College</TableCell>
                            <TableCell align="center">Country</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data ?
                                data.map((row) => (
                                    <TableRow
                                        key={row.id}
                                    >
                                        <TableCell component="td" align="center">
                                            {row.id}
                                        </TableCell>
                                        <TableCell component="td" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.age}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.height}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.weight}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.draftyear}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.draftround}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.draftnumber}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.college}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.country}
                                        </TableCell>
                                    </TableRow>
                                ))
                                :
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <CircularProgress/>
                                    </TableCell>
                                </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                maxDataSize && <Pagination style={{color: "black", marginTop: 8}}
                                           variant="outlined" shape="rounded"
                                           color={"primary"}
                                           onChange={(e, v) => {
                                               router.push(pathname + '?' + createQueryString('page', v))
                                           }}
                                           page={page}
                                           count={Math.ceil(maxDataSize / PAGE_SIZE)}
                />
            }


        </>
    );
}
