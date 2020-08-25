// ==UserScript==
// @name         AMQ Player Randomizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Player randomizer: select a random player in the AMQ room
// @author       xSardine
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==

if (!window.setupDocumentDone) return;

let players = [];

let commandListener = new Listener("Game Chat Message", (payload) => {
    let test = payload.message;
    if (payload.sender === selfName && test.startsWith("/pickplayer")) {
        if (lobby.inLobby) {
            let message = "";
            sendChatMessage("Picking a random player...");

            for (let playerId in lobby.players) {
                players.push(lobby.players[playerId]._name);
            }

            shuffle(players);

            let nbPlayer = players.length

            let rand1 = 0;
            let rand2 = -1;

            while(rand1 != rand2){
                rand1 = getRandomInt(nbPlayer);
                rand2 = getRandomInt(nbPlayer);
            }

            message = "@" +players[rand1];

            sendChatMessage(message);

            players = [];
        }
        else {
            gameChat.systemMessage("Must be in pre-game lobby");
        }
    }
});

function shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

commandListener.bindListener();