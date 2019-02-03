

const express = require('express');
const  http = require('http');
const WebSocket = require('ws');



const app = express();


//initialize a simple http server
const server = http.createServer(app);



//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let UsersArr = [];

//bordcast message from user to all printer
function brodcastAllprinters(ws,message) {

    let test = UsersArr[ws.IDOB].printerArr;
    for(let i = 0 ; i < test.length; i++){
        console.log(test.length);
        if(test[i] != null){
            test[i].send(message);
        }
    }
    console.log(test.length);
}

//spilt the protocol to array to be easy to use
function spilt(ws){

    //the info. from the coming connection
    let protocol = ws.upgradeReq.headers['sec-websocket-protocol'];
    //spilt the info
    let a = protocol.split(",");
    //change the info from String to Integer
    for(let i = 1 ; i < a.length; i++){
        a[i] = parseInt(a[i]);
    }

    //defind the connection is't from user or printer
    ws.ConType = a[0];
    //defind the ID
    ws.IDOB = a[1];

    if(ws.ConType === "printer"){
        ws.PID = a[2];
    }

}

function addConnectionToArray(ws){
    spilt(ws);
    if (UsersArr[ws.IDOB] == null) {
        console.log('null');
        UsersArr[ws.IDOB] = {printerArr: []};
        if (ws.ConType === "user") {
            UsersArr[ws.IDOB].ws = ws;
            UsersArr[ws.IDOB].ID = ws.IDOB;
        } else if (ws.ConType === "printer") {
            console.log('p');
            console.log(ws.PID);
            UsersArr[ws.IDOB].ws = ws.IDOB;
            UsersArr[ws.IDOB].printerArr[ws.PID] = ws;
        }
    } else {
        if (ws.ConType === "user") {
            UsersArr[ws.IDOB].ws = ws;
            UsersArr[ws.IDOB].ID = ws.IDOB;
        } else if (ws.ConType === "printer") {
            console.log('p');
            UsersArr[ws.IDOB].ws = ws.IDOB;
            UsersArr[ws.IDOB].printerArr[ws.PID] = ws;
            //console.log(UsersArr[ws.IDOB].printerArr[as[2]]);
        }
    }
}

wss.on('connection', (ws,rq) => {
    // upgrade the connection with the request
    ws.upgradeReq = rq;

    // add the coming connection to the arr
    addConnectionToArray(ws);




    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        brodcastAllprinters(ws,message);


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