import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(where: {
      OR: [
        { title_contains: $searchTerm },
        { description_contains: $searchTerm },
      ],
    }) {
      id
      title
      image
    }
  }
`;

function routeToItem(item) {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
}

class AutoComplete extends React.Component {
  state = {
    items: [],
    loading: false,
  };

  onChange = debounce(async (searchTerm, client) => {
    this.setState({
      loading: true
    });

    const response = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: {
        searchTerm: searchTerm
      }
    });
    
    this.setState({
      loading: false,
      items: response.data.items,
    });
  }, 300);

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift onChange={routeToItem} itemToString={item => item ? item.title : ''}>
          {
            ({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
              <div>
                <ApolloConsumer>
                  {(client) => {
                    return <input {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for items',
                      id: 'search',
                      className: this.state.laoding ? 'loading' : '',
                      onChange: (e) => {
                        // e.persist();
                        this.onChange(e.target.value, client);
                      } 
                    })} />
                  }}
                </ApolloConsumer>
                {
                  isOpen && <DropDown>
                    { this.state.loading && <DropDownItem>Loading...</DropDownItem>}
                    {
                      !this.state.loading && !this.state.items.length &&
                        <DropDownItem>No search results</DropDownItem>
                    }
                    { !this.state.loading &&
                      this.state.items.map((item, index) => (
                        <DropDownItem key={item.id} highlighted={index == highlightedIndex}
                          { ...getItemProps({
                            item: item
                          })}>
                          <img width="50" src={item.image} alt={item.title} />
                          {item.title}
                        </DropDownItem>
                      )
                    )
                    }
                  </DropDown>
                }
              </div>
            )
          }
        </Downshift>
      </SearchStyles>
    )
  }
}

export default AutoComplete;