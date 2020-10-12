// ==UserScript==
// @name         Pokémon
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Pokémon
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==

let inBattle = false;
let inAction = false;
let inMoveset = false;

let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.sender === selfName && payload.message === "!" && inBattle == false) {
        inBattle = true;
        inMoveset = false;
        sendChatMessage("https://www.youtube.com/watch?v=LF_mzjhK6vU");
        setTimeout(function(){ sendChatMessage("Wild PIKACHU appears!"); }, 1000);
        setTimeout(function(){ sendChatMessage("Go! CHARMANDER!"); }, 1500);
        setTimeout(function(){ sendChatMessage("---------------------------------------------------"); }, 2500);
        setTimeout(function(){ sendChatMessage("PIKACHU♂Lv5"); }, 2500);
        setTimeout(function(){ sendChatMessage("🟩🟩🟩🟩🟩🟩🟩🟩"); }, 2500);
        setTimeout(function(){ sendChatMessage("Charmander♂Lv13"); }, 2500);
        setTimeout(function(){ sendChatMessage("🟩🟩🟩🟩🟩🟩🟩🟩"); }, 2500);
        setTimeout(function(){ sendChatMessage("---------------------------------------------------"); }, 2500);
        setTimeout(function(){ sendChatMessage("What will CHARMANDER do?"); }, 3500);
        setTimeout(function(){ sendChatMessage("1) FIGHT"); }, 3500);
        setTimeout(function(){ sendChatMessage("2) BAG"); }, 3500);
        setTimeout(function(){ sendChatMessage("3) POKéMON"); }, 3500);
        setTimeout(function(){ sendChatMessage("4) RUN"); }, 3500);
        let commandListener2 = new Listener("Game Chat Message", (payload) => {
            if (payload.sender === selfName && payload.message === "1" && inAction == false) {
                inAction = true;
                sendChatMessage("---------------------------------------------------");
                sendChatMessage("1) SCRATCH");
                sendChatMessage("2) GROWL");
                sendChatMessage("3) EMBER");
                sendChatMessage("4) METAL CLAW");

                let commandListener3 = new Listener("Game Chat Message", (payload) => {
                    if (payload.sender === selfName && payload.message === "3" && inMoveset == false) {
                        inMoveset = true;
                        sendChatMessage("---------------------------------------------------");
                        sendChatMessage("CHARMANDER used EMBER!");
                        setTimeout(function(){ sendChatMessage("---------------------------------------------------"); }, 1000);
                        setTimeout(function(){ sendChatMessage("PIKACHU♂Lv5"); }, 1500);
                        setTimeout(function(){ sendChatMessage("🟩🟩🟩🟩🟩🟩🟩🟩"); }, 1500);
                        setTimeout(function(){ sendChatMessage("🟩🟩🟩🟩🟩🟩🟩⬜"); }, 1800);
                        setTimeout(function(){ sendChatMessage("🟩🟩🟩🟩🟩🟩⬜⬜"); }, 2100);
                        setTimeout(function(){ sendChatMessage("🟩🟩🟩🟩🟩⬜⬜⬜"); }, 2400);
                        setTimeout(function(){ sendChatMessage("🟩🟩🟩🟩⬜⬜⬜⬜"); }, 2700);
                        setTimeout(function(){ sendChatMessage("🟩🟩🟩⬜⬜⬜⬜⬜"); }, 3000);
                        setTimeout(function(){ sendChatMessage("🟩🟩⬜⬜⬜⬜⬜⬜"); }, 3300);
                        setTimeout(function(){ sendChatMessage("🟩⬜⬜⬜⬜⬜⬜⬜"); }, 3600);
                        setTimeout(function(){ sendChatMessage("⬜⬜⬜⬜⬜⬜⬜⬜"); }, 3900);
                        setTimeout(function(){ sendChatMessage("---------------------------------------------------"); }, 3900);
                        setTimeout(function(){ sendChatMessage("Wild PIKACHU fainted!"); }, 4400);
                        setTimeout(function(){ sendChatMessage("CHARMANDER gained 58 EXP. Points!"); }, 5100);
                        inBattle = false;
                        inAction = false;
                    }
                });
                commandListener3.bindListener();
            }

        });
        commandListener2.bindListener();

    }
});
commandListener.bindListener();






function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}

