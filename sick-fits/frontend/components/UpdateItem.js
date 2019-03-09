import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Form from './styles/Form';
import gql from 'graphql-tag';
import ErrorMessage from './ErrorMessage';
import Router from 'next/router';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type == 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: val
    })
  };
  
  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log({id: this.props.id, ...this.state})
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    console.log(res)
  }

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{id: this.props.id}}>
        {
          ({data, loading}) => {
            if (loading) return <p>loading...</p>;
            if (!data.item) return <p>Item not found</p>;

            return (
              <Mutation mutation={UPDATE_ITEM_MUTATION}>
              {(updateItem, { loading, error}) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input type="text" id="title" name="title" placeholder="Title" defaultValue={data.item.title} onChange={this.handleChange} required />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input type="number" id="price" name="price" placeholder="Price" defaultValue={data.item.price} onChange={this.handleChange} required />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea type="text" id="description" name="description" placeholder="Enter a description" defaultValue={data.item.description} onChange={this.handleChange} required></textarea>
                    </label>
                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
              </Mutation>
            )
          }
        }
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };