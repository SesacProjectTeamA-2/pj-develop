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
    // const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [selected, setSelected] = useState<any>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    interface Data {
        id: number;
        user: string; // 신고자
        cuSeq: number; // 신고자의 번호
        name: string; // 피신고자
        uSeq: number; // 피신고자의 번호
        gName: string;
        gSeq: any;
        cDetail: string;
        createdAt: any;
        done: string;
    }

    function createData(
        id: number,
        user: string,
        cuSeq: number,
        name: string,
        uSeq: number,
        gName: string,
        gSeq: any,
        cDetail: string,
        createdAt: any,
        done: string
    ): Data {
        return {
            id,
            user,
            cuSeq,
            name,
            uSeq,
            gName,
            gSeq,
            cDetail,
            createdAt,
            done,
        };
    }

    const [allComplain, setAllComplain] = useState<any>();
    const [gNameComplain, setGNameComplain] = useState<any>();
    const [cuNameComplain, setCuNameComplain] = useState<any>();

    //] 신고 GET
    const getAllComplain = async () => {
        const res = await axios
            .get(`${process.env.REACT_APP_DB_HOST}/admin/complain`)
            .then((res) => {
                console.log('getAllComplain', res.data);
                setAllComplain(res.data.result);
                setGNameComplain(res.data.gNameArray);
                setCuNameComplain(res.data.cuNameArray);
            })
            .catch((err) => {
                console.log('error 발생: ', err);
            });
    };

    useEffect(() => {
        getAllComplain();
    }, []);

    // console.log('gSeqCount 최종 >>>>>', gSeqCountArray);
    // console.log('setGNameComplain', gNameComplain);

    //; 유저 데이터 들어오는 부분
    const rows = allComplain
        ? allComplain?.map((complain: any, idx: number) =>
              createData(
                  idx,
                  complain.cuSeq, // 신고자의 번호
                  //   complain.uName, // 신고자
                  complain.uName, // 피신고자
                  complain.uName, // 피신고자
                  complain.uSeq, // 피신고자의 번호
                  complain.gName, // 모임명
                  complain.gSeq,
                  complain.cDetail, // 신고 내용
                  `${new Date(complain.createdAt).getFullYear()}/${
                      new Date(complain.createdAt).getMonth() + 1
                  }/${new Date(complain.createdAt).getDate()}`, // complain.createdAt,
                  complain.isDone === 0 ? '미처리' : '완료' // 처리 여부
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

    //) [이전]
    // const handleSelectAllClick = (
    //     event: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //     if (event.target.checked) {
    //         const newSelected = rows?.map((n: any) => n.id);
    //         setSelected(newSelected);
    //         return;
    //     }
    //     setSelected([]);
    // };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = rows?.map((n: any) => ({
                id: n.id,
                uSeq: n.uSeq, // 피신고자의 번호
                uName: n.name, // 피신고자의 번호
                guBanReason: n.cDetail,
                gSeq: n.gSeq,
                gName: getGNameByGSeq(n.gSeq),
            }));
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    //) [이전]
    // const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    //     const selectedIndex = selected.indexOf(id);
    //     let newSelected: readonly number[] = [];

    //     if (selectedIndex === -1) {   // 없을 경우
    //         newSelected = newSelected.concat(selected, id);  // 선택된 id를 추가
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1)
    //         );
    //     }
    //     setSelected(newSelected);

    //     console.log('newSelected>>>>>>', newSelected);
    // };

    const handleClick = (
        event: React.MouseEvent<unknown>,
        index: number,
        id: number,
        uSeq: number,
        uName: string,
        cDetail: string,
        gSeq: number,
        gName: string
    ) => {
        // const selectedIndex = selected.indexOf(id);
        const selectedIndex = selected.findIndex((item: any) => item.id === id);
        let newSelected: readonly any[] = [];

        console.log('selectedIndex', selectedIndex);
        console.log('id', id);
        console.log('index', index);

        //) 선택되지 않은 경우, 선택된 배열에 새로운 항목 추가
        if (selectedIndex === -1) {
            newSelected = [
                ...selected,
                { id: index, uSeq, uName, guBanReason: cDetail, gSeq, gName },
            ];
            // newSelected = [
            //     { id: newSelected.concat(selected, id), guBanReason: cDetail },
            // ];

            // console.log('selectedIndex === -1 @@@@@@@@@@');
        } else if (selectedIndex === 0) {
            //) 이미 선택된 경우, 해당 항목을 배열에서 제거
            newSelected = selected.filter((item: any) => item.id !== id);
            // newSelected = [
            //     {
            //         id: newSelected.concat(selected.slice(1)),
            //         guBanReason: cDetail,
            //     },
            // ];
            // console.log(' selectedIndex === 0 @@@@@@@@@@');
        } else if (selectedIndex === selected.length - 1) {
            newSelected = selected.filter((item: any) => item.id !== id);
            //) 마지막 재선택했을 경우
            // 0 1 2 에서
            // 2를 선택하면 3-1
            // 마지막만 제거
            // newSelected = [
            //     {
            //         id: newSelected.concat(selected.slice(0, -1)),
            //         guBanReason: cDetail,
            //     },
            // ];

            // console.log('selectedIndex === selected.length - 1) @@@@@@@@@@');

            //) 선택된 항목이 있을 경우
        } else if (selectedIndex > 0) {
            newSelected = [
                ...selected.slice(0, selectedIndex),
                ...selected.slice(selectedIndex + 1),
            ];
            // console.log('selectedIndex > 0) @@@@@@@@@@');

            // newSelected = [
            //     {
            //         id: newSelected.concat(
            //             selected.slice(0, selectedIndex),
            //             selected.slice(selectedIndex + 1)
            //         ),
            //         guBanReason: cDetail,
            //     },
            // ];
        }

        setSelected(newSelected);

        console.log('newSelected>>>>>>', newSelected);
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

    const isSelected = (id: number) =>
        selected.findIndex((item: any) => item.id === id) !== -1;

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

    //-- gSeq에 해당하는 gName을 가져오는 함수
    const getGNameByGSeq = (gSeq: any) => {
        const gNameInfo = gNameComplain.find((item: any) => item.gSeq === gSeq);
        return gNameInfo ? gNameInfo.gName : '';
    };

    //-- uSeq에 해당하는 uName을 가져오는 함수
    const getUNameByUSeq = (cuSeq: any) => {
        const uNameInfo = cuNameComplain.find(
            (item: any) => item.uSeq === cuSeq
        );
        return uNameInfo ? uNameInfo.uName : '';
    };

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
                                // const isItemSelected = isSelected(row.id);
                                const isItemSelected = isSelected(index);
                                // const isItemSelected = isSelected({
                                //     id: row.id,
                                //     guBanReason: row.cDetail,
                                // });

                                console.log(
                                    'isItemSelected>>>>>>',
                                    isItemSelected
                                );

                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) =>
                                            handleClick(
                                                event,
                                                index,
                                                row.id,
                                                row.uSeq,
                                                row.name,
                                                row.cDetail,
                                                row.gSeq,
                                                getGNameByGSeq(row.gSeq)
                                            )
                                        }
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            {row.isDone === 0 && (
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby':
                                                            labelId,
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            // id={labelId}
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            align="left"
                                            style={{
                                                // minWidth: '1rem',
                                                paddingLeft: '0.8rem',
                                            }}
                                        >
                                            {/* {row.id} */}
                                            {index + 1}
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            // style={
                                            //     {
                                            //         // minWidth: '1rem',
                                            //         //     // paddingLeft: '1rem',
                                            //     }
                                            // }
                                        >
                                            {getUNameByUSeq(row.user)}
                                            {/* 신고자 */}
                                        </TableCell>
                                        <TableCell
                                            align="left"
                                            style={{
                                                minWidth: '4rem',
                                                //     // paddingLeft: '1rem',
                                            }}
                                        >
                                            {row.name}
                                            {/* 피신고자 */}
                                        </TableCell>

                                        <TableCell
                                            align="center"
                                            style={{
                                                minWidth: '4.7rem',
                                                // paddingRight: '1.6rem',
                                                padding: '0',
                                            }}
                                        >
                                            {getGNameByGSeq(row.gSeq)}
                                            {/* {row.gSeq}) */}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            style={{ minWidth: '6rem' }}
                                        >
                                            {row.cDetail}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            style={{ padding: '0' }}
                                        >
                                            {row.createdAt}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            style={{ minWidth: '4rem' }}
                                        >
                                            {row.done}
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
