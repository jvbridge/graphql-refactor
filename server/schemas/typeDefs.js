const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    users: [User]
    user(username: String!): User
    me: User
  }
  type Book {
    authors: [String]
    description: String
    image: String
    link: String
    title: String
  }
`;

module.exports = typeDefs;