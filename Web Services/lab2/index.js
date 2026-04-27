const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require('@as-integrations/express4'); 
const cors = require('cors'); 
const resolvers = require("./resolver");
const fs = require("fs");
const path = require("path");

async function startServer() {
  const app = express();

  const typeDefs = fs.readFileSync(
    path.join(__dirname, 'schema.graphql'), 
    'utf-8'
  );

  const server = new ApolloServer({ 
    typeDefs, 
    resolvers 
  });

  await server.start();
app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
  req.body = req.body || {};
  next();
});

  app.use('/graphql' ,expressMiddleware(server));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  app.listen(3000, () => {
    console.log("🚀 Server is running at http://localhost:3000/graphql");
  });
}

startServer().catch(err => console.error("Failed to start server:", err));
