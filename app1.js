const userInfo = require('./userInfo');

const express = require('express');
const  http = require('http');
const WebSocket = require('ws');



const app = express();

//userInfo.prototype.userinfo.addPrintrt();

//initialize a simple http server
const server = http.createServer(app);



//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let UsersArr = [];

function spilt(ws){

  let protocol = ws.upgradeReq.headers['sec-websocket-protocol'];

  //console.log(protocol);

  let a = protocol.split(",");
  //console.log(a.length);

   return a;

}
wss.on('connection', (ws,rq) => {

  ws.upgradeReq = rq;
  //let protocol = rq.headers['sec-websocket-protocol'];

  //console.log(protocol);

  //let a = protocol.split(",");
  //console.log(a.length);
  let con = ws;
  //console.log(userInfo.prototype.userinfo.getUserAgsest());
  let a = spilt(ws);

  if (UsersArr[parseInt(a[1])] == null){
    UsersArr[parseInt(a[1])] = new userInfo(null,null);
    //console.log(UsersArr[parseInt(a[1])].userinfo.getUserAgsest());

    if(a[0] === "user"){
      UsersArr[parseInt(a[1])] = new userInfo(parseInt(a[1]),con);
    } else if(a[0] === "printer"){
      UsersArr[parseInt(a[1])].userinfo.addPrinter(parseInt(a[2]),con);
    }

  } else {

    if(a[0] === "user"){
      UsersArr[parseInt(a[1])] = new userInfo(parseInt(a[1]),con);
    } else if(a[0] === "printer"){
      UsersArr[parseInt(a[1])].userinfo.addPrinter(parseInt(a[2]),con);
    }

  }




  //connection is up, let's add a simple simple event
  ws.on('message', (message) => {

    let b = spilt(ws);
    //console.log(UsersArr[parseInt(b[1])].userinfo.getUserAgsest());
    let test = UsersArr[parseInt(b[1])].userinfo.getPrinters();
    console.log(test.length);
    for (let i =0; i < test.length; i++){
      if (test[i] != null){
        //console.log(test[i].upgradeReq.headers)
        console.log(message);
        test[i].send("home");
      }

    }
    //log the received message and send it back to the client
    console.log('received: %s', message);
    //ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  //ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 8181, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});