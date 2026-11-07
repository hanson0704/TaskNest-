const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tasknest_db';

async function startServer() {
  const app = express();

  // Create Apollo GraphQL Server instance
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  // Standard Express Middleware
  app.use(cors());
  app.use(express.json());

  // Attach Apollo GraphQL endpoint
  app.use('/graphql', expressMiddleware(apolloServer));

  // Health check route
  app.get('/', (req, res) => {
    res.json({
      message: 'TaskNest GraphQL API Server is operational',
      graphqlEndpoint: '/graphql'
    });
  });

  // Connect to MongoDB
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB database at:', MONGODB_URI);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  // Start listening
  app.listen(PORT, () => {
    console.log(`TaskNest Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  });
}

startServer();

