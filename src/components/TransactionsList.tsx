import React, { useEffect } from 'react'
import type Transaction from '../models/Transaction';
import TransactionsTable from './TransactionsTable';
import type { TransactionsResponse } from '../Pages/TransactionManagement';

interface TransactionsListProps {
  transactions:    TransactionsResponse[] | undefined;
  setTransactions: React.Dispatch<React.SetStateAction<TransactionsResponse[] | undefined>>;
}

const TransactionsList = ({ transactions, setTransactions }: TransactionsListProps) => {
  
    if (!transactions)
  {
    <p>Os dados não puderam ser carregados</p>;
    return;
  }

  return (
    <div>
      <TransactionsTable
        transactions={transactions} 
        setTransactions={setTransactions} 
      />
    </div>
  )
}

export default TransactionsList
