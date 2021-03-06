// ==UserScript==
// @name         Trivia Game
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Script for AMQ Trivia Game
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/animeEntries.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/artists.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/songNames.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/Questions.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/Answers.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/Types.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/Wrong%20Answers%201.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/Wrong%20Answers%202.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/Wrong%20Answers%203.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/Quiz/Wrong%20Answers%204.user.js
// ==/UserScript==

//Needed after a chrome update I think
if (document.getElementById("startPage")) return;

//let loadInterval = setInterval(() => {
//    if (document.getElementById("loadingScreen").classList.contains("hidden")) {
//        loadScript();
//        clearInterval(loadInterval);
//    }
//}, 500);


//Chat command Listeners
let questionNumber;
let choices = [];
let displayChoices = [];
let choicesGeneratorNumbers = [];
let choicesAll = [];
let i;
let numberOfWrongChoices = 4;
let question1 = [];
let question2 = [];
let question3 = [];
let indexOfRightAnswer = [];
let letter = [];
let gameAnswer = [];
let inQuestion = false;
let alreadyAnswered = false;



let commandListener = new Listener("game chat update", (payload) => {
    if (payload.messages[0].sender === selfName && payload.messages[0].message.startsWith("/trivia")) {
        sendChatMessage("I'll ask random questions, you'll have 20 seconds to send me a DM with a, b, c or d for your answer.");
        sendChatMessage("People who got the answer right are allowed to play 1 LMS game at 1 life.");
        sendChatMessage("Points can be seen at the end of every round using 'Scoreboard'.");
        sendChatMessage("Btw, I'm always seeking new people to help add more question. Tell me if you're interested.");
    }
    else if (payload.messages[0].sender === selfName && payload.messages[0].message.startsWith("/p")) {
        if (players.length == 0){
            sendChatMessage("Please create a scoreboard first using 'Scoreboard'");
        }
        else {
            // give the winner of the round a point
            let message = payload.messages[0].message.split(" ");
            updateScore(message[1]);
        }
    }
    else if (payload.messages[0].sender === selfName && payload.messages[0].message.startsWith("/sub")) {
        let message = payload.messages[0].message.split(" ");
        substractScore(message[1]);
    }
    else if (payload.messages[0].sender === selfName && payload.messages[0].message.startsWith("/resetscore")) {
        resetScore();
    }
    else if (payload.messages[0].sender === selfName && payload.messages[0].message.startsWith("/scoreboard")) {
        inGame = true;
        sendChatMessage("Creating Scoreboard...");
        players = [];
        scores = [];
        for (let playerId in lobby.players) {
            players.push(lobby.players[playerId]._name);
            scores.push(0);
        }
        sendChatMessage("Done!");
    }
    else if (payload.messages[0].sender === selfName && payload.messages[0].message.startsWith("/add")) {
        let playerAdded = payload.messages[0].message.split(" ");
        console.log(playerAdded[1]);
        players.push(playerAdded[1]);
        scores.push(0);
        sendChatMessage("Player "+playerAdded[1]+" has been added to the scoreboard.");
    }
    else if (payload.messages[0].sender === selfName && payload.messages[0].message.startsWith("/endgame")) {
        inGame = false;
        sendChatMessage("Game has ended.")
    }
    //else if (payload.sender === selfName && payload.message.startsWith("/help")) {
    //sendChatMessage("1. /p 'player' = give 'player' a point");
    //sendChatMessage("2. /resetscore = reset the scoreboard");
    //sendChatMessage("3. /scoreboard = create scoreboard before game starts");
    //sendChatMessage("4. /setwin 'number' = sets 'number' as the points needed to win");
    //}
    else if (payload.messages[0].sender === selfName && payload.messages[0].message.startsWith("/setwin")) {
        let message = payload.message.split(" ");
        winningScore = parseInt(message[1]);
        sendChatMessage("Winning score has been set to " + winningScore + ".");
    }
    if (payload.messages[0].sender === selfName && payload.messages[0].message.startsWith("/question")) {
        listPlayers= [];
        inQuestion = true;
        alreadyAnswered = false;
        choicesGeneratorNumbers = [];
        questionNumber = getRandomIntInclusive(0, question.length);
        question1 = question[questionNumber].slice(0,150);
        question2 = question[questionNumber].slice(150,300);
        question3 = question[questionNumber].slice(300);
        sendChatMessage("---------------------------------------------------");
        sendChatMessage(question1);
        sendChatMessage(question2);
        sendChatMessage(question3);
        sendChatMessage("---------------------------------------------------");
        //setTimeout(function(){ sendChatMessage("20..."); }, 4000);
        //setTimeout(function(){ sendChatMessage("19..."); }, 5000);
        //setTimeout(function(){ sendChatMessage("18..."); }, 6000);
        //setTimeout(function(){ sendChatMessage("17..."); }, 7000);
        //setTimeout(function(){ sendChatMessage("16..."); }, 8000);
        //setTimeout(function(){ sendChatMessage("15 seconds..."); }, 9000);
        //setTimeout(function(){ sendChatMessage("14..."); }, 10000);
        //setTimeout(function(){ sendChatMessage("13..."); }, 11000);
        //setTimeout(function(){ sendChatMessage("12..."); }, 12000);
        //setTimeout(function(){ sendChatMessage("11..."); }, 13000);
        //setTimeout(function(){ sendChatMessage("10 seconds..."); }, 14000);
        //setTimeout(function(){ sendChatMessage("9..."); }, 15000);
        //setTimeout(function(){ sendChatMessage("8..."); }, 16000);
        //setTimeout(function(){ sendChatMessage("7..."); }, 17000);
        //setTimeout(function(){ sendChatMessage("6..."); }, 18000);
        setTimeout(function(){ sendChatMessage("5..."); }, 19000);
        setTimeout(function(){ sendChatMessage("4..."); }, 20000);
        setTimeout(function(){ sendChatMessage("3..."); }, 21000);
        setTimeout(function(){ sendChatMessage("2..."); }, 22000);
        setTimeout(function(){ sendChatMessage("1..."); }, 23000);


        switch(type[questionNumber]){
            case "numberSmall":
                answer[questionNumber] = parseInt(answer[questionNumber]);
                choicesAll = [];
                //pick numberOfWrongChoices+1 unique choices
                while(choicesAll.length < numberOfWrongChoices+1){
                    choicesGeneratorNumbers = [];
                    choicesGeneratorNumbers = getRandomIntInclusive(1, 2*answer[questionNumber]+2);
                    if(choicesAll.indexOf(choicesGeneratorNumbers) === -1) choicesAll.push(choicesGeneratorNumbers);
                }
                //if one of the choices is the real answer, remove it
                indexOfRightAnswer = choicesAll.indexOf(answer[questionNumber]);
                if (indexOfRightAnswer >-1){
                    choicesAll.splice(indexOfRightAnswer,1);
                }
                choices = shuffle(choicesAll);
                displayChoices = [answer[questionNumber], choices[0], choices[1], choices[2], choices[3]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){displayChatChoices();}, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
            case "numberMedium":
                answer[questionNumber] = parseInt(answer[questionNumber]);
                choicesAll = [];
                //pick numberOfWrongChoices+1 unique choices
                while(choicesAll.length < numberOfWrongChoices+1){
                    choicesGeneratorNumbers = [];
                    choicesGeneratorNumbers = getRandomIntInclusive(1, 5*answer[questionNumber]);
                    if(choicesAll.indexOf(choicesGeneratorNumbers) === -1) choicesAll.push(choicesGeneratorNumbers);
                }
                console.log(choicesAll);
                //if one of the choices is the real answer, remove it
                indexOfRightAnswer = choicesAll.indexOf(answer[questionNumber]);
                if (indexOfRightAnswer >-1){
                    choicesAll.splice(indexOfRightAnswer,1);
                }
                choices = shuffle(choicesAll);
                displayChoices = [answer[questionNumber], choices[0], choices[1], choices[2], choices[3]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){displayChatChoices();}, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
            case "numberBig":
                answer[questionNumber] = parseInt(answer[questionNumber]);
                choicesAll = [];
                //pick numberOfWrongChoices+1 unique choices
                while(choicesAll.length < numberOfWrongChoices+1){
                    choicesGeneratorNumbers = [];
                    choicesGeneratorNumbers = getRandomIntInclusive(1, 10*answer[questionNumber]);
                    if(choicesAll.indexOf(choicesGeneratorNumbers) === -1) choicesAll.push(choicesGeneratorNumbers);
                }
                //if one of the choices is the real answer, remove it
                indexOfRightAnswer = choicesAll.indexOf(answer[questionNumber]);
                if (indexOfRightAnswer >-1){
                    choicesAll.splice(indexOfRightAnswer,1);
                }
                choices = shuffle(choicesAll);
                displayChoices = [answer[questionNumber], choices[0], choices[1], choices[2], choices[3]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){displayChatChoices();}, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
            case "title":
                indexOfRightAnswer = animeEntries.indexOf(answer[questionNumber]);
                if (indexOfRightAnswer >-1){
                    animeEntries.splice(indexOfRightAnswer,1);
                }
                choicesAll = shuffle(animeEntries);
                choices = choicesAll.slice(0,numberOfWrongChoices);
                displayChoices = [answer[questionNumber], choices[0], choices[1], choices[2], choices[3]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){displayChatChoices();}, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                //animeEntries.splice(-1,1,answer[questionNumber]);
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
            case "artist":
                indexOfRightAnswer = artists.indexOf(answer[questionNumber]);
                if (indexOfRightAnswer >-1){
                    artists.splice(indexOfRightAnswer,1);
                }
                choicesAll = shuffle(artists);
                choices = choicesAll.slice(0,numberOfWrongChoices);
                displayChoices = [answer[questionNumber], choices[0], choices[1], choices[2], choices[3]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){displayChatChoices();}, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                //artists.splice(-1,1,answer[questionNumber]);
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
            case "song":
                indexOfRightAnswer = songNames.indexOf(answer[questionNumber]);
                if (indexOfRightAnswer >-1){
                    songNames.splice(indexOfRightAnswer,1);
                }
                choicesAll = shuffle(songNames);
                choices = choicesAll.slice(0,numberOfWrongChoices);
                displayChoices = [answer[questionNumber], choices[0], choices[1], choices[2], choices[3]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){displayChatChoices();}, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                //songNames.splice(-1,1,answer[questionNumber]);
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
            case "year":
                answer[questionNumber] = parseInt(answer[questionNumber]);
                choicesGeneratorNumbers = createChoicesGeneratorNumber(answer[questionNumber]-10, answer[questionNumber]+10, answer[questionNumber]);
                choicesAll = shuffle(choicesGeneratorNumbers);
                choices = choicesGeneratorNumbers.slice(0,numberOfWrongChoices);
                displayChoices = [answer[questionNumber], choices[0], choices[1], choices[2], choices[3]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){displayChatChoices();}, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
            case "money":
                //pick numberOfWrongChoices+1 unique choices
                choicesAll = [];
                while(choicesAll.length < numberOfWrongChoices+1){
                    choicesGeneratorNumbers = generateRandomNumberMoney(answer[questionNumber]);
                    if(choicesAll.indexOf(choicesGeneratorNumbers) === -1) choicesAll.push(choicesGeneratorNumbers);
                }
                //if one of the choices is the real answer, remove it
                indexOfRightAnswer = choicesAll.indexOf(answer[questionNumber]);
                if (indexOfRightAnswer >-1){
                    choicesAll.splice(indexOfRightAnswer,1);
                }
                choices = choicesAll.slice(0,numberOfWrongChoices);
                displayChoices = [answer[questionNumber], choices[0], choices[1], choices[2], choices[3]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){sendChatMessage("a) "+formatNumber(displayChoices[0]));
                                      sendChatMessage("b) "+formatNumber(displayChoices[1]));
                                      sendChatMessage("c) "+formatNumber(displayChoices[2]));
                                      sendChatMessage("d) "+formatNumber(displayChoices[3]));
                                      sendChatMessage("e) "+formatNumber(displayChoices[4]));
                                      sendChatMessage("---------------------------------------------------");
                                     }, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
            case "decimal":
                //pick numberOfWrongChoices+1 unique choices
                choicesAll = [];
                while(choicesAll.length < numberOfWrongChoices+1){
                    choicesGeneratorNumbers = generateRandomNumberDecimals(answer[questionNumber]);
                    if(choicesAll.indexOf(choicesGeneratorNumbers) === -1) choicesAll.push(choicesGeneratorNumbers);
                }
                //if one of the choices is the real answer, remove it
                indexOfRightAnswer = choicesAll.indexOf(answer[questionNumber]);
                if (indexOfRightAnswer >-1){
                    choicesAll.splice(indexOfRightAnswer,1);
                }
                choices = choicesAll.slice(0,numberOfWrongChoices);
                displayChoices = [answer[questionNumber], choices[0], choices[1], choices[2], choices[3]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){sendChatMessage("a) "+formatNumber(displayChoices[0]));
                                      sendChatMessage("b) "+formatNumber(displayChoices[1]));
                                      sendChatMessage("c) "+formatNumber(displayChoices[2]));
                                      sendChatMessage("d) "+formatNumber(displayChoices[3]));
                                      sendChatMessage("e) "+formatNumber(displayChoices[4]));
                                      sendChatMessage("---------------------------------------------------");
                                     }, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
            case "custom":
                displayChoices = [answer[questionNumber], wrongAnswersCustom1[questionNumber], wrongAnswersCustom2[questionNumber], wrongAnswersCustom3[questionNumber], wrongAnswersCustom4[questionNumber]];
                displayChoices = shuffle(displayChoices);
                setTimeout(function(){displayChatChoices();}, 1000);
                letter = displayChoices.indexOf(answer[questionNumber]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 24000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 24000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 24000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 24000);
                        break;
                    case 4:
                        gameAnswer = "e";
                        setTimeout(function(){ sendChatMessage("Answer is e)"); }, 24000);
                        break;
                }
                setTimeout(function() {displayChatCongratMessage();}, 24000);
                break;
        }
    }
});
commandListener.bindListener();

