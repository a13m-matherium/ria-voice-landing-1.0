const express = require('express'); 
const app = express();
const database = require('./db.js');
const { parse } = require('url');
const { readFileSync, existsSync } = require('fs');
const bp = require('body-parser'); // IMPORTANT: need it for parsing req.body, need to npm i first
const path = require('path');



//TODO: change this to something else for prod
const port = 8080;

const client = path.join(__dirname, '../client')
console.log(__dirname)

app.use(express.static(client));
app.use(bp.json()); // IMPORTANT: need to do this to auto-parse req.body as json whenever needed

// Endpoints ==>

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
