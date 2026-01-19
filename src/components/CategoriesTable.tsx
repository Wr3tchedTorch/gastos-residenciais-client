import React from 'react'
import useAxios from '../hooks/useAxios';
import type { AxiosResponse } from 'axios';
import type { BaseData } from '../types/Table.types';
import type { HeadCell } from './GenericTableHead';
import type { ExpenseType } from '../constants/ExpenseType';
import type Category from '../models/Category';
import GenericTable from './GenericTable';
import { Checkbox, TableCell, TableRow } from '@mui/material';

interface CategoriesTableProps {
    categories:    Category[] | undefined;
    setCategories: React.Dispatch<React.SetStateAction<Category[] | undefined>>;
}

const CategoriesTable = ({ categories, setCategories }: CategoriesTableProps) => {
      const {fetchData} = useAxios<AxiosResponse>({
      url: "categories",
      method: "delete",
      manual: true
    });

  interface CategoryTable extends BaseData {
    id: number;
    description: string;
    expenseType: ExpenseType;
  }

  const categoriesCells: HeadCell<CategoryTable>[] = [
    { id: 'description', numeric: false, disablePadding: true, label: 'Descrição' },
    { id: 'expenseType', numeric: false, disablePadding: false, label: 'Tipo de Despesa' },
  ];

  if (categories == undefined)
  {
    return <p>Sem categorias disponiveis.</p>;
  }

  const categoriesForTable: CategoryTable[] = categories.map((category) => ({
    id: category.id!,
    description: category.description,
    expenseType: category.expenseType,
  }));

  const onDelete = async (ids: readonly number[]) => {
    await Promise.all(ids.map(id => {
      const params = new URLSearchParams();
      params.append("id", id.toString());      
      return fetchData(params);
    }));

    setCategories(prev => prev?.filter(u => !ids.includes(u.id!)));
  }
    
    return (<GenericTable     
      handleDeletion={onDelete}
      title="Categorias Cadastradas"
      data={categoriesForTable}
      headCells={categoriesCells}
      initialOrderBy="expenseType"
      renderRow={(row, isSelected, handleClick) => (
        <TableRow
            key={row.id} 
            selected={isSelected} 
            hover 
            onClick={() => handleClick(row.id)}
        >
          <TableCell padding="checkbox"><Checkbox checked={isSelected} /></TableCell>
          <TableCell align="left">{row.description}</TableCell>
          <TableCell align="left">{row.expenseType}</TableCell>
        </TableRow>
      )}
    />);
}

export default CategoriesTable