//What happens when you type an answer in dm
let listRightPlayers = [];
let listPlayers = [];
let playerAnswer = [];
let commandListenerDM = new Listener("chat message", function (payload) {
    if ((payload.message == "a") || (payload.message == "b") || (payload.message == "c") || (payload.message == "d") || (payload.message == "e")){
        if (inQuestion === true){
            if (listPlayers.includes(payload.sender) === true) {
                sendDMMessage("You have already answered once.", payload.sender);
            }
            if (listPlayers.includes(payload.sender) === false){
                if (payload.message === gameAnswer){
                    //sendChatMessage(payload.sender+" got it right.");
                    listRightPlayers.push(payload.sender);
                    listPlayers.push(payload.sender);
                }
                else {
                    //sendChatMessage(payload.sender+", nope.");
                    listPlayers.push(payload.sender);
                }
            }
        }
        if (inQuestion === false) {
            sendDMMessage(playerAnswer[0]+ ", time is over.", payload.sender);
        }
    }
});
commandListenerDM.bindListener();


//diplay choices in chat
function displayChatChoices() {
    sendChatMessage("a) "+displayChoices[0]);
    sendChatMessage("b) "+displayChoices[1]);
    sendChatMessage("c) "+displayChoices[2]);
    sendChatMessage("d) "+displayChoices[3]);
    sendChatMessage("e) "+displayChoices[4]);
    sendChatMessage("---------------------------------------------------");
}

