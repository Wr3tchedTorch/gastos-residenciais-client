import type { AxiosResponse } from 'axios';
import useAxios from '../hooks/useAxios'
import User from '../models/User'
import UserRow from './UserRow'
import { useEffect, useState } from 'react';

interface ListProps {
    users:    User[] | undefined;
    setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
    setTotalExpenses: React.Dispatch<React.SetStateAction<number>>;
    setTotalIncome:   React.Dispatch<React.SetStateAction<number>>;
    setTotalBalance:  React.Dispatch<React.SetStateAction<number>>;
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
}

const List = ({users, setUsers, setTotalExpenses, setTotalIncome, setTotalBalance, totalExpenses, totalIncome, totalBalance}: ListProps) => {    
    const {fetchData} = useAxios<AxiosResponse>({
      url: "users",
      method: "delete",
      manual: true
    });

    const onDeleteUser = async (id: number) => {
      if (id < 0)
      {
        return;
      }

      const params = new URLSearchParams();
      params.append("id", id.toString());
      
      let response: AxiosResponse = await fetchData(params);

      if (response && users && response.status == 200)     
      {        
        var user: User | undefined = users.find(u => u.id == id);

        if (user)
        {
          setTotalExpenses(totalExpenses - user.totalExpenses);
          setTotalIncome(totalIncome     - user.totalIncome);
          setTotalBalance(totalBalance   - user.totalBalance);
        }

        setUsers(users.filter(u => u.id != id));
      }
    }

    return <table>
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Despesas Total (R$)</th>
            <th>Receita Total (R$)</th>
            <th>Saldo (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        {
            users?.map(u => {
                return <UserRow user={u} onDelete={onDeleteUser}/>
            })
        }
    </table>;
};

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
      <List 
        users={users} 
        setUsers={setUsers} 
        setTotalExpenses={setTotalExpenses} 
        setTotalIncome={setTotalIncome} 
        setTotalBalance={setTotalBalance}
        totalExpenses={totalExpenses}
        totalIncome={totalIncome}
        totalBalance={totalBalance}/>

      <li>
        <ul>Despesas Totais: {totalExpenses.toFixed(2)}</ul>
        <ul>Receita Total:   {totalIncome.toFixed(2)}</ul>
        <ul>Saldo Liquido:   {(totalBalance).toFixed(2)}</ul>
      </li>
    </div>
  )
}

export default UsersList

