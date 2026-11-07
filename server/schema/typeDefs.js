// GraphQL Type Definitions for TaskNest
const typeDefs = `#graphql
  type Task {
    id: Int!
    title: String!
    status: String!
  }

  type Query {
    taskList: [Task!]!
  }

  type Mutation {
    addTask(title: String!): Task!
    updateTask(id: Int!, title: String!): Task!
    updateTaskStatus(id: Int!, status: String!): Task!
    deleteTask(id: Int!): Boolean!
  }
`;

module.exports = typeDefs;

