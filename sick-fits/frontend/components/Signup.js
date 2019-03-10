import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($name: String!, $password: String!, $email: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
    }
  }
`;

class Signup extends Component {
  state = {
    name: '',
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
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
      {
        (signup, { error, loading }) => {
          return <Form method="post" onSubmit={(e) => {
            e.preventDefault();
            signup();
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Create an account</h2>
              <ErrorMessage error={error} />
              <label htmlFor="email">
                Email
                <input type="email" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} />
              </label>
              <label htmlFor="name">
                Name
                <input type="text" name="name" id="name" placeholder="Name" value={this.state.name} onChange={this.saveToState} />
              </label>
              <label htmlFor="password">
                Password
                <input type="password" name="password" id="password" placeholder="Password" value={this.state.password} onChange={this.saveToState} />
              </label>
              <input type="submit" value="Create"/>
            </fieldset>
          </Form>
        }
      }
      </Mutation>
    );
  }
}

export default Signup;