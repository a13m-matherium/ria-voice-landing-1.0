const express = require("express");
const app = express();
const database = require("./db.js");
const { parse } = require("url");
const { readFileSync, existsSync } = require("fs");
const bp = require("body-parser"); // IMPORTANT: need it for parsing req.body, need to npm i first
const path = require("path");
const next = require("next");
const { ExpressPeerServer } = require("peer");
const fs = require("fs");
const cors = require('cors');

// trying PeerJS beta
const { Peer } = require("peerjs");

// ~~ trying hacky version of importing official PeerJS into node https://github.com/peers/peerjs/issues/396#issuecomment-333287381

// window = global;
// location = { protocol: "http" };
// XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// net = require("net");
// wrtc = require("wrtc");
// RTCPeerConnection = wrtc.RTCPeerConnection;
// RTCSessionDescription = wrtc.RTCSessionDescription;
// RTCIceCandidate = wrtc.RTCIceCandidate;

// WebSocket = require("ws");

// ~~ End of hacky version of importing official PeerJS

// trying official PeerJS' NodeJS support PR (https://github.com/peers/peerjs/pull/928)

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const WebSocket = require("ws");
const WebRTC = require("wrtc");
const FileReader = require("filereader");

const polyfills = { fetch, WebSocket, WebRTC, FileReader };

const hello_world = require("bindings")("mediastream_addon");

// const mediastream_addon = require("bindings")("mediastream_addon");
// const mediastream_addon = require("../mediastream_addon");

//CITATION:winton github. Winston logs errors

const winston = require("winston");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: "/var/www/matherium/server/winston_error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "/var/www/matherium/server/winston_combined.log",
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: "/var/www/matherium/server/exceptions.log",
    }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

//TODO: use something less obvious
let port = 8080;

//next js endpoint
// try {

//next js code
//Set up next js app
// next_app = next({"dev":process.env.NODE_ENV !== 'production', dir:"./next_client", quiet:false});
// const handle = next_app.getRequestHandler();
// next_app.prepare().then((err) => {
//     if (err) throw err;

// app.get('*', (err,req, res) => {
//         if (err) throw err;
//         return handle(req, res);

// });

// app.listen(port, (err) => {
//     if (err) {throw err;}
//     // console.log('> Ready on http://localhost:8080');
// })

// });
//-next code without catch
//     .catch((ex) => {
//     console.error(ex.stack);

//     //stops running the server- imp for iframe
//     process.exit(1);
// })
// }

// catch(err){
//     console.error(err);

// }

//TODO: change this to something else for prod
// app.get('*',
// 	(err,req, res) => {
//         if(err) throw err;
//         console.info("entered endpoint");
//         return handle(req,res);
//     });

//UNCOMMENT START

const client = path.join(__dirname, "../client");
// console.log(__dirname)

app.use(express.static(client));
app.use(bp.json()); // IMPORTANT: need to do this to auto-parse req.body as json whenever needed

app.use(cors());

// Endpoints ==>

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "../client") });
});

app.post("/emailupdate", async (req, res) => {
  try {
    await database.insertEmail(req.body);
  } catch (error) {
    //TODO: handle this
    // console.log("Error with calling insertEmail(): ", error);
  }
  res.end();
});

// app.get("/demo", (req, res) => {
//   res.sendFile("stream-demo.html", { root: path.join(__dirname, "../client") });
// });

app.get("/webrtc-demo", (req, res) => {
  res.sendFile("webrtc-demo-go-server.html", { root: path.join(__dirname, "../client") });
});

//Handles phone POST requests
// app.post("/voice-test", async (req, res) => {
//   //write a simple string


//   // console.log("req data",req);

//   // const test_response = {"end_user_input":"How is the climate", "curr_state":2, "client_id":0};
//   const test_response = {"end_user_input":"How is the climate", "curr_state":2, "client_id":0};
  
//   let ai_flask_response = undefined;
//   try{

    
//     //request flask for a response
//     ai_flask_response  = async function(){
//       const response = await get_ai_flask_response(test_response);
//       const data_json = await response.json();
//       console.log(JSON.parse(data_json['response']));
//       console.log(JSON.parse(data_json['response']).length);
//       return data_json;

//       const audio_blob = new Blob(JSON.parse(data_json['response']), {type: "audio/mpeg"});
//       console.log(audio_blob);