//display congrat message in chat
function displayChatCongratMessage() {
    if (listRightPlayers.length === 0) {
        sendChatMessage("Nobody got it right or sent it to me on DM.");
        inQuestion = false;
    }
    else if (listRightPlayers.length === 1){
        sendChatMessage("Congratulations player @"+listRightPlayers+", you're the only one that got it so you get a free point!");
        listRightPlayers = [];
        listPlayers = [];
        inQuestion = false;
    }
    else {
        let displayListRightPlayers = listRightPlayers.join(", @");
        let displayCongratMessage = ["Congratulations players @"+displayListRightPlayers+", you get to play the round!"];
        let displayCongratMessage1 = displayCongratMessage.slice(0,150);
        let displayCongratMessage2 = displayCongratMessage.slice(150,300);
        let displayCongratMessage3 = displayCongratMessage.slice(450);
        sendChatMessage(displayCongratMessage1);
        sendChatMessage(displayCongratMessage2);
        sendChatMessage(displayCongratMessage3);
        listRightPlayers = [];
        listPlayers = [];
        inQuestion = false;
    }
}


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

//Send Chat Message
function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}

//Send private messages
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


//Generate random numbers that are gonna be added to the real answer
function createChoicesGeneratorNumber(min, max, exclude){
    var choicesGeneratorNumbers = [];
    for (var i = min; i <= max; i++) {
        choicesGeneratorNumbers.push(i);
    }
    let index = choicesGeneratorNumbers.indexOf(exclude);
    if (index > -1) {
        choicesGeneratorNumbers.splice(index, 1);
    }
    return choicesGeneratorNumbers;
}


