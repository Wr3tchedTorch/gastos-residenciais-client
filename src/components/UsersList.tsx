import useAxios from '../hooks/useAxios'
import User from '../models/User'
import { useEffect, useState } from 'react';
import { Chip, Stack } from '@mui/material';
import UsersTable from './UsersTable';

interface UsersResponse {
  totalIncome:   number;
  totalExpenses: number;
  totalBalance:  number;
  users: User[] | null;
}

const UsersList = () => {  
  const [users, setUsers] = useState<User[]>();
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncome, setTotalIncome]     = useState<number>(0);
  const [totalBalance, setTotalBalance]   = useState<number>(0);

  const {response, error, loading} = useAxios<UsersResponse>({
    url: "users",
    method: "get"
  });  

  useEffect(() => {
    console.log("retriggering response");
    

    if (!response)
    {
      return;
    }
    if (response.users)
    {
      setUsers(response.users);      
    }

    setTotalExpenses(response.totalExpenses);
    setTotalIncome(response.totalIncome);
    setTotalBalance(response.totalBalance);

  }, [response]);
  
  if (error)
  {
    console.log(error);    
  }

  if (loading) {
    return <p>Loading...</p>;  
  }

  if (!response)
  {
    <p>Os dados não puderam ser carregados</p>;
    return;
  }

  return (
    <div>
      <UsersTable 
        users={users} 
        setUsers={setUsers} 

        setTotalExpenses={setTotalExpenses} 
        setTotalIncome={setTotalIncome} 
        setTotalBalance={setTotalBalance}
      />


      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
        <Chip label={"Despesas Totais (R$): " + totalExpenses.toFixed(2)} variant="filled" color='info'/>
        <Chip label={"Receita Total (R$): "   + totalIncome.toFixed(2)}   variant="filled" color='info'/>
        <Chip label={"Saldo Liquido (R$): "   + totalBalance.toFixed(2)}  variant="filled" color={totalBalance < 0 ? 'error' : 'info'}/>
      </Stack>
    </div>
  )
}

export default UsersList

