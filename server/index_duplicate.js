const express = require('express'); 
const app = express();
const database = require('./db.js');
const { parse } = require('url');
const { readFileSync, existsSync } = require('fs');
const bp = require('body-parser'); // IMPORTANT: need it for parsing req.body, need to npm i first
const path = require('path');
const next = require('next');

//CITATION:winton github. Winston logs errors
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: '/var/www/matherium/server/winston_error.log', level: 'error' }),
    new winston.transports.File({ filename: '/var/www/matherium/server/winston_combined.log' }),
    
  ],

//   exceptionHandlers: [
//     new transports.File({ filename: '/var/www/matherium/server/exceptions.log' })
//   ]
});

// //test the logger
logger.info("This is a test log to test winston's logging");

winston.add(new winston.transports.File({
    filename: '/var/www/matherium/server/exceptions.log',
    handleExceptions: true
  }));
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }


//Set up next js app
next_app = next({"dev":process.env.NODE_ENV !== 'production'});
const handle = next_app.getRequestHandler()

//next js endpoint

// next_app.prepare()
// .then(() => {

//   app.get('/', (req, res) => {
//     return handle(req, res)
//   })

//   app.listen(3000, (err) => {
//     if (err) throw err
//     console.log('> Ready on http://localhost:3000')
//   })
// })
// .catch((ex) => {
//   console.error(ex.stack)
//   process.exit(1)
// })

//TODO: change this to something else for prod
const port = 8080;

const client = path.join(__dirname, '../client')
console.log(__dirname)

app.use(express.static(client));
app.use(bp.json()); // IMPORTANT: need to do this to auto-parse req.body as json whenever needed

// Endpoints ==>



// app.get('/next',
// 	(req, res) => {
//         logger.info("entered endpoint");
//         return handle(req,res);
//     });



app.get('/',
	(req, res) => {
        res.sendFile('index.html', {root: path.join(__dirname, "../client")});
    });

app.post("/emailupdate", async (req, res) => {
    try{
        await database.insertEmail(req.body);
    }
    catch(error){
        console.log("Error with calling insertEmail(): ", error);
    }
    res.end();
});

app.get('/demo',
	(req, res) => {
        res.sendFile('stream-demo.html', {root: path.join(__dirname, "../client")});
    });

//Handles phone POST requests
app.post("/voice", async (req, res) => {
    //write a simple string
    res.writeHead(200, {"Content-Type" : "application/json"});
    res.end(JSON.stringify({message:'This is the demo text'}));
});

//Handles phone POST requests
app.post("/convert-text", async (req, res) => {

    //variable for the received message
    // let received_message = 'new'
    // //write a simple string
    // req.json().then((data)=>{
    //     res.json(data);
    // })

    // if (req.ok){
    //     received_message = req.json()
    // }
    // else{
    //     received_message = 'not ok'
    // }

    // res.writeHead(200, {"Content-Type" : "application/json"});
    // res.end(JSON.stringify({message:'This is the audii'}));
    // res.json(req.json())
    // res.end(JSON.stringify(req.json()));
    console.log(req.body)
    res.send(req.body)
    

});

// Handles MIME types of css, javascript, html and image types(.png,.jpeg,.jpg etc).
app.get('*',(req,res) =>{
    const urlParsed = parse(req.url);
    const path = urlParsed.pathname.replace('/', '');
    if(existsSync(path)){ 
        if (path.endsWith(".html")){
            res.writeHead(200, {"Content-Type" : "text/html"});
        } else if(path.endsWith('.css')){
            res.writeHead(200, {"Content-Type" : "text/css"});
        }else if(path.endsWith('.js')){
            res.writeHead(200, {"Content-Type" : "text/javascript"});
        }
        res.write(readFileSync(path));
        res.end();
    }else{
        res.writeHead(404);
        res.end();
    }
});

app.listen(port, ()=>{
    console.log("server listening at "+port);
});
