// ==UserScript==
// @name         AMQ Player roller
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Player roller for Captains in Mascrewrade
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==

// don't load on login page
if (document.getElementById("startPage")) return;

// Wait until the LOADING... screen is hidden and load script
let loadInterval = setInterval(() => {
    if (document.getElementById("loadingScreen").classList.contains("hidden")) {
        setup();
        clearInterval(loadInterval);
    }
}, 500);

let command = "/roll cp";
let players = ["allo", "bonjour", "salut"];
let diceResult;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}

let counter=0;
function setup() {
    let commandListener = new Listener("game chat update", (payload) => {
        payload.messages.forEach(message => {
            if (message.sender === selfName && message.message.startsWith(command)) {
                if (players.length >-1) {
                let indexOfPlayer = getRandomIntInclusive(0,players.length-1);
                let playerPicked = players[indexOfPlayer];
                players.splice(indexOfPlayer,1);
                sendChatMessage(playerPicked+"! I choose you!");
                }
                if (players.length == 0 && counter == 0) {
                    sendChatMessage("Wolferine, you don't have any ~~Pokémon~~ players to send out.")
                    counter = 1;
                }
                if (players.length == 0 && counter == 1) {
                    sendChatMessage("Wolferine, you really don't have anybody left.")
                    counter = 2;
                }
                if (players.length == 0 && counter == 2) {
                    sendChatMessage("Dude, stop trying to send someone out! 😠")
                }
            }
        });
    });

    commandListener.bindListener();

}
