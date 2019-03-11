import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = (props) => (
  <Query query={ALL_USERS_QUERY}>
    {
      ({data, loading, error}) => {
        if (loading) { return <p>Loading...</p>}
        return (
          <div>
            <ErrorMessage error={error} />
            <div>
              <h1>Manage Permissions</h1>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {possiblePermissions.map(permission => (
                      <th key={`perission-header-${permission}`}>{permission}</th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.users.map(user => <User key={user.id} user={user} />)
                  }
                </tbody>
              </Table>
            </div>
          </div>
        )
      }
    }
  </Query>
);

class User extends React.Component {
  render() {
    const user = this.props.user;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={`${user.id}-permission-col-${permission}`}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input type="checkbox" id={`${user.id}-permission-${permission}`} checked={user.permissions.includes(permission)} readOnly />
            </label>
          </td>
        ))}
        <td></td>
      </tr>
    );
  }
}

export default Permissions;