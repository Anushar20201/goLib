import { gql } from '@apollo/client'

//LOGIN_USER query
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

//ADD_USER mustation

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

//SAVE_BOOK mutation
export const SAVE_BOOK = gql`
  mutation saveBook($input: BookInformation!) {
    saveBook(input: $input) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
            title 
        image
        link
      }
    }
  }
`;

//REMOVE_BOOK  mutation
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
        savedBooks{
        bookId
        authors
        description
            title 
        image
        link
      }
    }
  }
`;