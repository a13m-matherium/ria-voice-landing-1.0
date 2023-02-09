const { queryResult } = require('pg-promise');
// const process = require('process');
const pgp = require('pg-promise')();

let secrets;
let connection;

connection =   {
    host: 'localhost',
    port: 5432,
    database: 'matheriumdb',
    user: 'a13m',
    password: '7PBXJ_/cfaCG:',
    max: 30 // use up to 30 connections
};

//TODO: comment the code below and uncomment the if block and process import when going to prod
// secrets = require('../secrets.json');
// connection = secrets.localDatabaseURL;

// if (!process.env.DATABASE_URL) {
//     secrets = require('../secrets.json');
//     connection = secrets.localDatabaseURL;
// } else {
// 	connection = process.env.DATABASE_URL;
// }


const db = pgp(connection);

async function connectAndRun(task) {
    let connection = null;

    try {
        connection = await db.connect();
        return await task(connection);
    } catch (e) {
        console.log('Error with connectAndRun:',e);
    } finally {
        try {
            connection.done();
        } catch(ignored) {
            console.log(ignored);
        }
    }
    return -1;
}

async function insertEmail(email_json){
    const email = email_json.email;
    try{
        await connectAndRun(db => db.none("INSERT INTO email_list(email) VALUES($1)", [email]));
    }
    catch(error){
        console.log('Error with insertEmail:',error);
    }
}

exports.insertEmail = insertEmail;