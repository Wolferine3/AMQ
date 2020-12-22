// ==UserScript==
// @name         Husa
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Test for /husa
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/animeEntries.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/artists.user.js
// @require      https://github.com/Wolferine3/AMQ/raw/master/Databases/songNames.user.js
// ==/UserScript==

var allAnimeSongDetailsList
var animeList
let indexRandAnime = [];
let indexRandSong = [];
let indexQuestionType = [];
let gameAnswer = [];
let inQuestion = false;

//Needed after a chrome update I think
if (document.getElementById("startPage")) return;

(function() {

    if (document.getElementById('startPage')) {
        return
    }
    loadExpandLibrary()
})();

function loadExpandLibrary() {

    if (document.getElementById('loadingScreen').className != "gamePage hidden") {
        setTimeout(loadExpandLibrary, 3000)
        return
    }

    let expandLibraryEntryListener = new Listener("expandLibrary questions", function (payload) {
        if (payload.success == false) {
            console.log("Failed expand library loading")
            return
        }
        animeList=payload.questions;
        allAnimeSongDetailsList = [];
        let allAnime = [];
        for (var anime of animeList) {
            let songDetailsList = songDetailsListFrom(anime)
            allAnimeSongDetailsList.push([anime.name, songDetailsList]);
            //allAnimeSongDetailsList = allAnimeSongDetailsList.concat(songDetailsList)
        }
    }).bindListener()

    socket.sendCommand({
        type: "library",
        command: "expandLibrary questions"
    })
    return allAnimeSongDetailsList;
}


let songType = ["opening", "ending", "insert"];
let indexOfRightAnswer = [];
let choices = [];
let displayChoices = [];
let choicesGeneratorNumbers = [];
let choicesAll = [];
let letter = [];

let displayQuestionMessage = [];
let displayQuestionMessage0 = [];
let displayQuestionMessage1 = [];
let displayQuestionMessage2 = [];
let displayQuestionMessage3 = [];
let displayQuestionMessage4 = [];
let displayQuestionMessage5 = [];
let displayQuestionMessage6 = [];

let displayChoicesString0 = [];
let displayChoicesString01 = [];
let displayChoicesString02 = [];
let displayChoicesString1 = [];
let displayChoicesString11 = [];
let displayChoicesString12 = [];
let displayChoicesString2 = [];
let displayChoicesString21 = [];
let displayChoicesString22 = [];
let displayChoicesString3 = [];
let displayChoicesString31 = [];
let displayChoicesString32 = [];

