import React, { useEffect, useState } from 'react'
import type { ExpenseType } from '../constants/ExpenseType';
import type { UniqueExpenseType } from '../constants/UniqueExpenseType';
import useAxios from '../hooks/useAxios';
import TransactionsList from '../components/TransactionsList';
import TransactionsForm from '../components/TransactionsForm';

export interface UserSummaryResponse {
    id: number;
    name: string;
    age: number;
}

export interface CategorySummaryResponse {
    id: number;
    description: string;
    expenseType: ExpenseType;
}

export interface TransactionsResponse {
    id: number;
    description: string;
    value: number;
    expenseType: UniqueExpenseType;
    user: UserSummaryResponse;
    category: CategorySummaryResponse;
}

const TransactionManagement = () => {
    const [transactions, setTransactions] = useState<TransactionsResponse[]>();

    const { response, error, loading } = useAxios<TransactionsResponse[]>({
        url: "transactions",
        method: "get"
    });
    
    useEffect(() => {
        if (response == null) {
            return;
        }
        setTransactions(response);        
    }, [response]);

    console.log(transactions);    

    if (error) {
        console.log(error);
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <TransactionsForm setTransactions={setTransactions}/>

            <TransactionsList transactions={transactions} setTransactions={setTransactions}/>
        </div>
    )
}

export default TransactionManagement