//Generate random numbers to replace the numbers before the trailing zeros ex: 35000 -> 42000 or 96000 etc
function generateRandomNumberMoney(number){
    let output = [];
    let revOutput = [];
    let sNumber = number.toString();

    for (var i = 0, len = sNumber.length; i < len; i += 1) {
        output.push(+sNumber.charAt(i));
        revOutput.push(+sNumber.charAt(i));
    }
    revOutput.reverse();

    let counter = 0;
    for (i=0; i<revOutput.length; i++) {
        if (revOutput[i]===0){
            counter++;
        }
        else{
            break;
        }
    };

    let newNumber = [];
    let sNewNumber = [];
    let exponent = number.length-counter;

    newNumber = getRandomIntInclusive(10**(exponent-1),10**(exponent)-1);
    sNewNumber = newNumber.toString();

    let sNewNumberSeparated = [];

    for (var j = 0, len2 = sNewNumber.length; j < len2; j += 1) {
        sNewNumberSeparated.push(+sNewNumber.charAt(j));
    }

    output.splice(0,sNewNumberSeparated.length,sNewNumberSeparated);
    let finalNumber = flatDeep(output);
    let finalNumberJoined = finalNumber.join('');
    return finalNumberJoined;
}

//Generate random numbers to replace units and decimals ex: 54.6213 -> 37.8245
function generateRandomNumberDecimals(number) {
    let indexOfDot = "";
    let sNumber = number.toString();
    indexOfDot = sNumber.indexOf(".");
    let unitsExponent = indexOfDot;
    let decimalsExponent = sNumber.length-indexOfDot-1;
    let units = getRandomIntInclusive(10**(unitsExponent-1),10**(unitsExponent)-1);
    let decimals = getRandomIntInclusive(10**(decimalsExponent-1),10**(decimalsExponent)-1);
    let newNumber = [units+"."+decimals];
    return newNumber;
}