//       // data_json = await new Blob(data_json, {type: "application/json"});
//       // console.log(data_json.response.length);
//       return audio_blob;
//       // res.writeHead(200, { "Content-Type": "application/json" , "Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE","Access-Control-Allow-Headers": "X-Requested-With, Content-Type", "Access-Control-Allow-Credentials": true,"Access-Control-Allow-Headers": "Authorization"});
//       // // res.end(JSON.stringify({ message: "This is the demo text" , curr_state:0}));
//       // return res.end(JSON.stringify(data_json));


//     }();


//   }
//   catch(err){
//     console.log("an error occured when retrieving data from the flask server");
//     console.log(err);

//   }

//   ai_flask_response.then((data)=>{
//     // res.writeHead(200, { "Content-Type": "audio/mpeg" , "Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE","Access-Control-Allow-Headers": "X-Requested-With, Content-Type", "Access-Control-Allow-Credentials": true,"Access-Control-Allow-Headers": "Authorization"});
//     // return res.end(data);
    
    
//     // res.end(JSON.stringify({ message: "This is the demo text" , curr_state:0}));
    
//     res.writeHead(200, { "Content-Type": "application/json" , "Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE","Access-Control-Allow-Headers": "X-Requested-With, Content-Type", "Access-Control-Allow-Credentials": true,"Access-Control-Allow-Headers": "Authorization"});
//     return res.end(JSON.stringify(data));

// });

  
//   // res.writeHead(200, { "Content-Type": "application/json" , "Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE","Access-Control-Allow-Headers": "X-Requested-With, Content-Type", "Access-Control-Allow-Credentials": true,"Access-Control-Allow-Headers": "Authorization"});
//   // res.end(JSON.stringify({ message: "This is the demo text" , curr_state:0}));

  

// });

// async function get_ai_flask_response(post_body){
//   let flask_response = undefined;
//   //fetch data from the flask server
//   try{
//     flask_response = await fetch( 'http://localhost:5000/get_response',{method:"POST", headers:{"Content-\Type":"application/json"}, body: JSON.stringify(post_body)});
//     // flask_response = await fetch( 'http://localhost:5000/get_response',{method:"POST", headers:{"Content-Type":"application/json"}, body: '{"end_user_input":"How is the climate", "curr_state":2, "client_id":0}'});

//   }
//   catch(err){
//     console.log(err);
//   }
//   // console.log("success");//printed
//   // console.log("flask_response"); // this is a  400 error
//   // console.log(flask_response);

//   return flask_response;
// }

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
  // console.log(req.body)
  res.send(req.body);
});

// generates a Peer object (PeerJS) on the server for WebRTC streaming with clients, returns error val
app.get("/gen-peer", (req, res) => {
  let peerConfiguration = {};
  console.log("hello");
  (async () => {
    const response = await fetch(
      "https://matherium.metered.live/api/v1/turn/credentials?apiKey=138fc64d454a71ed6ba214fdca0ce0fcf5b0"
    );
    const iceServers = await response.json();
    peerConfiguration.iceServers = iceServers;
  })();
  my_peer_id = Math.floor(Math.random() * 2 ** 18)
    .toString(36)
    .padStart(4, 0);
  console.log(my_peer_id);
  const peer = new Peer(`${my_peer_id}`, {
    // host: location.hostname,
    host: "matherium.com",
    debug: 3,
    path: "/peer-server", // The path where your self-hosted PeerServer is running.
    config: peerConfiguration,
    // secure: true, //use SSL
    port: 36709,
    polyfills: polyfills,
  });

  // When a data connection between peers is open, get the connecting peer's details

  peer.on("connection", (connection) => {
    console.log("inside the connection event listener");
    conn = connection;
  });

  // Answering logic: When a call has been created, answer it and set the remote stream for the person being called

  peer.on("call", (call) => {
    console.log("inside the call event listener");
    // "call" event emitted when a remote peer attempts to call you

    // must answer() the mediaConnection object (call) to activate it and then listen for stream event
    call.answer();

    // 'stream' event emitted when a remote peer adds a stream.
    call.on("stream", (remote_stream) => {
      console.log(
        "we're in stream receiving mode! right above mediarecorder call"
      );

      try {
        // mediastream_addon.setStream(remote_stream);
        console.log("before setStream!");
        console.log("napi printing demo:", hello_world.setStream(remote_stream, "getAudioTracks"));
        console.log("setStream successful!");
      } catch (e) {
        console.log(e);
      }

      // let floatBufferArr = bufferStream(remote_stream);

      // console.log("floatBufferArr:", floatBufferArr);
    });
    // process the audio stream
    //  //TODO: STEP 1: answer with TTS output
    conn.on("close", () => {
      console.log("stag log: hanging up");
      // This is to execute code when the remote peer ends the call
      //Emitted when either you or the remote peer closes the data connection.
      peer.destroy();
    });
  });

  /**
   * Log errors to the console when they occur
   */
  peer.on("error", (err) => console.error(err));

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ peer_id: my_peer_id }));
});

