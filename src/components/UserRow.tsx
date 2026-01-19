import type User from '../models/User';

interface UserRowProps {
    user:          User;
}

const UserRow = ({user}: UserRowProps) => {
  return (
    <tbody key={user.id}>
        <tr>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.totalExpenses.toFixed(2)}</td>
            <td>{user.totalIncome .toFixed(2)}</td>
            <td>{user.totalBalance.toFixed(2)}</td>
        </tr>
    </tbody>
  )
}

export default UserRow
