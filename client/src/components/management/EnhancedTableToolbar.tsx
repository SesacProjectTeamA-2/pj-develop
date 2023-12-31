import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';

interface EnhancedTableToolbarProps {
    numSelected: number;
}

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;

    //] 유저 삭제
    const deleteHandler = () => {};

    return (
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
                    전체 회원
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon onClick={deleteHandler} />
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
    );
}
