// ==UserScript==
// @name         Town mode
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Automated version of Town mode
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==

let roles = [];
roles.push("Mafia");
roles.push("Mafia");
roles.push("Sheriff");
roles.push("Investigator");
roles.push("Jailor");
roles.push("Jailor");
roles.push("Coven Leader");
roles.push("Coven Investigator");

let specialRoles = [];
specialRoles.push("Serial Killer");
specialRoles.push("Werewolf");

let players = [];
let information = [];
let positionOfJailors = [];
let positionOfInvestigator = [];
let positionOfCovenInvestigator = [];
let positionOfCovenLeader = [];
let positionOfMafias = [];
let positionOfSheriff = [];



let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.sender === selfName && payload.message.startsWith("/roles")) {
        players = [];
        for (let playerId in lobby.players) {
            players.push(lobby.players[playerId]._name);
        }
        shuffle(roles);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[0], players[0]); }, 0);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[1], players[1]); }, 100);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[2], players[2]); }, 200);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[3], players[3]); }, 300);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[4], players[4]); }, 400);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[5], players[5]); }, 500);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[6], players[6]); }, 600);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[7], players[7]); }, 700);
        information = new Array(players.length);
        for (let i = 0; i < players.length; i++){
            information[i]=new Array(2);
        };
        for (let j = 0; j < players.length; j++){
            information[j][0] = players[j];
            information[j][1] = roles[j];
        };
        //Finding the indexes of Jailors
        for (let i = 0; i < information.length; i++) {
            var indexOfJailors = information[i].indexOf("Jailor");
            if (index > -1) {
                positionOfJailors.push([i, index]);
            }
        }
        //Finding the indexes of Mafias
        for (let i = 0; i < information.length; i++) {
            var indexOfMafias = information[i].indexOf("Mafia");
            if (index > -1) {
                positionOfMafias.push([i, index]);
            }
        }
        //Finding the index of Investigator
        for (let i = 0; i < information.length; i++) {
            var indexOfInvestigator = information[i].indexOf("Investigator");
            if (index > -1) {
                positionOfInvestigator.push([i, index]);
            }
        }
        //Finding the index of Sheriff
        for (let i = 0; i < information.length; i++) {
            var indexOfSheriff = information[i].indexOf("Sheriff");
            if (index > -1) {
                positionOfSheriff.push([i, index]);
            }
        }
        //Finding the index of Coven Investigator
        for (let i = 0; i < information.length; i++) {
            var indexOfCovenInvestigator = information[i].indexOf("Coven Investigator");
            if (index > -1) {
                positionOfCovenInvestigator.push([i, index]);
            }
        }
        //Finding the index of Coven Leader
        for (let i = 0; i < information.length; i++) {
            var indexOfCovenLeader = information[i].indexOf("Coven Leader");
            if (index > -1) {
                positionOfCovenLeader.push([i, index]);
            }
        }

    }
});
commandListener.bindListener();

let dmListener = new Listener("chat message", function (payload) {
    if (payload.message.startsWith("/stun")) {
        if ((payload.sender === information[positionOfJailors[0][0]][0]) || (payload.sender === information[positionOfJailors[1][0]][0]) || (payload.sender === information[positionOfCovenLeader[0][0]][0]) ) {
            let message = payload.message.split(" ");
            let target = message[1];
            sendDMMessage("You are stunned.", target);
        }
        else {
            sendDMMessage("You aren't Jailor nor Coven Leader dumbass", payload.sender);
        }
    }
    if (payload.message.startsWith("/inv")) {
        if (payload.sender === information[positionOfInvestigator[0][0]][0]) {
            let message = payloard.message.split(" ");
            let target = message[1];
            //Finding the index of the target
            for (let i = 0; i < information.length; i++) {
                let indexOfTarget = information[i].indexOf(target);
                if (index > -1) {
                    positionOfTarget.push([i, index]);
                }
            }
            if ((information[positionOfTarget[0][0]][1] === "Sheriff") || (information[positionOfTarget[0][0]][1] === "Investigator") || (information[positionOfTarget[0][0]][1] === "Jailor")) {
                sendDMMessage("Target is a Town member.", payload.sender);
            }
            else {
                sendDMMessage("Target is not a Town member.", payload.sender);
            }
        }
        else {
            sendDMMessage("You aren't Investigator dumbass", payload.sender);
        }
    }
    if (payload.message.startsWith("/sinv")) {
        if (payload.sender === information[positionOfInvestigator[0][0]][0]) {
            let message = payloard.message.split(" ");
            let target = message[1];
            //Finding the index of the target
            for (let i = 0; i < information.length; i++) {
                let indexOfTarget = information[i].indexOf(target);
                if (index > -1) {
                    positionOfTarget.push([i, index]);
                }
            }
            if (information[positionOfTarget[0][0]][1] === "Mafia") {
                sendDMMessage("Target is a Mafia member.", payload.sender);
            }
            else {
                sendDMMessage("Target is not a Mafia member.", payload.sender);
            }
        }
        else {
            sendDMMessage("You aren't Sheriff dumbass", payload.sender);
        }
    }
    if (payload.message.startsWith("/cinv")) {
        if (payload.sender === information[positionOfCovenInvestigator[0][0]][0]) {
            let message = payloard.message.split(" ");
            let target = message[1];
            //Finding the index of the target
            for (let i = 0; i < information.length; i++) {
                let indexOfTarget = information[i].indexOf(target);
                if (index > -1) {
                    positionOfTarget.push([i, index]);
                }
            }
            sendDMMessage("Target's role is "+information[positionOfTarget[0][0]][1], payload.sender)
        }
        else {
            sendDMMessage("You aren't Coven Investigator dumbass", payload.sender);
        }
    }
});
dmListener.bindListener();







//Randomizer function
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Array shuffling
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}


function sendDMMessage(msg, username) {
    //chatBox.$CHAT_INPUT_TEXTAREA.val(message);
    //chatBox.name=target;
    socket.sendCommand({
        type: "social",
        command: "chat message",
        data: {
            target: username,
            message: msg
        }
    });
}