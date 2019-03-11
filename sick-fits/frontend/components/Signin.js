import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($password: String!, $email: String!) {
    signin(email: $email, password: $password) {
      id
    }
  }
`;

class Signin extends Component {
  state = {
    email: '',
    password: ''
  };

  saveToState = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <Mutation mutation={SIGNIN_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
      {
        (signin, { error, loading }) => {
          return <Form method="post" onSubmit={async (e) => {
            e.preventDefault();
            await signin();
            this.setState({ email: '', password: '' })
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Login to existing account</h2>
              <ErrorMessage error={error} />
              <label htmlFor="email">
                Email
                <input type="email" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} />
              </label>
              <label htmlFor="password">
                Password
                <input type="password" name="password" id="password" placeholder="Password" value={this.state.password} onChange={this.saveToState} />
              </label>
              <input type="submit" value="Sign in"/>
            </fieldset>
          </Form>
        }
      }
      </Mutation>
    );
  }
}

export default Signin;