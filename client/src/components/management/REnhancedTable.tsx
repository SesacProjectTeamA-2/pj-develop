import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
    Box,
    Checkbox,
    FormControlLabel,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
} from '@mui/material';
import REnhancedTableToolbar from './REnhancedTableToolbar';
import REnhancedTableHead, {
    getComparator,
    stableSort,
} from './REnhancedTableHead';

export default function REnhancedTable() {
    const [order, setOrder] = React.useState<any>('asc');
    const [orderBy, setOrderBy] = React.useState<any>('calories');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    interface Data {
        id: number;
        name: string;
        createdAt: any;
        cDetail: string;
    }

    function createData(
        id: number,
        name: string,
        createdAt: any,
        cDetail: string
    ): Data {
        return {
            id,
            name,
            createdAt,
            cDetail,
        };
    }

    const [allComplain, setAllComplain] = useState<any>();

    //] 신고 GET
    const getAllComplain = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/complain`)
            .then((res) => {
                console.log('getAllComplain', res.data);
                setAllComplain(res.data.result);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        getAllComplain();
    }, []);

    // console.log('gSeqCount 최종 >>>>>', gSeqCountArray);

    //; 유저 데이터 들어오는 부분
    const rows = allComplain;
    //     ? allComplain?.map((complain: any, idx: number) =>
    //           createData(
    //               complain.cuSeq, // uSeq
    //               complain.uName, // 이름
    //               `${new Date(complain.createdAt).getFullYear()}/${
    //                   new Date(complain.createdAt).getMonth() + 1
    //               }/${new Date(complain.createdAt).getDate()}`, // complain.createdAt,
    //               complain.cDetail
    //           )
    //       )
    //     : [];

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: any
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = rows?.map((n: any) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [order, orderBy, page, rowsPerPage, rows]
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, boxShadow: 'none' }}>
                <REnhancedTableToolbar
                    selected={selected}
                    numSelected={selected.length}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 620 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <REnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows?.map((row: any, index: any) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) =>
                                            handleClick(event, row.id)
                                        }
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            align="center"
                                            style={{ minWidth: '6rem' }}
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.name}
                                        </TableCell>
                                        {/* <TableCell
                                            align="right"
                                            style={{
                                                minWidth: '6rem',
                                                padding: '0.3rem',
                                            }}
                                        >
                                            {row.joinDate}
                                        </TableCell> */}
                                        <TableCell
                                            align="right"
                                            style={{ minWidth: '6rem' }}
                                        >
                                            {row.createdAt}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            style={{ minWidth: '6rem' }}
                                        >
                                            {row.cDetail}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={
                    <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
            />
        </Box>
    );
}