let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.sender === selfName && payload.message.startsWith("/husa")) {
        sendChatMessage("I'll ask random s/a questions, you'll have 20 seconds to send me a DM with a, b, c or d for your answer.");
        sendChatMessage("People who got the answer right are allowed to play 1 LMS game at 1 life.");
        sendChatMessage("Points can be seen at the end of every round using 'Scoreboard'.");
    }
    else if (payload.sender === selfName && payload.message.startsWith("/p")) {
        if (players.length == 0){
            sendChatMessage("Please create a scoreboard first using 'Scoreboard'");
        }
        else {
            // give the winner of the round a point
            let message = payload.message.split(" ");
            updateScore(message[1]);
        }
    }
    else if (payload.sender === selfName && payload.message.startsWith("/sub")) {
        let message = payload.message.split(" ");
        substractScore(message[1]);
    }
    else if (payload.sender === selfName && payload.message.startsWith("/resetscore")) {
        resetScore();
    }
    else if (payload.sender === selfName && payload.message.startsWith("/scoreboard")) {
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
    else if (payload.sender === selfName && payload.message.startsWith("/add")) {
        let playerAdded = payload.message.split(" ");
        console.log(playerAdded[1]);
        players.push(playerAdded[1]);
        scores.push(0);
        sendChatMessage("Player "+playerAdded[1]+" has been added to the scoreboard.");
    }
    else if (payload.sender === selfName && payload.message.startsWith("/endgame")) {
        inGame = false;
        sendChatMessage("Game has ended.")
    }
    //else if (payload.sender === selfName && payload.message.startsWith("/help")) {
    //sendChatMessage("1. /p 'player' = give 'player' a point");
    //sendChatMessage("2. /resetscore = reset the scoreboard");
    //sendChatMessage("3. /scoreboard = create scoreboard before game starts");
    //sendChatMessage("4. /setwin 'number' = sets 'number' as the points needed to win");
    //}
    else if (payload.sender === selfName && payload.message.startsWith("/setwin")) {
        let message = payload.message.split(" ");
        winningScore = parseInt(message[1]);
        sendChatMessage("Winning score has been set to " + winningScore + ".");
    }
    if (payload.sender === selfName && payload.message.startsWith("/question")) {
        inQuestion = true;
        listPlayers = [];
        listRightPlayers = [];
        indexRandAnime = [];
        indexRandSong = [];
        indexQuestionType = [];
        indexRandAnime = getRandomIntInclusive(0, allAnimeSongDetailsList.length-1);
        indexRandSong = getRandomIntInclusive(0, allAnimeSongDetailsList[indexRandAnime][1].length-1);
        indexQuestionType = getRandomIntInclusive(0,2);
        switch (indexQuestionType){
            case 0:
                gameAnswer = [allAnimeSongDetailsList[indexRandAnime][0]];
                if(allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type === 3) {
                    displayQuestionMessage = ["In what anime is the insert song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                    displayQuestionMessage0 = displayQuestionMessage.toString();
                    displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                    displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                    displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                    sendChatMessage(displayQuestionMessage1);
                    sendChatMessage(displayQuestionMessage2);
                    sendChatMessage(displayQuestionMessage3);
                }
                else {
                    if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 1){
                        displayQuestionMessage = ["In what anime is the 1st "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 2){
                        displayQuestionMessage = ["In what anime is the 2nd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 3){
                        displayQuestionMessage = ["In what anime is the 3rd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                    else {
                        displayQuestionMessage = ["In what anime is the "+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number+"th "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                }
                indexOfRightAnswer = animeEntries.indexOf(allAnimeSongDetailsList[indexRandAnime][0]);
                if (indexOfRightAnswer >-1){
                    animeEntries.splice(indexOfRightAnswer,1);
                }
                choicesAll = shuffle(animeEntries);
                choices = choicesAll.slice(0,3);
                displayChoices = [allAnimeSongDetailsList[indexRandAnime][0], choices[0], choices[1], choices[2]];
                displayChoices = shuffle(displayChoices);
                displayChoicesString0 = displayChoices[0].toString();
                displayChoicesString01 = displayChoicesString0.slice(0,150);
                displayChoicesString02 = displayChoicesString0.slice(150,300);
                displayChoicesString1 = displayChoices[1].toString();
                displayChoicesString11 = displayChoicesString1.slice(0,150);
                displayChoicesString12 = displayChoicesString1.slice(150,300);
                displayChoicesString2 = displayChoices[2].toString();
                displayChoicesString21 = displayChoicesString2.slice(0,150);
                displayChoicesString22 = displayChoicesString2.slice(150,300);
                displayChoicesString3 = displayChoices[3].toString();
                displayChoicesString31 = displayChoicesString3.slice(0,150);
                displayChoicesString32 = displayChoicesString3.slice(150,300);
                setTimeout(function(){
                    sendChatMessage("---------------------------------------------------");
                    sendChatMessage("a) "+displayChoicesString01);
                    sendChatMessage(displayChoicesString02);
                    sendChatMessage("b) "+displayChoicesString11);
                    sendChatMessage(displayChoicesString12);
                    sendChatMessage("c) "+displayChoicesString21);
                    sendChatMessage(displayChoicesString22);
                    sendChatMessage("d) "+displayChoicesString31);
                    sendChatMessage(displayChoicesString32);
                    sendChatMessage("---------------------------------------------------");
                }, 1000);
                letter = displayChoices.indexOf(allAnimeSongDetailsList[indexRandAnime][0]);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 15000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 15000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 15000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 15000);
                        break;
                }
                //animeEntries.splice(-1,1,answer[questionNumber]);
                setTimeout(function() {
                    if (listRightPlayers.length === 0) {
                        sendChatMessage("Nobody got it right or sent it to me in DM, you suck pepega.");
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
                        let displayCongratMessage0 = displayCongratMessage.toString();
                        let displayCongratMessage1 = displayCongratMessage0.slice(0,150);
                        let displayCongratMessage2 = displayCongratMessage0.slice(150,300);
                        let displayCongratMessage3 = displayCongratMessage0.slice(300,450);
                        sendChatMessage(displayCongratMessage1);
                        sendChatMessage(displayCongratMessage2);
                        sendChatMessage(displayCongratMessage3);
                        listRightPlayers = [];
                        listPlayers = [];
                        inQuestion = false;
                    }
                }, 15000);
                break;
            case 1:
                gameAnswer = [allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title];
                if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type === 3) {
                    displayQuestionMessage = ["What is the name of the insert song appearing in\" "+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                    displayQuestionMessage0 = displayQuestionMessage.toString();
                    displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                    displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                    displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                    sendChatMessage(displayQuestionMessage1);
                    sendChatMessage(displayQuestionMessage2);
                    sendChatMessage(displayQuestionMessage3);
                }
                else {
                    if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 1){
                        displayQuestionMessage = ["What is the name of the 1st "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song appearing in the anime \""+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 2) {
                        displayQuestionMessage = ["What is the name of the 2nd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song appearing in the anime \""+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 3) {
                        displayQuestionMessage = ["What is the name of the 3rd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song appearing in the anime \""+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                    else {
                        displayQuestionMessage = ["What is the name of the "+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number+"th "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song appearing in the anime \""+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                }
                indexOfRightAnswer = songNames.indexOf(allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title);
                if (indexOfRightAnswer >-1){
                    songNames.splice(indexOfRightAnswer,1);
                }
                choicesAll = shuffle(songNames);
                choices = choicesAll.slice(0,3);
                displayChoices = [allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title, choices[0], choices[1], choices[2]];
                displayChoices = shuffle(displayChoices);
                displayChoicesString0 = displayChoices[0].toString();
                displayChoicesString01 = displayChoicesString0.slice(0,150);
                displayChoicesString02 = displayChoicesString0.slice(150,300);
                displayChoicesString1 = displayChoices[1].toString();
                displayChoicesString11 = displayChoicesString1.slice(0,150);
                displayChoicesString12 = displayChoicesString1.slice(150,300);
                displayChoicesString2 = displayChoices[2].toString();
                displayChoicesString21 = displayChoicesString2.slice(0,150);
                displayChoicesString22 = displayChoicesString2.slice(150,300);
                displayChoicesString3 = displayChoices[3].toString();
                displayChoicesString31 = displayChoicesString3.slice(0,150);
                displayChoicesString32 = displayChoicesString3.slice(150,300);
                setTimeout(function(){
                    sendChatMessage("---------------------------------------------------");
                    sendChatMessage("a) "+displayChoicesString01);
                    sendChatMessage(displayChoicesString02);
                    sendChatMessage("b) "+displayChoicesString11);
                    sendChatMessage(displayChoicesString12);
                    sendChatMessage("c) "+displayChoicesString21);
                    sendChatMessage(displayChoicesString22);
                    sendChatMessage("d) "+displayChoicesString31);
                    sendChatMessage(displayChoicesString32);
                    sendChatMessage("---------------------------------------------------");
                }, 1000);
                letter = displayChoices.indexOf(allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 15000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 15000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 15000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 15000);
                        break;
                }
                //songNames.splice(-1,1,answer[questionNumber]);
                setTimeout(function() {
                    if (listRightPlayers.length === 0) {
                        sendChatMessage("Nobody got it right or sent it to me on DM, you suck pepega.");
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
                        let displayCongratMessage0 = displayCongratMessage.toString();
                        let displayCongratMessage1 = displayCongratMessage0.slice(0,150);
                        let displayCongratMessage2 = displayCongratMessage0.slice(150,300);
                        let displayCongratMessage3 = displayCongratMessage0.slice(300,450);
                        sendChatMessage(displayCongratMessage1);
                        sendChatMessage(displayCongratMessage2);
                        sendChatMessage(displayCongratMessage3);
                        listRightPlayers = [];
                        listPlayers = [];
                        inQuestion = false;
                    }
                }, 15000);
                break;
            case 2:
                gameAnswer = [allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist];
                if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type === 3) {
                    displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the insert song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                    displayQuestionMessage0 = displayQuestionMessage.toString();
                    displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                    displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                    displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                    sendChatMessage(displayQuestionMessage1);
                    sendChatMessage(displayQuestionMessage2);
                    sendChatMessage(displayQuestionMessage3);
                }
                else {
                    if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 1){
                        displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the 1st "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 2) {
                        displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the 2nd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 3) {
                        displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the 3rd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                    else {
                        displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the "+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number+"th "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                        displayQuestionMessage0 = displayQuestionMessage.toString();
                        displayQuestionMessage1 = displayQuestionMessage0.slice(0,150);
                        displayQuestionMessage2 = displayQuestionMessage0.slice(150,300);
                        displayQuestionMessage3 = displayQuestionMessage0.slice(300,450);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                        sendChatMessage(displayQuestionMessage3);
                    }
                }
                indexOfRightAnswer = artists.indexOf(allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist);
                if (indexOfRightAnswer >-1){
                    artists.splice(indexOfRightAnswer,1);
                }
                choicesAll = shuffle(artists);
                choices = choicesAll.slice(0,3);
                displayChoices = [allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist, choices[0], choices[1], choices[2]];
                displayChoices = shuffle(displayChoices);
                displayChoicesString0 = displayChoices[0].toString();
                displayChoicesString01 = displayChoicesString0.slice(0,150);
                displayChoicesString02 = displayChoicesString0.slice(150,300);
                displayChoicesString1 = displayChoices[1].toString();
                displayChoicesString11 = displayChoicesString1.slice(0,150);
                displayChoicesString12 = displayChoicesString1.slice(150,300);
                displayChoicesString2 = displayChoices[2].toString();
                displayChoicesString21 = displayChoicesString2.slice(0,150);
                displayChoicesString22 = displayChoicesString2.slice(150,300);
                displayChoicesString3 = displayChoices[3].toString();
                displayChoicesString31 = displayChoicesString3.slice(0,150);
                displayChoicesString32 = displayChoicesString3.slice(150,300);
                setTimeout(function(){
                    sendChatMessage("---------------------------------------------------");
                    sendChatMessage("a) "+displayChoicesString01);
                    sendChatMessage(displayChoicesString02);
                    sendChatMessage("b) "+displayChoicesString11);
                    sendChatMessage(displayChoicesString12);
                    sendChatMessage("c) "+displayChoicesString21);
                    sendChatMessage(displayChoicesString22);
                    sendChatMessage("d) "+displayChoicesString31);
                    sendChatMessage(displayChoicesString32);
                    sendChatMessage("---------------------------------------------------");
                }, 1000);
                letter = displayChoices.indexOf(allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist);
                switch(letter){
                    case 0:
                        gameAnswer = "a";
                        setTimeout(function(){ sendChatMessage("Answer is a)"); }, 15000);
                        break;
                    case 1:
                        gameAnswer = "b";
                        setTimeout(function(){ sendChatMessage("Answer is b)"); }, 15000);
                        break;
                    case 2:
                        gameAnswer = "c";
                        setTimeout(function(){ sendChatMessage("Answer is c)"); }, 15000);
                        break;
                    case 3:
                        gameAnswer = "d";
                        setTimeout(function(){ sendChatMessage("Answer is d)"); }, 15000);
                        break;
                }
                //artists.splice(-1,1,answer[questionNumber]);
                setTimeout(function() {
                    if (listRightPlayers.length === 0) {
                        sendChatMessage("Nobody got it right or sent it to me on DM, you suck pepega.");
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
                        let displayCongratMessage0 = displayCongratMessage.toString();
                        let displayCongratMessage1 = displayCongratMessage0.slice(0,150);
                        let displayCongratMessage2 = displayCongratMessage0.slice(150,300);
                        let displayCongratMessage3 = displayCongratMessage0.slice(300,450);
                        sendChatMessage(displayCongratMessage1);
                        sendChatMessage(displayCongratMessage2);
                        sendChatMessage(displayCongratMessage3);
                        listRightPlayers = [];
                        listPlayers = [];
                        inQuestion = false;
                    }
                }, 15000);
                break;
        }
        setTimeout(function(){ sendChatMessage("5..."); }, 10000);
        setTimeout(function(){ sendChatMessage("4..."); }, 11000);
        setTimeout(function(){ sendChatMessage("3..."); }, 12000);
        setTimeout(function(){ sendChatMessage("2..."); }, 13000);
        setTimeout(function(){ sendChatMessage("1..."); }, 14000);
        console.log(gameAnswer);
    }
});
commandListener.bindListener();





function songDetailsListFrom(animeEntry) {

    let expandLibrarySongList = animeEntry.songs
    var animeSongDetailsList = []

    for (var expandLibrarySong of expandLibrarySongList) {

        let songDetails = songDetailsWithMp3From(expandLibrarySong)

        songDetails.anime = animeEntry.name
        animeSongDetailsList.push(songDetails)
    }

    return animeSongDetailsList
}


function songDetailsWithMp3From(expandLibrarySong) {

    var songDetails = {
        title: expandLibrarySong.name,
        artist: expandLibrarySong.artist,
        mp3Link: expandLibrarySong.examples.mp3,
        type: expandLibrarySong.type,
        number: expandLibrarySong.number
    }

    return songDetails
}

//What happens when you type an answer
let listRightPlayers = [];
let listPlayers = [];
let playerAnswer = [];
let answerListener = new Listener("chat message", function (payload) {
    if ((payload.message == "a") || (payload.message == "b") || (payload.message == "c") || (payload.message == "d")){
        playerAnswer = [payload.sender, payload.message];
        //console.log(message[1]);
        if (inQuestion === true){
            if (listPlayers.includes(playerAnswer[0]) === true) {
                sendChatMessage(playerAnswer[0]+", you have already answered once.")
            }
            if (listPlayers.includes(playerAnswer[0]) === false){
                if (payload.message === gameAnswer){
                    //sendChatMessage(playerAnswer[0]+" got it right.");
                    listRightPlayers.push(playerAnswer[0]);
                    listPlayers.push(playerAnswer[0]);
                }
                else {
                    //sendChatMessage(playerAnswer[0]+", nope.");
                    listPlayers.push(playerAnswer[0]);
                }
            }
        }
        if (inQuestion === false) {
            sendChatMessage(playerAnswer[0]+ ", time is over.");
        }
    }
});
answerListener.bindListener();



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











//Send Chat Message
function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
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
