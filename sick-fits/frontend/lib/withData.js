import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            const { cartOpen } = cache.readQuery({ query: LOCAL_STATE_QUERY });

            const payload = {
              data: {
                cartOpen: !cartOpen
              }
            };

            cache.writeData(payload);

            return payload;
          }
        }
      },
      defaults: {
        cartOpen: false,
      },
    }
  });
}

export default withApollo(createClient);
