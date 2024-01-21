"use client";
import {useCallback, useEffect, useState} from "react";
import {
    CircularProgress,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {useSearchParams, useRouter, usePathname} from 'next/navigation';


export default function CountriesPage({pagea}) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    );
    const [data, setData] = useState(null);
    const [maxDataSize, setMaxDataSize] = useState(null);

    const page = parseInt(searchParams.get('page')) || 1;
    const PAGE_SIZE = 25;

    useEffect(() => {
        setData(null);
        setMaxDataSize(null);

        setTimeout(() => {
            console.log(`fetching from ${process.env.NEXT_PUBLIC_API_ENTITIES_URL}`)
            
            const apiUrl = `http://${process.env.NEXT_PUBLIC_API_ENTITIES_URL}/api/countries`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.result && data.result.length > 0) {
                        setMaxDataSize(data.result.length);
                        setData(data.result.filter((item, index) => Math.floor(index / PAGE_SIZE) === (page - 1)));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        }, 500);
    }, [page])

    return (
        <>
            <h1 sx={{fontSize: "100px"}}>Countries</h1>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{backgroundColor: "lightgray"}}>
                            <TableCell component="th" width={"1px"} align="center">ID</TableCell>
                            <TableCell>Country Name</TableCell>
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
