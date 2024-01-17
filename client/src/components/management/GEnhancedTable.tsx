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

export default function GEnhancedTable() {
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

    const [allGroup, setAllGroup] = useState<any>();
    const [allGroupUser, setAllGroupUser] = useState<any>();
    const [gSeqCountArray, setGSeqCountArray] = useState<any>();
    // [[gSeq, 유저수]]
    // [[1, 2], [2, 5], ...]

    const getAllGroup = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/groups`)
            .then((res) => {
                console.log('getAllGroup >>>>>>', res.data);
                setAllGroup(res.data.allGroup);
                setAllGroupUser(res.data.groupUserArray);

                // 가공된 그룹 데이터 배열을 담을 상태
                const updatedCategoryAllGroup = res.data.allGroup.map(
                    (group: any) => {
                        // 각 그룹의 카테고리에 따라 가공
                        switch (group.gCategory) {
                            case 'ex':
                                return { ...group, gCategory: '운동' };
                            case 're':
                                return { ...group, gCategory: '독서' };
                            case 'lan':
                                return { ...group, gCategory: '언어' };
                            case 'cert':
                                return { ...group, gCategory: '자격증' };
                            case 'st':
                                return { ...group, gCategory: '스터디' };
                            case 'eco':
                                return { ...group, gCategory: '경제' };
                            case 'it':
                                return { ...group, gCategory: 'IT' };
                            case 'etc':
                                return { ...group, gCategory: '기타' };
                            default:
                                return group;
                        }
                    }
                );

                // 가공된 그룹 데이터 배열을 상태에 저장
                setAllGroup(updatedCategoryAllGroup);

                //; 그룹 전체 인원 카운트
                const gSeqCount: any = [];

                // gSeq 세팅
                for (let i = 0; i < res.data.allGroup?.length; i++) {
                    gSeqCount.push([res.data.allGroup[i].gSeq, 0]);
                }

                console.log('gSeqCount 세팅 >>>>>', gSeqCount);

                for (let i = 0; i < res.data.groupUserArray?.length; i++) {
                    for (let j = 0; j < gSeqCount.length; j++) {
                        if (
                            gSeqCount[j][0] === res.data.groupUserArray[i].gSeq
                        ) {
                            gSeqCount[j][1] += 1;
                        }
                    }
                }

                setGSeqCountArray(gSeqCount);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        getAllGroup();
    }, []);

    // console.log('gSeqCount 최종 >>>>>', gSeqCountArray);

    //; 유저 데이터 들어오는 부분
    const rows = allGroup
        ? allGroup?.map((group: any, idx: number) =>
              createData(
                  group.gSeq,
                  group.gName,
                  `${new Date(group.createdAt).getFullYear()}/${
                      new Date(group.createdAt).getMonth() + 1
                  }/${new Date(group.createdAt).getDate()}`, // group.createdAt,
                  group.gCategory,
                  gSeqCountArray[idx][1] // 전체 인원 수
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
                <GEnhancedTableToolbar
                    selected={selected}
                    numSelected={selected.length}
                />
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
                                            align="left"
                                            style={{
                                                minWidth: '3rem',
                                                paddingLeft: '1.6rem',
                                            }}
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.name}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            style={{
                                                minWidth: '6rem',
                                                padding: '0.3rem',
                                            }}
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
