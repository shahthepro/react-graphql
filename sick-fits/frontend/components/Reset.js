import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import PropTypes from 'prop-types';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $newPassword: String!, $verifyPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword, verifyPassword: $verifyPassword) {
      id
    }
  }
`;

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };

  state = {
    newPassword: '',
    verifyPassword: '',
  };

  saveToState = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <Mutation mutation={RESET_MUTATION} variables={{
        resetToken: this.props.resetToken,
        ...this.state
      }} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
      {
        (reset, { error, loading, called }) => {
          return <Form method="post" onSubmit={async (e) => {
            e.preventDefault();
            await reset();
            this.setState({ email: '' })
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Password</h2>
              <ErrorMessage error={error} />
              { 
                !error && !loading && called && <p>Success! Check your email</p>
              }
              <label htmlFor="newPassword">
                New password
                <input type="password" name="newPassword" id="newPassword" placeholder="New password" value={this.state.newPassword} onChange={this.saveToState} />
              </label>
              <label htmlFor="verifyPassword">
                Verify password
                <input type="password" name="verifyPassword" id="verifyPassword" placeholder="Verify password" value={this.state.verifyPassword} onChange={this.saveToState} />
              </label>
              <input type="submit" value="Reset"/>
            </fieldset>
          </Form>
        }
      }
      </Mutation>
    );
  }
}

export default Reset;