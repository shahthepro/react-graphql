import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Signin from './Signin';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import PropTypes from 'prop-types';


const RequireSignin = (props) => (
  <Query query={CURRENT_USER_QUERY}>
    {
      ({ data, loading, error }) => {
        if (loading) { return <p>loading...</p> }
        if (error) { return <ErrorMessage error={error} />}
        if (!data.me) { return <Signin /> }
        
        return props.children;
      }
    }
  </Query>
);

RequireSignin.propTypes = PropTypes.func.isRequired;

export default RequireSignin;