const { ApolloServer, gql } = require('apollo-server')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')
dotenv.config()

const { DB_URI, DB_NAME }  = process.env;
 
const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        avater: String
    }

    type TaskList {
        id: ID!
        createdAt: String!
        title: String!
        progress: Float!

        users: [User!]!
        # todos: [Todo!]!

    }

    type ToDo{
        id: ID!
        content: String!
        isCompleted: Boolean!

        taskList: TaskList!
    }

    type Query {
        user: [User]
    }
`

const resolvers = {
  
}

async function start() {
    try {
        const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        
        await client.connect()

        const db = client.db(DB_NAME)

        const context = {
            db,
        }

        const server = new ApolloServer({ typeDefs, resolvers, context }) //ApolloServer will include this context variable in every Query and mutation

        server.listen().then(({ url }) => {
            console.log(`Listening on ${url}`)
        })
    
    } catch(err){
        console.log("THE ERROR IS "  + err)
    }
}

start() 