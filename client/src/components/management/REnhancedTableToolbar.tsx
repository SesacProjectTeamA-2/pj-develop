import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarningModal from '../common/modal/WarningModal';

interface EnhancedTableToolbarProps {
    numSelected: number; // 클릭한 개수
    selected: any; // 클릭한 gSeq
}

export default function REnhancedTableToolbar(
    props: EnhancedTableToolbarProps
) {
    const { numSelected, selected } = props;
    console.log(selected);

    const [warningModalSwitch, setWarningModalSwitch] = useState(false);

    const warningModalSwitchHandler = () => {
        setWarningModalSwitch(!warningModalSwitch);
    };

    //; 선택한 유저 삭제 경고 (DELETE)
    const tryDeleteUserHandler = () => {
        warningModalSwitchHandler();

        //] 선택한 유저 삭제 --> Warning Modal 창으로 이동
        // const deleteHandler = async () => {
        //     // selected uSeq 배열 반복
        //     for (const uSeq of selected) {
        //         try {
        //             // 각 userId에 대한 삭제 요청
        //             const res = await axios.delete(
        //                 `${process.env.REACT_APP_DB_HOST}/admin/users/${uSeq}`
        //             );

        //             console.log(`deleteUser ${uSeq}`, res.data);
        //         } catch (err) {
        //             console.log(`error 발생 for userId ${uSeq}: `, err);
        //         }
        //     }
        // };
    };

    return (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme: any) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.activatedOpacity
                            ),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography
                        sx={{
                            flex: '1 1 100%',
                            fontWeight: 'bold',
                            color: '#94897c',
                            fontSize: '1.5rem',
                        }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        신고 내역
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon onClick={tryDeleteUserHandler} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>

            {/* 경고 공통 모달 */}
            <WarningModal
                warningModalSwitch={warningModalSwitch}
                setWarningModalSwitch={setWarningModalSwitch}
                warningModalSwitchHandler={warningModalSwitchHandler}
                action={'관리자 유저 삭제'}
                selectedUSeq={selected}
            />
        </>
    );
}
