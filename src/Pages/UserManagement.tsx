import { useState } from 'react';
import UserForm from '../components/UserForm';
import UsersList from './../components/UsersList';
import type User from '../models/User';
import useAxios from '../hooks/useAxios';

export interface UsersResponse {
  totalIncome:   number;
  totalExpenses: number;
  totalBalance:  number;
  users: User[] | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>();

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

  return (
    <div>
      <UserForm setUsers={setUsers}/>

      <UsersList users={users} setUsers={setUsers} response={response} />
    </div>
  )
}

export default UserManagement
