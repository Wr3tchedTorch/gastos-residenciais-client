import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import type { BaseData, Order } from '../types/Table.types';

export interface HeadCell<T> {
  id: keyof T;
  label: string;
  numeric: boolean;
  disablePadding: boolean;
}

interface GenericTableHeadProps<T> {
  headCells: readonly HeadCell<T>[];
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export function GenericTableHead<T extends BaseData>(props: GenericTableHeadProps<T>) {
  const { headCells, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={String(headCell.id)}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={(event) => onRequestSort(event, headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}