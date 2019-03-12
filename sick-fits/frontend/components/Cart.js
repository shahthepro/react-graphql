import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart = props => {
  return (
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {
        (toggleCart) => {
          return <Query query={LOCAL_STATE_QUERY}>
            {
              ({data}) => {
                return <CartStyles open={data.cartOpen} onClick={toggleCart}>
                  <header>
                    <CloseButton title="Close">&times;</CloseButton>
                    <Supreme>Cart</Supreme>
                    <p>You have items in your cart</p>
                  </header>
                  <footer>
                    <p>Total</p>
                    <SickButton>Checkout</SickButton>
                  </footer>
                </CartStyles>
              }
            }
          </Query>
        }
      }
    </Mutation>
  )
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };