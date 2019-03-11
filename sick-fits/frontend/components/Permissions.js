import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes, { shape } from 'prop-types';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission!], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

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
      ({ data, loading, error }) => {
        if (loading) { return <p>Loading...</p> }
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
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };

  state = {
    permissions: this.props.user.permissions
  }

  onPermissionChange = (e) => {
    const checkbox = e.target;
    const permissions = [...this.state.permissions];

    if (checkbox.checked) {
      permissions.push(checkbox.value);
    } else {
      permissions.filter(permission => permission != checkbox.value);
    }

    this.setState({
      permissions
    });
  }

  render() {
    const user = this.props.user;
    return (
      <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={{
        permissions: this.state.permissions,
        userId: user.id,
      }}>
        {
          (updatePermissions, { loading, error }) => {
            return <>
              { error && <tr><td colSpan="8"><ErrorMessage error={error} /></td></tr> }
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map(permission => (
                  <td key={`${user.id}-permission-col-${permission}`}>
                    <label htmlFor={`${user.id}-permission-${permission}`}>
                      <input type="checkbox" id={`${user.id}-permission-${permission}`} checked={this.state.permissions.includes(permission)} value={permission} onChange={this.onPermissionChange} />
                    </label>
                  </td>
                ))}
                <td>
                  <SickButton type="button" onClick={updatePermissions} aria-disabled={loading} aria-busy={loading}>Update</SickButton>
                </td>
              </tr>
            </>
          }
        }
      </Mutation>
    );
  }
}

export default Permissions;