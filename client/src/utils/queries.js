import { gql } from '@apollo/client';

export const GET_ME = gql`
  {
    me {
      _id
      username
      email 
      bookCount
      savingBooks{
          bookId
          authors
          title
          description 
          image
          link
      }
    }
  }
`;