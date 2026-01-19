import React from 'react'
import useAxios from '../hooks/useAxios';
import type { AxiosResponse } from 'axios';
import type { BaseData } from '../types/Table.types';
import type { HeadCell } from './GenericTableHead';
import GenericTable from './GenericTable';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import type User from '../models/User';

interface UsersTableProps {
    users:    User[] | undefined;
    setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
    
    setTotalExpenses: React.Dispatch<React.SetStateAction<number>>;
    setTotalIncome:   React.Dispatch<React.SetStateAction<number>>;
    setTotalBalance:  React.Dispatch<React.SetStateAction<number>>;
}

const UsersTable = ({users, setUsers, setTotalExpenses, setTotalIncome, setTotalBalance}: UsersTableProps) => {    
    const {fetchData} = useAxios<AxiosResponse>({
      url: "users",
      method: "delete",
      manual: true
    });

  interface UserTable extends BaseData {
    id: number;
    name: string;
    age: number;
    totalExpenses: number;
    totalIncome: number;
    totalBalance: number;    
  }

  const usersCells: HeadCell<UserTable>[] = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Nome' },
    { id: 'age', numeric: true, disablePadding: false, label: 'Idade' },
    { id: 'totalExpenses', numeric: true, disablePadding: false, label: 'Despesas (R$)' },
    { id: 'totalIncome', numeric: true, disablePadding: false, label: 'Receita (R$)' },
    { id: 'totalBalance', numeric: true, disablePadding: false, label: 'Saldo (R$)' },
  ];

  if (users == undefined)
  {
    return <p>No users available</p>;
  }
  
  const usersForTable: UserTable[] = users.map((user) => ({
    id: user.id!,
    name: user.name,
    age: user.age,
    totalExpenses: user.totalExpenses,
    totalIncome: user.totalIncome,
    totalBalance: user.totalBalance,
  }));

  const onDelete = async (ids: readonly number[]) => {
    const usersToDelete = users?.filter(u => ids.includes(u.id!)) || [];
  
    const sumExpenses = usersToDelete.reduce((acc, u) => acc + u.totalExpenses, 0);
    const sumIncome = usersToDelete.reduce((acc, u) => acc + u.totalIncome, 0);
    const sumBalance = usersToDelete.reduce((acc, u) => acc + u.totalBalance, 0);

    await Promise.all(ids.map(id => {
      const params = new URLSearchParams();
      params.append("id", id.toString());      
      return fetchData(params);
    }));

    setTotalExpenses(prev => prev - sumExpenses);
    setTotalIncome(prev => prev - sumIncome);
    setTotalBalance(prev => prev - sumBalance);
    setUsers(prev => prev?.filter(u => !ids.includes(u.id!)));
  }
    
    return (<GenericTable     
      handleDeletion={onDelete}
      title="Usuários Cadastrados"
      data={usersForTable}
      headCells={usersCells}
      initialOrderBy="totalBalance"
      renderRow={(row, isSelected, handleClick) => (
        <TableRow
            key={row.id} 
            selected={isSelected} 
            hover 
            onClick={() => handleClick(row.id)}
        >
          <TableCell padding="checkbox"><Checkbox checked={isSelected} /></TableCell>
          <TableCell align="left">{row.name}</TableCell>
          <TableCell align="left">{row.age}</TableCell>
          <TableCell align="left">{row.totalExpenses}</TableCell>
          <TableCell align="left">{row.totalIncome}</TableCell>
          <TableCell align="left">{row.totalBalance}</TableCell>
        </TableRow>
      )}
    />);
};

export default UsersTable;