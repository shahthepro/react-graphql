import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = (props) => {
  return (
    <Query query={PAGINATION_QUERY}>
    {
      ({ data, error, loading }) => {
        if (loading) return <p>Loading...</p>
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        const page = props.page;
        return <PaginationStyles>
          <Head>
            <title>Items - Page {page}</title>
          </Head>
          <Link prefetch href={{
            pathname: 'items',
            query: {page: page - 1}
          }}><a className="prev" aria-disabled={page <= 1}>Previous Page</a></Link>
          <p>Page {page} of {pages}</p>
          <p>Total Items {count}</p>
          <Link prefetch href={{
            pathname: 'items',
            query: {page: page + 1}
          }}><a aria-disabled={page >= pages}>Next Page</a></Link>
        </PaginationStyles>
      }
    }
    </Query>
  )
}

export default Pagination;