// Handles MIME types of css, javascript, html and image types(.png,.jpeg,.jpg etc).
app.get("*", (req, res) => {
  const urlParsed = parse(req.url);
  const path = urlParsed.pathname.replace("/", "");
  if (existsSync(path)) {
    if (path.endsWith(".html")) {
      res.writeHead(200, { "Content-Type": "text/html" });
    } else if (path.endsWith(".css")) {
      res.writeHead(200, { "Content-Type": "text/css" });
    } else if (path.endsWith(".js")) {
      res.writeHead(200, { "Content-Type": "text/javascript" });
    }
    res.write(readFileSync(path));
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
});

// npm run on development
// if (process.env.NODE_ENV !== 'production'){
//     // logger.log("error", "in development mode")
//     //development server port
//     port = 435;
//     app.listen(port, "127.0.0.1", (err)=>{
//         if (err) {throw err;}
//         console.log("here");

//         // logger.log("error","server listening at "+port);
//     });
// }
// logger.log("error",process.env.NODE_ENV !== 'production');

server = app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  logger.info("here");
  logger.info(process.env.NODE_ENV !== "production");
});

// PeerJS Sever for WebRTC streaming
const peerServer = ExpressPeerServer(server, {
  proxied: true,
  debug: true,
  port: 36709,
  path: "/peer-server", // The path on which PEer server responds for requests. The server responds for requests to the root URL + path.
  //  sslcert: fs.readFileSync("/etc/letsencrypt/live/matherium.com/fullchain.pem"),
  //  sslkey: fs.readFileSync("/etc/letsencrypt/live/matherium.com/privkey.pem"),
  ssl: {
    key: fs.readFileSync("/etc/letsencrypt/live/matherium.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/matherium.com/fullchain.pem"),
  }, // pass in key and cert to ssl dictionary
});

app.use("/peerjs", peerServer);

function extractPCMFromMediaStream(mediaStream) {
  return new Promise((resolve, reject) => {
    const pcmChunks = [];

    // Create a Readable stream to consume the MediaStream audio data
    const audioStream = new Readable();
    audioStream._read = () => {};

    // Event handler for receiving audio data
    const onData = (event) => {
      audioStream.push(event.data);
    };

    // Create a MediaStreamTrack for the audio track of the mediaStream
    const audioTrack = mediaStream.getAudioTracks()[0];

    // Create a MediaRecorder-like object to capture the audio data
    const mediaRecorder = {
      ondataavailable: (event) => {
        onData(event);
      },
      start: () => {
        audioTrack.addEventListener(
          "dataavailable",
          mediaRecorder.ondataavailable
        );
      },
      stop: () => {
        audioTrack.removeEventListener(
          "dataavailable",
          mediaRecorder.ondataavailable
        );
        audioStream.push(null); // Signal the end of the audio data
      },
    };

    // Start recording
    mediaRecorder.start();

    // Pipe the audio stream through the pcm library for decoding
    audioStream.pipe(pcm());

    // Event handler for receiving PCM data
    pcm().on("data", (chunk) => {
      pcmChunks.push(chunk);
    });

    // Event handler for when the audio stream ends
    audioStream.on("end", () => {
      const pcmData = Buffer.concat(pcmChunks);
      resolve(pcmData);
    });

    // Stop recording after a specified duration (in milliseconds)
    const durationMs = 5000; // Example: 5 seconds
    setTimeout(() => {
      mediaRecorder.stop();
    }, durationMs);
  });
}

