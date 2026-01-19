import { Toolbar, Typography, Tooltip, IconButton, alpha, Divider, Container } from '@mui/material';
import { GridDeleteIcon } from '@mui/x-data-grid';

interface GenericTableToolbarProps {
  numSelected: number;
  title: string;
  onDelete: () => void;
}

export function GenericTableToolbar({ numSelected, title, onDelete }: GenericTableToolbarProps) {
  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
        numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Container style={{marginBottom: 15, marginTop: 20}}>
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
              {title}
            </Typography>
            <Divider/>            
            <Typography sx={{ flex: '1 1 100%' }} variant="subtitle2" id="tableSubtitle" component="div">
              Selecione um ou mais itens para excluir
            </Typography>
        </Container>
      )}
      <Tooltip title={numSelected > 0 ? "Delete" : "Filter list"}>
        <IconButton>
          {numSelected > 0 && <GridDeleteIcon onClick={onDelete}/>}
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}