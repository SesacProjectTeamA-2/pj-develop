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
import GEnhancedTableToolbar from './GEnhancedTableToolbar';
import GEnhancedTableHead, {
    getComparator,
    stableSort,
} from './GEnhancedTableHead';

export default function MEnhancedTable() {
    const [order, setOrder] = React.useState<any>('asc');
    const [orderBy, setOrderBy] = React.useState<any>('calories');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    interface Data {
        id: number;
        name: string;
        joinDate: any;
        madeGroup: number;
        joinGroup: number;
    }

    function createData(
        id: number,
        name: string,
        joinDate: any,
        madeGroup: number,
        joinGroup: number
    ): Data {
        return {
            id,
            name,
            joinDate,
            madeGroup,
            joinGroup,
        };
    }

    const [allUser, setAllUser] = useState<any>();
    const [allUserInfo, setAllUserInfo] = useState<any>();
    const [allJoinInfo, setAllJoinInfo] = useState<any>();

    const getAllUser = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/users`)
            .then((res) => {
                console.log('getAllUser', res.data);
                setAllUser(res.data);
                setAllUserInfo(res.data.allUser);
                setAllJoinInfo(res.data.joinGroup);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        getAllUser();
    }, []);

    // //; 유저 데이터 들어오는 부분
    const rows = allUserInfo
        ? allUserInfo?.map((user: any, index: number) =>
              createData(
                  user.uSeq,
                  user.uName,
                  `${new Date(user.createdAt).getFullYear()}/${
                      new Date(user.createdAt).getMonth() + 1
                  }/${new Date(user.createdAt).getDate()}`, // user.createdAt,
                  user.tb_groupUsers.filter(
                      (user: any) => user.guIsLeader === 'y'
                  ).length,
                  user.tb_groupUsers.filter(
                      (user: any) => user.guIsLeader === null
                  ).length
              )
          )
        : [];

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
                <GEnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 620 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <GEnhancedTableHead
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
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.name}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            style={{ minWidth: '5rem' }}
                                        >
                                            {row.joinDate}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            style={{ minWidth: '6rem' }}
                                        >
                                            {row.madeGroup}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            style={{ minWidth: '6rem' }}
                                        >
                                            {row.joinGroup}
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
