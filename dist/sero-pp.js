require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function SEROPP() {
    window.addEventListener("message", function (event) {
        var msg = event.data;
        if(msg.method === method.setProfile){
            SEROPP.Rpc = msg.data.rpc;
            SEROPP.walletType = msg.data.walletType;
        }
        // else if(msg.method === method.init){
        //     SEROPP.inited = true;
        // }
        var cb = SEROPP.callbackHandler.get(msg.messageId);
        if (cb && typeof cb === "function") {
            cb(msg.data,msg.error);
        }
        SEROPP.callbackHandler.delete(msg.messageId);
    }, false);
}

var method = {
    init: "init",
    accountDetail: "accountDetail",
    accountList: "accountList",
    executeContract: "executeContract",
    call: "call",
    estimateGas: "estimateGas",
    setProfile:"setProfile",
    getInfo:"getInfo",
    pkrCrypto:"pkrCrypto",
    pkrEncrypt:"pkrEncrypt",
    pkrDecrypt:"pkrDecrypt",
    goPage:"goPage"
};

SEROPP.Rpc = "";

SEROPP.callbackHandler = new Map();

SEROPP.messageId = 0;

SEROPP.inited = false;

SEROPP.walletType = "";

SEROPP.embedType = 1; // wallet embed dapp , 2 dapp embed walelt

SEROPP.prototype.init = function (dapp, cb) {
    if (dapp && dapp.name && dapp.contractAddress && dapp.github && dapp.author && dapp.url && dapp.logo) {
        if(dapp.embedType){
            SEROPP.embedType = dapp.embedType
        }
        if (cb) {
            handlerMsg(method.init, dapp, cb);
        } else {
            handlerMsg(method.init, dapp);
        }

    } else {
        throw new Error("DApp format error. ");
    }
};

function checkState() {
    if (SEROPP.inited === false) {
        throw new Error("sdk not init.");
    }
}

SEROPP.prototype.getAccountList = function (cb) {
    // checkState();
    handlerMsg(method.accountList, null,cb);
};

SEROPP.prototype.getAccountDetail = function (pk, cb) {
    // checkState();
    handlerMsg(method.accountDetail, pk,cb);
};

SEROPP.prototype.call = function (data, cb) {
    // checkState();
    handlerMsg(method.call, data,cb);
};

SEROPP.prototype.estimateGas = function (data, cb) {
    // checkState();
    handlerMsg(method.estimateGas, data,cb);
};

SEROPP.prototype.executeContract = function (data, cb) {
    // checkState();
    handlerMsg(method.executeContract, {tx:data},cb);
};

SEROPP.prototype.getInfo = function (cb) {
    // checkState();
    handlerMsg(method.getInfo,null,cb);
};

SEROPP.prototype.pkrCrypto = function (data,cb) {
    // checkState();
    handlerMsg(method.pkrCrypto,data,cb);
};

SEROPP.prototype.pkrEncrypt = function (data,cb) {
    // checkState();
    handlerMsg(method.pkrEncrypt,data,cb);
};

SEROPP.prototype.pkrDecrypt = function (data,cb) {
    // checkState();
    handlerMsg(method.pkrDecrypt,data,cb);
};


SEROPP.prototype.goPage = function (data) {
    handlerMsg(method.goPage,data);
};

function handlerMsg(_method, _data, cb) {
    // if (SEROPP.inited === false && _method !== method.init) {
    //     throw new Error("seropp not init !");
    // }

    var messageId = SEROPP.messageId++;
    var msg = {
        messageId: messageId,
        method: _method,
        data: _data
    };
    if( SEROPP.embedType === 2){
        var childFrameObj = document.getElementById('popupModel');
        if (childFrameObj) {
            childFrameObj.contentWindow.postMessage(msg, '*');
        }
    }else{
        parent.postMessage(msg, '*');
    }

    if(cb){
        SEROPP.callbackHandler.set(messageId, cb);
    }
}

module.exports = SEROPP;
},{}],"sero-pp":[function(require,module,exports){
var SEROPP = require("./lib/sero-pp");
var seropp = new SEROPP();

if (typeof window !== 'undefined' && typeof window.seropp === 'undefined') {
    window.seropp = seropp;
}

module.exports = seropp;
},{"./lib/sero-pp":1}]},{},["sero-pp"])
//# sourceMappingURL=sero-pp.js.map
