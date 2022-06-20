const exp = require('express')
const server = exp()
const mclient = require("mongodb").MongoClient

const DBurl = "mongodb+srv://randomQuotes:randomquotes@cluster0.g9i68op.mongodb.net/?retryWrites=true&w=majority";

mclient.connect(DBurl)
    .then((client) => {
        let dbObj = client.db("quotes");
        let quoteCollectionObj = dbObj.collection("quotescollection");
        server.set("quoteCollectionObj", quoteCollectionObj);
    })
    .catch(err => console.log("Error in db connection is ", err));

const quote = require('./APIS/quote')

server.use('/quote-api', quote)

server.use((request, response, next) => {
    response.send(
        { message: `path ${request.url} is invalid` }
    )
})

server.use((error, request, response, next) => {
    response.send(
        {
            message: "Error occured",
            reason: `${error.message}`
        }
    )
})

server.listen(4000, () => console.log('Server listening to port number 4000'))
