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

let inGame = false;

let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.message.startsWith("/help")) {
        sendChatMessage("Pastebin for Town Mode: https://pastebin.com/gzmXD5s9");
        sendChatMessage("Commands:");
        sendChatMessage("Jailors and Coven Leader: /stun [player]");
        sendChatMessage("Investigator: /inv [player]");
        sendChatMessage("Sheriff: /sinv [player]");
        sendChatMessage("Coven Investigator: /cinv [player]")
        sendChatMessage("Be sure to type the player name correctly (I recommand to copy/paste it).");
    }
    if (payload.sender === selfName && payload.message.startsWith("/roles")) {
        players = [];
        for (let playerId in lobby.players) {
            players.push(lobby.players[playerId]._name);
        }
        shuffle(roles);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[0], players[0]); }, 0);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[1], players[1]); }, 200);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[2], players[2]); }, 400);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[3], players[3]); }, 600);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[4], players[4]); }, 800);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[5], players[5]); }, 1000);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[6], players[6]); }, 1200);
        setTimeout(function(){ sendDMMessage("Your role is: "+roles[7], players[7]); }, 1400);
        information = new Array(players.length);
        for (let i = 0; i < players.length; i++){
            information[i]=new Array(3);
        };
        for (let j = 0; j < players.length; j++){
            information[j][0] = players[j];
            information[j][1] = roles[j];
            information[j][2] = scores[j];
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
            sendDMMessage("You aren't Jailor nor Coven Leader.", payload.sender);
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
            sendDMMessage("You aren't Investigator.", payload.sender);
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
            sendDMMessage("You aren't Sheriff.", payload.sender);
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
            sendDMMessage("You aren't Coven Investigator.", payload.sender);
        }
    }
});
dmListener.bindListener();

let scores = [];
let _endResultListener = new Listener("quiz end result", function (payload) {
    inGame = true;
    for (let i = 0; i < players.length; i++){
        scores.push(quiz.scoreboard.playerEntries[i].$score[0].innerText);
    }
    for (let j = 0; j < players.length; j++){
        information[j][0] = players[j];
        information[j][1] = roles[j];
        information[j][2] = scores[j];
    };
    let deathTownCounter = false;
    //If both Jailors are dead and it's the first time they die, swap the roles of Inv and Sheriff to Jailors
    if ((information[positionOfJailors[0][0]][2]) === 0 && (information[positionOfJailors[1][0]][2]) && (deathTownCounter = false)) {
        swap(roles, information[positionOfJailors[0][0]][1], information[positionOfInvestigator[0][0]][1]);
        swap(roles, information[positionOfJailors[1][0]][1], information[positionOfSheriff[0][0]][1]);
        sendDMMessage("You are now Jailor.",information[positionOfJailors[0][0]][0]);
        sendDMMessage("You are now Jailor.",information[positionOfJailors[1][0]][0]);
        deathTownCounter = true;
    }
    //Same for Coven Leader / Coven Investigator
    let deathCovenCounter = false;
    if ((information[positionOfCovenLeader[0][0]][2] === 0) && (deathCovenCounter = false)) {
        swap(roles, information[positionOfCovenLeader[0][0]][1], information[positionOfCovenInvestigator[0][0]][1]);
        sendDMMessage("You are now Coven Leader.", information[positionOfCovenLeader[0][0]][0]);
        deathCovenCounter = true;
    }
    //Send Death Messages
    let deathSheriffCounter = false;
    if ((information[positionOfSheriff[0][0]][2] === 0 && (deathSheriffCounter = false))) {
        sendChatMessage("Player "+information[positionOfSheriff[0][0]][0]+" has died. They were the Sheriff.");
        deathSheriffCounter = true;
    }
    let deathInvestigatorCounter = false;
    if ((information[positionOfInvestigator[0][0]][2] === 0 && (deathInvestigatorCounter = false))) {
        sendChatMessage("Player "+information[positionOfInvestigator[0][0]][0]+" has died. They were the Investigator.");
        deathInvestigatorCounter = true;
    }
    let deathCovenInvestigatorCounter = false;
    if ((information[positionOfCovenInvestigator[0][0]][2] === 0 && (deathCovenInvestigatorCounter = false))) {
        sendChatMessage("Player "+information[positionOfCovenInvestigator[0][0]][0]+" has died. They were the Coven Investigator.");
        deathCovenInvestigatorCounter = true;
    }
    let deathMafia1Counter = false;
    if ((information[positionOfMafias[0][0]][2] === 0 && (deathMafia1Counter = false))) {
        sendChatMessage("Player "+information[positionOfMafias[0][0]][0]+" has died. They were a Mafia member.");
        deathMafia1Counter = true;
    }
    let deathMafia2Counter = false;
    if ((information[positionOfMafias[1][0]][2] === 0 && (deathMafia2Counter = false))) {
        sendChatMessage("Player "+information[positionOfMafias[1][0]][0]+" has died. They were a Mafia member.");
        deathMafia2Counter = true;
    }
    //Since Jailor role gets swapped
    let deathJailor1Counter = 0;
    if ((information[positionOfJailors[0][0]][2] === 0 && ((deathJailor1Counter = 0) || (deathJailor1Counter = 1)))) {
        sendChatMessage("Player "+information[positionOfJailors[0][0]][0]+" has died. They were a Jailor.");
        deathJailor1Counter++;
    }
    let deathJailor2Counter = 0;
    if ((information[positionOfJailors[1][0]][2] === 0 && ((deathJailor2Counter = 0) || (deathJailor2Counter = 1)))) {
        sendChatMessage("Player "+information[positionOfJailors[1][0]][0]+" has died. They were a Jailor.");
        deathJailor2Counter++;
    }
    //Same for Coven Leader
    let deathCovenLeaderCounter = 0;
    if ((information[positionOfCovenLeader[0][0]][2] === 0 && ((deathCovenLeaderCounter = 0) || (deathCovenLeaderCounter = 1)))) {
        sendChatMessage("Player "+information[positionOfCovenLeader[0][0]][0]+" has died. They were the Coven Leader.");
        deathCovenLeaderCounter++;
    }
});
_endResultListener.bindListener();



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

//Swap 2 elements in array
function swap(input, index_A, index_B) {
    let temp = input[index_A];

    input[index_A] = input[index_B];
    input[index_B] = temp;
}


function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}


function sendDMMessage(msg, username) {
    socket.sendCommand({
        type: "social",
        command: "chat message",
        data: {
            target: username,
            message: msg
        }
    });
}