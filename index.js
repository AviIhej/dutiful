const { ApolloServer, gql } = require('apollo-server')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')
dotenv.config()

const { DB_URI, DB_NAME }  = process.env;

const books = [
    {
        title: "William Adventure",
        author: "William Henry"
    },
    {
        title: "Sharespeare's Adventure",
        author: "William Shakespeare"
    }
]

const typeDefs = gql`
    type Book {
        title: String,
        author: String
    }

    type Query {
        books: [Book]
    }
`

const resolvers = {
    Query: {
        books: (root, data, context) => {
            console.log(context.db)
            return books
        }
    }
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