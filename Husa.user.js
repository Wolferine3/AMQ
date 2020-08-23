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

let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.sender === selfName && payload.message.startsWith("/husa")) {
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
                    let displayQuestionMessage = ["In what anime is the insert song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                    let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                    let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                    sendChatMessage(displayQuestionMessage1);
                    sendChatMessage(displayQuestionMessage2);
                }
                else {
                    if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 1){
                        let displayQuestionMessage = ["In what anime is the 1st "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 2){
                        let displayQuestionMessage = ["In what anime is the 2nd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 3){
                        let displayQuestionMessage = ["In what anime is the 3rd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                    }
                    else {
                        let displayQuestionMessage = ["In what anime is the "+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number+"th "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
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
                setTimeout(function(){
                    sendChatMessage("---------------------------------------------------");
                    sendChatMessage("a) "+displayChoices[0]);
                    sendChatMessage("b) "+displayChoices[1]);
                    sendChatMessage("c) "+displayChoices[2]);
                    sendChatMessage("d) "+displayChoices[3]);
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
                        sendChatMessage("Nobody got it right or sent it to me in DM using /'letter', you suck pepega.");
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
                }, 15000);
                break;
            case 1:
                gameAnswer = [allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title];
                if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type === 3) {
                    let displayQuestionMessage = ["What is the name of the insert song appearing in\" "+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                    let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                    let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                    sendChatMessage(displayQuestionMessage1);
                    sendChatMessage(displayQuestionMessage2);
                }
                else {
                    if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 1){
                        let displayQuestionMessage = ["What is the name of the 1st "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song appearing in the anime \""+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 2) {
                        let displayQuestionMessage = ["What is the name of the 2nd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song appearing in the anime \""+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 3) {
                        let displayQuestionMessage = ["What is the name of the 3rd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song appearing in the anime \""+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                    }
                    else {
                        let displayQuestionMessage = ["What is the name of the "+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number+"th "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song appearing in the anime \""+allAnimeSongDetailsList[indexRandAnime][0]+"\" from the artist \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
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
                setTimeout(function(){
                    sendChatMessage("---------------------------------------------------");
                    sendChatMessage("a) "+displayChoices[0]);
                    sendChatMessage("b) "+displayChoices[1]);
                    sendChatMessage("c) "+displayChoices[2]);
                    sendChatMessage("d) "+displayChoices[3]);
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
                        sendChatMessage("Nobody got it right or sent it to me on DM using /'letter', you suck pepega.");
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
                }, 15000);
                break;
            case 2:
                gameAnswer = [allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].artist];
                if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type === 3) {
                    let displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the insert song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                    let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                    let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                    sendChatMessage(displayQuestionMessage1);
                    sendChatMessage(displayQuestionMessage2);
                }
                else {
                    if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 1){
                        let displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the 1st "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 2) {
                        let displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the 2nd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                    }
                    else if (allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number === 3) {
                        let displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the 3rd "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
                    }
                    else {
                        let displayQuestionMessage = ["In \""+allAnimeSongDetailsList[indexRandAnime][0]+"\", what is the name of the artist credited in the "+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].number+"th "+songType[allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].type-1]+" song \""+allAnimeSongDetailsList[indexRandAnime][1][indexRandSong].title+"\"?"];
                        let displayQuestionMessage1 = displayQuestionMessage.slice(0,150);
                        let displayQuestionMessage2 = displayQuestionMessage.slice(150,300);
                        sendChatMessage(displayQuestionMessage1);
                        sendChatMessage(displayQuestionMessage2);
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
                setTimeout(function(){
                    sendChatMessage("---------------------------------------------------");
                    sendChatMessage("a) "+displayChoices[0]);
                    sendChatMessage("b) "+displayChoices[1]);
                    sendChatMessage("c) "+displayChoices[2]);
                    sendChatMessage("d) "+displayChoices[3]);
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
                        sendChatMessage("Nobody got it right or sent it to me on DM using /'letter', you suck pepega.");
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
    if ((payload.message.startsWith("/a")) || (payload.message.startsWith("/b")) || (payload.message.startsWith("/c")) || (payload.message.startsWith("/d"))){
        let message = payload.message.split("/");
        playerAnswer = [payload.sender, message[1]];
        //console.log(message[1]);
        if (inQuestion === true){
            if (listPlayers.includes(playerAnswer[0]) === true) {
                sendChatMessage(playerAnswer[0]+", you have already answered once.")
            }
            if (listPlayers.includes(playerAnswer[0]) === false){
                if (message[1] === gameAnswer){
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
