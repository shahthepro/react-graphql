import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import { Mutation } from 'react-apollo';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';

const Nav = () => (
  <User>
      {({ data: { me } }) => (
        <NavStyles>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/items">
            <a>Shop</a>
          </Link>
          { me && (
            <>
              <Link href="/sell">
                <a>Sell</a>
              </Link>
              <Link href="/orders">
                <a>Orders</a>
              </Link>
              <Link href="/me">
                <a>Account</a>
              </Link>
              <Signout />
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {
                  (toggleCart) => {
                    return <button onClick={toggleCart}>My Cart<CartCount count={
                      me.cart.map(item => item.quantity).reduce((x, y) => x + y, 0)
                    } /></button>
                  }
                }
              </Mutation>
            </>
          )}
          { !me && (
            <Link href="/signup">
              <a>Sign in</a>
            </Link>
          )}
        </NavStyles>
      )}
    </User>
);

export default Nav;