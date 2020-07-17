// ==UserScript==
// @name         Test Variables 2
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Test reading variable
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @require      https://github.com/Wolferine3/AMQ/blob/master/Test%20variables.user.js
// ==/UserScript==

let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.sender === selfName && payload.message.startsWith("/yes")) {
        sendChatMessage(test123);
    }
});

commandListener.bindListener();

//Send Chat Message
function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}
