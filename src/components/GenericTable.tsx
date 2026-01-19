import * as React from 'react';
import { Box, Paper, TableContainer, Table, TableBody, TablePagination } from '@mui/material';
import { GenericTableToolbar } from './GenericTableToolbar';
import { GenericTableHead, type HeadCell } from './GenericTableHead';
import { getComparator, type BaseData, type Order } from '../types/Table.types';

interface GenericTableProps<T extends BaseData> {
  title: string;
  data: T[];
  headCells: readonly HeadCell<T>[];
  initialOrderBy: keyof T;
  handleDeletion: (ids: readonly T['id'][]) => void;
  renderRow: (row: T, isSelected: boolean, handleClick: (id: T['id']) => void) => React.ReactNode;
}

export default function GenericTable<T extends BaseData>({
  title,
  data,
  headCells,
  initialOrderBy,
  handleDeletion,
  renderRow
}: GenericTableProps<T>) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>(initialOrderBy);
  const [selected, setSelected] = React.useState<readonly T['id'][]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (_: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: T['id']) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly T['id'][] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }
    setSelected(newSelected);
  };

  const visibleRows = React.useMemo(
    () => [...data].sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, order, orderBy, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <GenericTableToolbar numSelected={selected.length} title={title} onDelete={() => { setSelected([]); handleDeletion(selected); }}/>
        <TableContainer>
          <Table sx={{ minWidth: 750  }}>
            <GenericTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={String(orderBy)}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row) => {
                const isSelected = selected.includes(row.id);
                return renderRow(row, isSelected, handleClick);
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>
    </Box>
  );
}