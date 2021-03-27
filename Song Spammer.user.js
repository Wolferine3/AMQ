// ==UserScript==
// @name         Song Spammer
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Auto Play in AMQ rooms
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==

let gameOver = new Listener("quiz over", function (roomSettings) {
    setTimeout(function(){ startGame(); }, 1000);
});
gameOver.bindListener();

function startGame() {
    if (lobby.inLobby) {
        socket.sendCommand({
            type: "lobby",
            command: "start game",
        });
    }
}