const bufferStream = async function (stream) {
  const SAMPLE_RATE = 16000;
  const BUFF_LENGTH = 30; // create a buffer to store 30s of aud
  console.log(stream);
  console.log("second line inside bufferstream");
  if (stream.getAudioTracks().length > 0) {
    console.log("TEST: audio tracks > 0!");
    // If voice is detected start buffering

    const audioCtx = new StreamAudioContext({ sampleRate: SAMPLE_RATE }); //Specify sample rate, otherwise "the new context's output device's preferred sample rate is used by default."
    // const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE }); //Specify sample rate, otherwise "the new context's output device's preferred sample rate is used by default."
    console.log("WAA worked");
    await audioCtx.audioWorklet.addModule("/client/recorder.worklet.js");
    const recorder = new AudioWorkletNode(context, "recorder.worklet");
    console.log("AudioWorkletNode worked");
    // const buffer1 = audioCtx.createBuffer(
    //   2,
    //   BUFF_LENGTH * SAMPLE_RATE,
    //   SAMPLE_RATE
    // ); //createBuffer(numOfChannels, length, sampleRate)

    // const buffer2 = audioCtx.createBuffer(
    //   2,
    //   BUFF_LENGTH * SAMPLE_RATE,
    //   SAMPLE_RATE
    // ); //createBuffer(numOfChannels, length, sampleRate)

    const buffer1 = new AudioBuffer({
      numberOfChannels: 2,
      length: BUFF_LENGTH * SAMPLE_RATE,
      sampleRate: SAMPLE_RATE,
    });
    console.log("buffer1 worked");

    const buffer2 = new AudioBuffer({
      numberOfChannels: 2,
      length: BUFF_LENGTH * SAMPLE_RATE,
      sampleRate: SAMPLE_RATE,
    });

    console.log("buffer1 worked");

    let curr_buffer_idx = 1;
    let curr_buffer = null;
    // typeof(mediaStreamSource) = MediaStreamAudioSourceNode (a type of AudioNode which operates as an audio source whose media is received from a MediaStream obtained using the WebRTC API)
    // not using AudioBufferSourceNode as in AudioBuffer mdn doc's example, because MediaStreamSource is for WebRTC

    // const mediaStreamSource = new MediaStreamAudioSourceNode(audioCtx, {
    //   mediaStream: stream,
    // }); // not using createMediaStreamTrackSource because it's not supported on most browsers (error said X is not a function)

    //   Use constructor instead of function to create audion node: https://developer.mozilla.org/en-US/docs/Web/API/AudioNode#creating_an_audionode
    // Use AudioBufferSourceNode if MediaStreamAudioSourceNode doesn't work
    const audioBufferSourceNode = new AudioBufferSourceNode(audioCtx, {
      mediaStream: stream,
    });

    console.log("AudoioBufferSourceNode worked");

    let floatBufferArr = [];

    //   NON-VAD CODE -- BUFFERING 15S OF AUDIO
    curr_buffer = buffer1; //
    // source.connect(audioBuffer); // connect() didin't work (overload resolution failure)
    audioBufferSourceNode.buffer = curr_buffer;
    // source.connect(audioCtx.destination); // this sends the audio to speakers (the default destination)

    // TODO: send audio stream to buffer and switch when it fills. is there an event to listen for?
    //   there's an onend event with callback. thats for when the buffer stops playing
    // when you swithc, change the global buffer index
    setTimeout(() => {
      curr_buffer_idx = curr_buffer_idx == 1 ? 2 : 1; //
      floatBufferArr = curr_buffer.getChannelData(0);
    }, 15000);
    //   END OF NON-VAD CODE

    // START OF VAD CODE
    //   const VAD = require("vad").VAD;
    //   const vad = new VAD(VAD.MODE_NORMAL);
    //   console.log("checking for voice!");
    //   // check for voice (speech) in the stream
    //   vad.on("voice", function () {
    //     console.log("Voice detected!");
    //     curr_buffer = curr_buffer_idx == 1 ? buffer1 : buffer2; // determine which buffer to use based on the index
    //     mediaStreamSource.buffer = curr_buffer;
    //   });

    //   console.log("checking for silence!");
    //   // check for a silence break in speech, if so stop buffering
    //   vad.on("silence", function () {
    //     console.log("Silence detected!");
    //     // Check if a 3s silence period is hit, if so stop buffering and pass on to processing function

    //     setTimeout(() => {
    //       console.log("Silence detected after 3s!");
    //       curr_buffer_idx = curr_buffer_idx == 1 ? 2 : 1; //
    //       floatBufferArr = curr_buffer.getChannelData(0);
    //     }, 3000);
    //   });

    // if needed, try out downloading the buffer: (in download-wav-buffer.js)
    // END OF VAD CODE
    return floatBufferArr;
  } else {
    console.log("TEST ERROR: audio tracks <= 0!");
  }
};

