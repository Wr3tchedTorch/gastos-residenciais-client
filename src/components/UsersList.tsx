import useAxios from '../hooks/useAxios'
import User from '../models/User'
import UserRow from './UserRow'

interface ListProps {
    users: User[] | null;    
}

const List = ({users}: ListProps) => {    
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
                return <UserRow user={u}/>
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
  const {response, error, loading} = useAxios<UsersResponse>({
    url: "users",
    method: "get"
  });  

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
      <List users={response.users} />

      <li>
        <ul>Despesas Totais: {response.totalExpenses.toFixed(2)}</ul>
        <ul>Receita Total:   {response.totalIncome.toFixed(2)}</ul>
        <ul>Saldo Liquido:   {(response.totalBalance).toFixed(2)}</ul>
      </li>
    </div>
  )
}

export default UsersList

