import React from 'react'
import type Transaction from '../models/Transaction';
import useAxios from '../hooks/useAxios';
import type { AxiosResponse } from 'axios';
import type { BaseData } from '../types/Table.types';
import type { UniqueExpenseType } from '../constants/UniqueExpenseType';
import type { HeadCell } from './GenericTableHead';
import GenericTable from './GenericTable';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import type { TransactionsResponse } from '../Pages/TransactionManagement';

interface TransactionsTableProps {
    transactions:    TransactionsResponse[] | undefined;
    setTransactions: React.Dispatch<React.SetStateAction<TransactionsResponse[] | undefined>>;
}

const TransactionsTable = ({ transactions, setTransactions }: TransactionsTableProps) => {
    const { fetchData } = useAxios<AxiosResponse>({
        url: "transactions",
        method: "delete",
        manual: true
    });

    interface TransactionTable extends BaseData {
        id: number;
        description: string;
        value: number;
        expenseType: UniqueExpenseType;
        userName: string;
        categoryDescription: string;
    }

    const transactionsCells: HeadCell<TransactionTable>[] = [
        { id: 'description', numeric: false, disablePadding: true, label: 'Descrição' },
        { id: 'value', numeric: true, disablePadding: false, label: 'Valor (R$)' },
        { id: 'expenseType', numeric: true, disablePadding: false, label: 'Tipo' },
        { id: 'userName', numeric: true, disablePadding: false, label: 'Usuário' },
        { id: 'categoryDescription', numeric: true, disablePadding: false, label: 'Categoria' },
    ];

    if (transactions == undefined) {
        return <p>No transactions available</p>;
    }

    const transactionsForTable: TransactionTable[] = transactions.map((transaction) => ({
        id: transaction.id!,
        description: transaction.description,
        value: transaction.value,
        expenseType: transaction.expenseType,
        userName: transaction.user?.name || '',
        categoryDescription: transaction.category?.description || '',
    }));

    const onDelete = async (ids: readonly number[]) => {
        await Promise.all(ids.map(id => {
            const params = new URLSearchParams();
            params.append("id", id.toString());
            return fetchData(params);
        }));

        setTransactions(prev => prev?.filter(u => !ids.includes(u.id!)));
    }

    return (<GenericTable
        handleDeletion={onDelete}
        title="Transações Cadastradas"
        data={transactionsForTable}
        headCells={transactionsCells}
        initialOrderBy="value"
        renderRow={(row, isSelected, handleClick) => (
            <TableRow
                key={row.id}
                selected={isSelected}
                hover
                onClick={() => handleClick(row.id)}
            >
                <TableCell padding="checkbox"><Checkbox checked={isSelected} /></TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">{row.value}</TableCell>
                <TableCell align="left">{row.expenseType}</TableCell>
                <TableCell align="left">{row.userName}</TableCell>
                <TableCell align="left">{row.categoryDescription}</TableCell>
            </TableRow>
        )}
    />);
}

export default TransactionsTable
