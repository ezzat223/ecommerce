// imports
const mongoose = require('mongoose');

// db connect
const dbConnection = () => {
    // connect with db => returns a promise
    mongoose.connect(process.env.URI)
    .then(
        (conn) => {
            console.log(`Database connected, HOST: ${conn.connection.host}`);
            // console.log(`Database connected, PORT: ${conn.connection.port}`);
            // console.log(`Database connected, NAME: ${conn.connection.name}`);
        }
    )
    
};

module.exports = dbConnection;