import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  update = (cache, { data: { removeFromCart: { id } }}) => {
    const currentUser = cache.readQuery({ query: CURRENT_USER_QUERY });

    const updatedUser = {
      me: {
        ...currentUser.me,
        cart: currentUser.me.cart.filter(cartItem => cartItem.id != id)
      }
    }

    cache.writeQuery({ query: CURRENT_USER_QUERY, data: updatedUser });
  }

  render() {
    const cartItemId = this.props.id;
    return (
      <Mutation mutation={REMOVE_FROM_CART_MUTATION} variables={{id: cartItemId}} update={this.update} optimisticResponse={{
        __typename: 'Mutation',
        removeFromCart: {
          __typename: 'CartItem',
          id: this.props.id
        }
      }}>
        {
          (removeFromCart, {error, loading}) => {
            if (error) { alert(error); }
            return <BigButton title="Remove item" onClick={removeFromCart} disabled={loading}>&times;</BigButton>
          }
        }        
      </Mutation>
    );
  }
}

export default RemoveFromCart;