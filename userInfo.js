

let printersArr = [];

let userID;
let userWS;

let userAgsest = false;


function userInfo(id , ws){
    userID = id ;
    userWS = ws;
    if (ws != null){
        userAgsest = true;
    }
}

userInfo.prototype.userinfo = {

    addPrinter:function (id,ws) {
        //console.log(ws.upgradeReq.headers);
        printersArr[id] = ws;
},
    updatePrinter:function (id,ws) {
        printersArr[id] = ws;
    },
    getPrinters:function () {
        return printersArr;
    },
    getUserAgsest:function () {
        return userAgsest;
    },
    addID:function (id) {
        userID = id;
    },
    addWs:function (ws) {
        userWS = ws;
    }
};


module.exports = userInfo;

