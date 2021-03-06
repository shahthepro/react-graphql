import React from 'react';
import { adopt } from 'react-adopt';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';

import User from './User';
import CartItem from './CartItem';
import formatMoney from '../lib/formatMoney';

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

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = props => {
  return (
    <Composed>
      {
        ({ user, toggleCart, localState}) => {
          const me = user.data.me;

          if (!me) return null;

          const data = localState.data;
          
          return <CartStyles open={data.cartOpen}>
            <header>
              <CloseButton title="Close" onClick={toggleCart}>&times;</CloseButton>
              <Supreme>{me.name}'s Cart</Supreme>
              <p>You have {me.cart.length} items in your cart</p>
            </header>
            <ul>
              {me.cart.map(cartItem => (
                <CartItem key={cartItem.id} cartItem={cartItem} />
              ))}
            </ul>
            <footer>
              <p>{formatMoney(calcTotalPrice(me.cart))}</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
        }
      }
    </Composed>
  )
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };