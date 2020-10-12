// ==UserScript==
// @name         Dungeon Run
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Dungeon Run AMQ mode
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==



let monsterList = ["Spider", "Bee", "Rat", "Bat", "Slime", "Snake", "Wolf", "Goblin", "Skeleton", "Ghoul", "Mummy", "Ghost", "Hobgoblin", "Kobold", "Siren", "Wraith", "Troll", "Orc", "Harpy",
                   "Gargoyle", "Minotaur", "Werewolf", "Cockatrice", "Golem", "Wyvern", "Ogre", "Vampire", "Griffon", "Lich", "Demon", "Hydra", "Phoenix", "Dragon"];
let levelMin = [1, 1, 2, 2, 3, 4, 5, 5, 6, 6, 6, 7, 9, 9, 10, 12, 15, 16, 17, 17, 20, 22, 24, 30, 35, 40, 42, 48, 55, 65, 80, 90, 120];
let levelMax = [2, 3, 4, 5, 5, 6, 7, 8, 8, 9, 10, 10, 12, 12, 13, 16, 18, 20, 20, 21, 25, 26, 30, 35, 40, 45, 50, 58, 70, 80, 100, 120, 150];
let numberOfRandomSongs = [];
for (let i = 0; i < monsterList.length; i++) {
    numberOfRandomSongs.push(i);
}
let songDiffMin = [];
let songDiffMax = [];
for (let i = 0; i < monsterList.length; i++) {
    songDiffMin.push(50*Math.exp(-numberOfRandomSongs[i]/5));
    songDiffMax.push(100*Math.exp(-numberOfRandomSongs[i]/15));
}
let monsters = [];
//Creation of monster info matrix
for (let i = 0; i < monsterList.length; i++){
    monsters[i]=new Array(6);
};
for (let j = 0; j < monsterList.length; j++){
    monsters[j][0] = monsterList[j];
    monsters[j][1] = levelMin[j];
    monsters[j][2] = levelMax[j];
    monsters[j][3] = numberOfRandomSongs[j];
    monsters[j][4] = songDiffMin[j];
    monsters[j][5] = songDiffMax[j];
};

let dungeonRunLength = 5;
let levelOfMonster = 0;
let baseHP = 0;
let HP = 0;
let baseAttackPower = 0;
let difficulty = [];
let characterLevel = 0;
let newMonster = [];
let positionOfMonster = [];

let inDungeon = false;
let inParty = false;
let inBattle1 =false;
let inBattle2 =false;
let inBattle3 =false;
let inBattle4 =false;
let inBattle5 =false;

let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.message.startsWith("/start") && payload.sender === selfName && inDungeon == false) {
        //Beginning of the game
        inDungeon = true;
        sendChatMessage("Please select difficulty.");
        sendChatMessage("Quests are rated F to SSS");
        let idOfPlayers = [];
        for (let playerID in lobby.players) {
            idOfPlayers.push(playerID);
        };
        let levelTot = [];
        for (let i = 0; i < idOfPlayers.length; i++) {
            levelTot.push(lobby.players[parseInt(idOfPlayers[i])].level);
        };
        //levelTot = sum(levelTot);
        levelTot = 4000;
        sendChatMessage("Your party is Lv."+Math.ceil(levelTot/500));
        if (levelTot < 500) {
            sendChatMessage("Recommended difficulty: F");
            baseAttackPower = 5;
        }
        else if (levelTot >= 500 && levelTot < 1000) {
            sendChatMessage("Recommended difficulty: E");
            baseAttackPower = 10;
        }
        else if (levelTot >= 1000 && levelTot < 1500) {
            sendChatMessage("Recommended difficulty: D");
            baseAttackPower = 20;
        }
        else if (levelTot >= 1500 && levelTot < 2000) {
            sendChatMessage("Recommended difficulty: C");
            baseAttackPower = 30;
        }
        else if (levelTot >= 2000 && levelTot < 2500) {
            sendChatMessage("Recommended difficulty: B");
            baseAttackPower = 40;
        }
        else if (levelTot >= 2500 && levelTot < 3000) {
            sendChatMessage("Recommended difficulty: A");
            baseAttackPower = 50;
        }
        else if (levelTot >= 3000 && levelTot < 3500) {
            sendChatMessage("Recommended difficulty: S");
            baseAttackPower = 60;
        }
        else if (levelTot >= 3500 && levelTot < 4000) {
            sendChatMessage("Recommended difficulty: SS");
            baseAttackPower = 70;
        }
        else {
            sendChatMessage("Recommended difficulty: SSS");
            baseAttackPower = 80;
        }
        let commandListener2 = new Listener("Game Chat Message", (payload) => {
            if (payload.message.startsWith("/") && payload.sender === selfName && inParty == false) {
                inParty = true;
                inBattle1 = true;
                let message = payload.message.split("/");
                sendChatMessage("Difficulty "+message[1]+" has been selected.");
                difficulty = message[1];
                let relativeMinRating = 0;
                let relativeFirstMonster = getRandomIntInclusive(0,2);
                let indexOfMinLevelRating = [];

                switch(difficulty) {
                    case "F":
                        relativeMinRating = 1;
                        for (let i = 0; i < monsters.length; i++) {
                            if (monsters[i][1] == relativeMinRating) {
                                positionOfMonster.push(i);
                            }
                        }
                        if (positionOfMonster.length > 1) {
                            positionOfMonster = [positionOfMonster[getRandomIntInclusive(0,positionOfMonster.length-1)]];
                        }
                        positionOfMonster[0] += relativeFirstMonster;
                        break;
                    case "E":
                        relativeMinRating = 3;
                        for (let i = 0; i < monsters.length; i++) {
                            if (monsters[i][1] == relativeMinRating) {
                                positionOfMonster.push(i);
                            }
                        }
                        if (positionOfMonster.length > 1) {
                            positionOfMonster = [positionOfMonster[getRandomIntInclusive(0,positionOfMonster.length-1)]];
                        }
                        positionOfMonster[0] += relativeFirstMonster;
                        break;
                    case "D":
                        relativeMinRating = 5;
                        for (let i = 0; i < monsters.length; i++) {
                            if (monsters[i][1] == relativeMinRating) {
                                positionOfMonster.push(i);
                            }
                        }
                        if (positionOfMonster.length > 1) {
                            positionOfMonster = [positionOfMonster[getRandomIntInclusive(0,positionOfMonster.length-1)]];
                        }
                        positionOfMonster[0] += relativeFirstMonster;
                        break;
                    case "C":
                        relativeMinRating = 6;
                        for (let i = 0; i < monsters.length; i++) {
                            if (monsters[i][1] == relativeMinRating) {
                                positionOfMonster.push(i);
                            }
                        }
                        if (positionOfMonster.length > 1) {
                            positionOfMonster = [positionOfMonster[getRandomIntInclusive(0,positionOfMonster.length-1)]];
                        }
                        positionOfMonster[0] += relativeFirstMonster;
                        break;
                    case "B":
                        relativeMinRating = 7;
                        for (let i = 0; i < monsters.length; i++) {
                            if (monsters[i][1] == relativeMinRating) {
                                positionOfMonster.push(i);
                            }
                        }
                        if (positionOfMonster.length > 1) {
                            positionOfMonster = [positionOfMonster[getRandomIntInclusive(0,positionOfMonster.length-1)]];
                        }
                        positionOfMonster[0] += relativeFirstMonster;
                        break;
                    case "A":
                        relativeMinRating = 10;
                        for (let i = 0; i < monsters.length; i++) {
                            if (monsters[i][1] == relativeMinRating) {
                                positionOfMonster.push(i);
                            }
                        }
                        if (positionOfMonster.length > 1) {
                            positionOfMonster = [positionOfMonster[getRandomIntInclusive(0,positionOfMonster.length-1)]];
                        }
                        positionOfMonster[0] += relativeFirstMonster;
                        break;
                    case "S":
                        relativeMinRating = 15;
                        for (let i = 0; i < monsters.length; i++) {
                            if (monsters[i][1] == relativeMinRating) {
                                positionOfMonster.push(i);
                            }
                        }
                        if (positionOfMonster.length > 1) {
                            positionOfMonster = [positionOfMonster[getRandomIntInclusive(0,positionOfMonster.length-1)]];
                        }
                        positionOfMonster[0] += relativeFirstMonster;
                        break;
                    case "SS":
                        relativeMinRating = 20;
                        for (let i = 0; i < monsters.length; i++) {
                            if (monsters[i][1] == relativeMinRating) {
                                positionOfMonster.push(i);
                            }
                        }
                        if (positionOfMonster.length > 1) {
                            positionOfMonster = [positionOfMonster[getRandomIntInclusive(0,positionOfMonster.length-1)]];
                        }
                        positionOfMonster[0] += relativeFirstMonster;
                        break;
                    case "SSS":
                        relativeMinRating = 30;
                        for (let i = 0; i < monsters.length; i++) {
                            if (monsters[i][1] == relativeMinRating) {
                                positionOfMonster.push(i);
                            }
                        }
                        if (positionOfMonster.length > 1) {
                            positionOfMonster = [positionOfMonster[getRandomIntInclusive(0,positionOfMonster.length-1)]];
                        }
                        positionOfMonster[0] += relativeFirstMonster;
                        break;
                }
                //Load in advance what the position of the other monsters are
                positionOfMonster[1] = positionOfMonster[0] + getRandomIntInclusive(1,3);
                positionOfMonster[2] = positionOfMonster[1] + getRandomIntInclusive(1,3);
                positionOfMonster[3] = positionOfMonster[2] + getRandomIntInclusive(1,3);
                positionOfMonster[4] = positionOfMonster[3] + getRandomIntInclusive(1,3);

                //Display first monster
                newMonster = monsters[positionOfMonster[0]];
                sendChatMessage("A wild "+newMonster[0]+" appears.");

                levelOfMonster = getRandomIntInclusive(newMonster[1],newMonster[2]);
                baseHP = Math.round(100/3*levelOfMonster);
                HP = baseHP;
                sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
                sendChatMessage("🟩🟩🟩🟩🟩🟩🟩🟩"+HP/baseHP*100+"%");
                sendChatMessage("---------------------------------------------------");
                setDifficulty([newMonster[4],newMonster[5]]);

                let resultListener = new Listener("answer results", function (result) {
                    if (inBattle1 == true && inBattle2 == false && inBattle3 == false && inBattle4 == false && inBattle5 == false) {
                        setTimeout(function() {answerResultsListenerAction(result)}, 1000);
                    }
                });
                resultListener.bindListener();

                //I can't seem to find the listener for a right answer so I use the listener when we get xp instead
                let xpListener = new Listener("quiz xp credit gain", function (data) {
                    if (inBattle1 == true && inBattle2 == false && inBattle3 == false && inBattle4 == false && inBattle5 == false) {
                        setTimeout(function() {rightAnswerListenerAction(data)}, 1000);
                    }
                });
                xpListener.bindListener();


                let returnLobbyListener = new Listener("return lobby vote result", function (payload) {
                    if (payload.passed) {
                        inBattle1 = false;
                        inBattle2 = true;
                        if (inBattle1 == false && inBattle2 == true && inBattle3 == false && inBattle4 == false && inBattle5 == false) {
                            setTimeout(function() {partyAdvances(1)}, 2000);
                            setTimeout(function() {console.log("Advance1");}, 2000);
                            setTimeout(function() {console.log(newMonster);}, 2000);
                        }
                        let resultListener = new Listener("answer results", function (result) {
                            if (inBattle1 == false && inBattle2 == true && inBattle3 == false && inBattle4 == false && inBattle5 == false) {
                                setTimeout(function() {answerResultsListenerAction(result)}, 1000);
                            }
                        });
                        resultListener.bindListener();
                        let xpListener = new Listener("quiz xp credit gain", function (data) {
                            if (inBattle1 == false && inBattle2 == true && inBattle3 == false && inBattle4 == false && inBattle5 == false) {
                                setTimeout(function() {rightAnswerListenerAction(data)}, 1000);
                            }
                        });
                        xpListener.bindListener();
                        let returnLobbyListener = new Listener("return lobby vote result", function (payload) {
                            if (payload.passed) {
                                inBattle2 = false;
                                inBattle3 = true;
                                if (inBattle1 == false && inBattle2 == false && inBattle3 == true && inBattle4 == false && inBattle5 == false) {
                                    setTimeout(function() {partyAdvances(2)}, 2000);
                                    setTimeout(function() {console.log("Advance2");}, 2000);
                                    setTimeout(function() {console.log(newMonster);}, 2000);
                                }
                                let resultListener = new Listener("answer results", function (result) {
                                    if (inBattle1 == false && inBattle2 == false && inBattle3 == true && inBattle4 == false && inBattle5 == false) {
                                        setTimeout(function() {answerResultsListenerAction(result)}, 1000);
                                    }
                                });
                                resultListener.bindListener();
                                let xpListener = new Listener("quiz xp credit gain", function (data) {
                                    if (inBattle1 == false && inBattle2 == false && inBattle3 == true && inBattle4 == false && inBattle5 == false) {
                                        setTimeout(function() {rightAnswerListenerAction(data)}, 1000);
                                    }
                                });
                                let returnLobbyListener = new Listener("return lobby vote result", function (payload) {
                                    if (payload.passed) {
                                        inBattle3 = false;
                                        inBattle4 = true;
                                        if (inBattle1 == false && inBattle2 == false && inBattle3 == false && inBattle4 == true && inBattle5 == false) {
                                            setTimeout(function() {partyAdvances(3)}, 2000);
                                            setTimeout(function() {console.log("Advance3");}, 2000);
                                            setTimeout(function() {console.log(newMonster);}, 2000);
                                        }
                                        let resultListener = new Listener("answer results", function (result) {
                                            if (inBattle1 == false && inBattle2 == false && inBattle3 == false && inBattle4 == true && inBattle5 == false) {
                                                setTimeout(function() {answerResultsListenerAction(result)}, 1000);
                                            }
                                        });
                                        resultListener.bindListener();
                                        let xpListener = new Listener("quiz xp credit gain", function (data) {
                                            if (inBattle1 == false && inBattle2 == false && inBattle3 == false && inBattle4 == true && inBattle5 == false) {
                                                setTimeout(function() {rightAnswerListenerAction(data)}, 1000);
                                            }
                                        });
                                        let returnLobbyListener = new Listener("return lobby vote result", function (payload) {
                                            if (payload.passed) {
                                                inBattle4 = false;
                                                inBattle5 = true;
                                                if (inBattle1 == false && inBattle2 == false && inBattle3 == false && inBattle4 == false && inBattle5 == true) {
                                                    setTimeout(function() {partyAdvances(4)}, 2000);
                                                    setTimeout(function() {console.log("Advance4");}, 2000);
                                                    setTimeout(function() {console.log(newMonster);}, 2000);
                                                }
                                                let resultListener = new Listener("answer results", function (result) {
                                                    if (inBattle1 == false && inBattle2 == false && inBattle3 == false && inBattle4 == false && inBattle5 == true) {
                                                        setTimeout(function() {answerResultsListenerAction(result)}, 1000);
                                                    }
                                                });
                                                resultListener.bindListener();
                                                let xpListener = new Listener("quiz xp credit gain", function (data) {
                                                    if (inBattle1 == false && inBattle2 == false && inBattle3 == false && inBattle4 == false && inBattle5 == true) {
                                                        setTimeout(function() {rightAnswerListenerAction(data)}, 1000);
                                                    }
                                                });
                                            }
                                        });
                                        returnLobbyListener.bindListener();
                                    }
                                });
                                returnLobbyListener.bindListener();
                            }
                        });
                        returnLobbyListener.bindListener();
                    }
                });
                returnLobbyListener.bindListener();

            }
        });
        commandListener2.bindListener();
    }
});
commandListener.bindListener();

let lifeBar = "🟩🟩🟩🟩🟩🟩🟩🟩";
let attackPower = 0;
let attackModifier = 0;
let relativeHP = 0;
function rightAnswerListenerAction(data) {
    attackPower = getRandomGIntInclusive(10, baseAttackPower - 0.15*baseAttackPower, baseAttackPower + 0.15*baseAttackPower);
    sendChatMessage("You dealt "+attackPower+" damage!");
    HP = HP - attackPower;
    if (HP/baseHP >= 7/8){
        sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
        lifeBar = "🟩🟩🟩🟩🟩🟩🟩🟩";
        sendChatMessage(lifeBar+Math.ceil(HP/baseHP*100)+"%");
        sendChatMessage("---------------------------------------------------");
    }
    else if (HP/baseHP >= 6/8 && HP/baseHP < 7/8){
        sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
        lifeBar = "🟩🟩🟩🟩🟩🟩🟩⬜";
        sendChatMessage(lifeBar+Math.ceil(HP/baseHP*100)+"%");
        sendChatMessage("---------------------------------------------------");
    }
    else if (HP/baseHP >= 5/8 && HP/baseHP < 6/8){
        sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
        lifeBar = "🟩🟩🟩🟩🟩🟩⬜⬜";
        sendChatMessage(lifeBar+Math.ceil(HP/baseHP*100)+"%");
        sendChatMessage("---------------------------------------------------");
    }
    else if (HP/baseHP >= 4/8 && HP/baseHP < 5/8){
        sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
        lifeBar = "🟩🟩🟩🟩🟩⬜⬜⬜";
        sendChatMessage(lifeBar+Math.ceil(HP/baseHP*100)+"%");
        sendChatMessage("---------------------------------------------------");
    }
    else if (HP/baseHP >= 3/8 && HP/baseHP < 4/8){
        sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
        lifeBar = "🟩🟩🟩🟩⬜⬜⬜⬜";
        sendChatMessage(lifeBar+Math.ceil(HP/baseHP*100)+"%");
        sendChatMessage("---------------------------------------------------");
    }
    else if (HP/baseHP >= 2/8 && HP/baseHP < 3/8){
        sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
        lifeBar = "🟩🟩🟩⬜⬜⬜⬜⬜";
        sendChatMessage(lifeBar+Math.ceil(HP/baseHP*100)+"%");
        sendChatMessage("---------------------------------------------------");
    }
    else if (HP/baseHP >= 1/8 && HP/baseHP < 2/8){
        sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
        lifeBar = "🟩🟩⬜⬜⬜⬜⬜⬜";
        sendChatMessage(lifeBar+Math.ceil(HP/baseHP*100)+"%");
        sendChatMessage("---------------------------------------------------");
    }
    else if (HP/baseHP >= 0/8 && HP/baseHP < 1/8){
        sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
        lifeBar = "🟩⬜⬜⬜⬜⬜⬜⬜";
        sendChatMessage(lifeBar+Math.ceil(HP/baseHP*100)+"%");
        sendChatMessage("---------------------------------------------------");
    }
    else {
        sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
        lifeBar = "⬜⬜⬜⬜⬜⬜⬜⬜";
        sendChatMessage(lifeBar+"0%");
        sendChatMessage("---------------------------------------------------");
        inBattle1 = false;
        inBattle2 = false;
        inBattle3 = false;
        inBattle4 = false;
        inBattle5 = false;
        quiz.startReturnLobbyVote();
    }
};

function partyAdvances(battleNumber) {
    newMonster = monsters[positionOfMonster[battleNumber]];
    sendChatMessage("A wild "+newMonster[0]+" appears.");

    levelOfMonster = getRandomIntInclusive(newMonster[1],newMonster[2]);
    baseHP = Math.round(100/3*levelOfMonster);
    HP = baseHP;
    sendChatMessage(newMonster[0]+" Lv."+levelOfMonster);
    sendChatMessage("🟩🟩🟩🟩🟩🟩🟩🟩"+HP/baseHP*100+"%");
    sendChatMessage("---------------------------------------------------");
    setDifficulty([newMonster[4],newMonster[5]]);
}


function answerResultsListenerAction(result) {
    //'cause it might not be the same players as the one at the beginning
    let idOfPlayers = [];
    let scores = [];
    for (let playerID in quiz.players) {
        idOfPlayers.push(playerID);
    };
    for (let i = 0; i < size(quiz.scoreboard.playerEntries); i++) {
        scores.push(quiz.scoreboard.playerEntries[idOfPlayers[i]].$score[0].innerText);
    };
    if (Math.max(...scores) === 0) {
        sendChatMessage("Your party has died. You'll get isekai'd in order to try another time.");
        inDungeon = false;
        inParty = false;
        inBattle1 =false;
        inBattle2 =false;
        inBattle3 =false;
        inBattle4 =false;
        inBattle5 =false;
    }
};




// listen for when room settings change
let settingsChangeListener = new Listener("Room Settings Changed", payload => {
    hostModal.changeSettings(payload);
    Object.keys(payload).forEach(key => {
        let newValue = payload[key];
        let oldValue = lobby.settings[key];
        lobby.settings[key] = newValue;
    });
});

settingsChangeListener.bindListener();


// set new difficulty
function setDifficulty(diffRange) {
    hostModal.songDiffAdvancedSwitch.setOn(true);
    hostModal.songDiffRangeSliderCombo.setValue(diffRange);
    lobby.changeGameSettings();
}

function setGuessTime(time) {
    hostModal.playLengthSliderCombo.setValue(time);
    lobby.changeGameSettings();
}


//Obtain the size of an object
function size(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

//sum of elements of array
function sum(input){
    if (toString.call(input) !== "[object Array]")
        return false;

    var total =  0;
    for(var i=0;i<input.length;i++) {
        if(isNaN(input[i])){
            continue;
        }
        total += Number(input[i]);
    }
    return total;
}

//Randomizer function
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// v is the number of times random is summed and should be over >= 1
// return a random number between min and max exclusive
function getRandomGIntInclusive(v, min, max) {
    var r = 0;
    for(var i = v; i > 0; i --){
        r += Math.random();
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    // r / v is the random in [0,1] that the gaussian distribution gives
    //return r / v;
    return Math.floor((r/v) * (max - min +1)) + min;
}

function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}