//Collapses all indented arrays. Useful for generateRandomNumberMoney function
function flatDeep(arr) {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val), []);
};

//Format number for money type
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}



//For scoreboard
let winningScore = 0;
let players = [];
let scores = [];
function updateScore(player){
    let index = players.indexOf(player);
    scores[index]++;
    displayScore();
    let winner = scores.indexOf(winningScore);
    if (winner >= 0){
        sendChatMessage("Congrats! Player " + players[winner] + " has won!");
    }
}
//For scoreboard
function substractScore(player){
    let index = players.indexOf(player);
    scores[index]--;
    displayScore();
}
//For scoreboard
function displayScore(){
    sendChatMessage("Current Standings:");
    for (let i = 0; i < players.length; i++) {
        sendChatMessage("@" + players[i] + ": " + scores[i] + " pts");
    }
}
//For scoreboard
function resetScore(){
    sendChatMessage("Resetting scores...");
    for (let i = 0; i < scores.length; i++){
        scores[i] = 0;
    }
    sendChatMessage("Scores have been reset.");
}




//Add score to player after round
//inGame becomes true when /scoreboard and back to false when /endgame
let winners = [];
let inGame = false;

let _endResultListener = new Listener("quiz end result", function (payload) {
    if ( inGame ) {
        winners = [];
        payload.resultStates.forEach(result => {
            let quizPlayer = quiz.players[result.gamePlayerId];
            if (quizPlayer) {
                if (result.endPosition == 1) {
                    winners.push(quizPlayer.name);
                }
            }
        });
        if (winners.length > 1){
            sendChatMessage("Since multiple players finished first, no points will be awarded this round.");
        }
        else {
            // Give final winner a point and update ownership of tile
            let finalWinner = winners[0];
            sendChatMessage("Congrats! Player @" + finalWinner + " has won the round and is awarded a point.");
            updateScore(finalWinner);
        }
    }
});
_endResultListener.bindListener();
