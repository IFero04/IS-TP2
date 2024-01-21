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

        const [playersMap, teamsMap, entriesData] = await Promise.all([
          fetchDataForType("players"),
          fetchDataForType("teams"),
          fetchDataForType("entries"),
        ]);

        const playersMapById = Object.fromEntries(playersMap.map((player) => [player.id, player]));
        const teamsMapById = Object.fromEntries(teamsMap.map((team) => [team.id, team]));

        const entries = entriesData.map((entry) => ({
          id: entry.id,
          season: entry.season,
          gp: entry.gp,
          pts: entry.pts,
          reb: entry.reb,
          ast: entry.ast,
          net_rating: entry.net_rating,
          oreb_pct: entry.oreb_pct,
          dreb_pct: entry.dreb_pct,
          usg_pct: entry.usg_pct,
          ts_pct: entry.ts_pct,
          ast_pct: entry.ast_pct,
          player: playersMapById[entry.player_ref]?.name || "N/A",
          team: teamsMapById[entry.team_ref]?.abbreviation || "N/A",
        }));

        setMaxDataSize(entries.length);

        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        setData(entries.slice(startIndex, endIndex));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page]);

    return (
        <>
            <h1 sx={{fontSize: "100px"}}>Entries</h1>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{backgroundColor: "lightgray"}}>
                            <TableCell component="th" width={"1px"} align="center">ID</TableCell>
                            <TableCell align="center">Season</TableCell>
                            <TableCell align="center">Player</TableCell>
                            <TableCell align="center">Team</TableCell>
                            <TableCell align="center">GP</TableCell>
                            <TableCell align="center">PTS</TableCell>
                            <TableCell align="center">REB</TableCell>
                            <TableCell align="center">AST</TableCell>
                            <TableCell align="center">Net Rating</TableCell>
                            <TableCell align="center">Oreb Pct</TableCell>
                            <TableCell align="center">Dreb Pct</TableCell>
                            <TableCell align="center">Usg Pct</TableCell>
                            <TableCell align="center">Ts Pct</TableCell>
                            <TableCell align="center">Ast Pct</TableCell>
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
                                        <TableCell component="td" align="center"  scope="row">
                                            {row.season}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.player}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.team}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.gp}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.pts}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.reb}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.ast}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.net_rating}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.oreb_pct}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.dreb_pct}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.usg_pct}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.ts_pct}
                                        </TableCell>
                                        <TableCell component="td" align="center" scope="row">
                                            {row.ast_pct}
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
