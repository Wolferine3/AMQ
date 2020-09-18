// ==UserScript==
// @name         Among Us
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Automated version of AMQ Among Us Mode
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==


let players = [];
let impostors = [];
let crewmates = [];

let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.message.startsWith("/help")) {
        sendChatMessage("Pastebin for Among Us Mode: https://pastebin.com/dBJLELbc");
        sendChatMessage("Commands:");
        sendChatMessage("To pause the game: /pause");
        sendChatMessage("To vote a player out: /vote [player]");
        sendChatMessage("To skip voting: /skip");
        sendChatMessage("For impostors only: /kill [player]");
    }
    if (payload.message.startsWith("/playwith") && payload.sender === selfName) {
        let message = payload.message.split(" ");
        let numberOfImpostors = message[1];

        players = [];
        impostors = [];
        crewmates = [];
        for (let playerId in lobby.players) {
            players.push(lobby.players[playerId]._name);
            crewmates.push(lobby.players[playerId]._name);
        }
        impostors = getRandom(players, numberOfImpostors);

        let positionOfImpostors = [];

        //Finding the indexes of impostors
        for (let j = 0; j < numberOfImpostors; j++) {
            for (let i = 0; i < players.length; i++) {
                var indexOfImpostors = players[i].indexOf(impostors[j]);
                if (indexOfImpostors > -1) {
                    positionOfImpostors.push(i);
                }
            }
        }
        //sort elements in ascending order
        positionOfImpostors.sort(function(a, b){return a-b});
        for (let i = positionOfImpostors.length -1; i >= 0; i--)
            crewmates.splice(positionOfImpostors[i],1);

        let timeout = 0;
        for (let i = 0; i < impostors.length; i++) {
            setTimeout(function(){ sendDMMessage("You are an Impostor.", impostors[i]); }, timeout);
            timeout = timeout + 1000;
        }
        for (let i = 0; i < crewmates.length; i++) {
            setTimeout(function(){ sendDMMessage("You are a Crewmate.", crewmates[i]); }, timeout);
            timeout = timeout + 1000;
        }
    }
});

commandListener.bindListener();


let votes = [];
let playerVote = [];
let listPlayerVote = [];
let inVotePhase = false;
let dmListener = new Listener("chat message", function (payload) {
    if (payload.message.startsWith("/pause")){
        sendChatMessage(payload.sender + " has requested an emergency meeting!");
        socket.sendCommand({
            type: "quiz",
            command: "quiz pause",
        });
        sendChatMessage("You have 1 minute to vote a player out or skip voting.")
        inVotePhase = true;
        numberOfVotes = [];
        setTimeout(function() {sendChatMessage("30s...")}, 30000);
        setTimeout(function() {sendChatMessage("10s...")}, 50000);
        setTimeout(function() {sendChatMessage("3")}, 57000);
        setTimeout(function() {sendChatMessage("2")}, 58000);
        setTimeout(function() {sendChatMessage("1")}, 59000);
        setTimeout(function() {votePhaseOver()}, 60000);
    }


    if (payload.message.startsWith("/vote") || payload.message.startsWith("/skip")) {
        let message = payload.message.split(" ");
        if (payload.message.startsWith("/vote")) {
            playerVote = message[1];
        }
        if (payload.message.startsWith("/skip")) {
            playerVote = "skip";
        }

        if (inVotePhase === true) {
            if (listPlayerVote.includes(payload.sender) === true) {
                sendDMMessage("You already voted once.", payload.sender);
            }
            if (listPlayerVote.includes(payload.sender) === false) {
                votes.push(playerVote);
                listPlayerVote.push(payload.sender);
            }
        }
        if (inVotePhase === false) {
            sendDMMessage("Voting time is over.", payload.sender);
        }
    }

    if (payload.message.startsWith("/kill")) {
        let message = payload.message.split(" ");
        let target = message[1];
        if (impostors.includes(payload.sender)) {
            sendDMMessage("You have been killed by " + payload.sender + ".", target);
            setTimeout(function() {sendDMMessage("Please go to spec at the beginning of song " + (parseInt($("#qpCurrentSongCount").text())+1).toString(), target)}, 1000);
        }
        if (crewmates.includes(payload.sender)) {
            sendDMMessage("You can't use that command, you are not an Impostor.", payload.sender);
        }
    }

});
dmListener.bindListener();





let numberOfVotes = [];
function votePhaseOver() {
    inVotePhase = false;
    listPlayerVote = [];

    for (let i = 0; i < votes.length; i++) {
        numberOfVotes[votes[i]] = numberOfVotes[votes[i]] ? numberOfVotes[votes[i]] + 1 : 1;
    }


    const unique = (value, index, self) => {
        return self.indexOf(value) === index
    }
    let playersBeenVoted = votes.filter(unique);
    let listOfVotes = [];
    for (let i = 0; i < size(numberOfVotes); i++) {
        sendChatMessage(playersBeenVoted[i] + ": " + numberOfVotes[playersBeenVoted[i]] + " votes.");
        listOfVotes.push(numberOfVotes[playersBeenVoted[i]]);
    }

    let max = 0;
    for (let i =0; i < listOfVotes.length; i++) {
        if (listOfVotes[i] > max) {
            max = listOfVotes[i];
        }
    }

    let indexOfMax = [];
    let idx = listOfVotes.indexOf(max);
    while (idx != -1) {
        indexOfMax.push(idx);
        idx = listOfVotes.indexOf(max, idx + 1);
    }


    console.log(max);
    console.log(indexOfMax);
    console.log(indexOfMax[0]);
    console.log(indexOfMax.length);
    //What happens after the vote results
    if (indexOfMax.length > 1) {
        sendChatMessage("Nobody was ejected (tie).");
        socket.sendCommand({
            type: "quiz",
            command: "quiz unpause",
        });
    }
    else {
        if (playersBeenVoted[indexOfMax[0]] === numberOfVotes.skip) {
            sendChatMessage("Nobody was ejected (skip)");
        }
        else {
            if (impostors.includes(playersBeenVoted[indexOfMax[0]])) {
                sendChatMessage("@"+playersBeenVoted[indexOfMax[0]] + " was an Impostor.");
                sendChatMessage("Please go to spec immediately.");
                setTimeout(function() {socket.sendCommand({
                    type: "quiz",
                    command: "quiz unpause",
                })}, 3000);
            }
            if (crewmates.includes(playersBeenVoted[indexOfMax[0]])) {
                sendChatMessage("@"+playersBeenVoted[indexOfMax[0]] + " was not an Impostor.");
                sendChatMessage("Please go to spec immediately.");
                setTimeout(function() {socket.sendCommand({
                    type: "quiz",
                    command: "quiz unpause",
                })}, 3000);
            }
        }
    }
}


let scores = [];
let sumOfScores = [];
let resultListener = new Listener("answer results", function (result) {
    scores = [];
    sumOfScores = [];
    setTimeout(function() {answerResultsListenerAction(result)}, 1000);
    setTimeout(function() {console.log(scores)}, 1000);
    setTimeout(function() {console.log(sumOfScores)}, 1000);
});
resultListener.bindListener();




function answerResultsListenerAction(result) {
    let idOfPlayers = [];
    for (let playerID in quiz.players) {
        idOfPlayers.push(playerID);
    };
    for (let i = 0; i < size(quiz.scoreboard.playerEntries); i++) {
        scores.push(quiz.scoreboard.playerEntries[idOfPlayers[i]].$score[0].innerText);
    };

    for (let i = 0; i < scores.length; i++) {
        scores[i] = parseInt(scores[i]);
    };
    sumOfScores = sum(scores);

    if (sumOfScores < (50/8)){
        sendChatMessage("Progress:");
        sendChatMessage("⬜⬜⬜⬜⬜⬜⬜⬜");
    }
    else if ((sumOfScores >= (50/8)) && (sumOfScores < (2*50/8))){
        sendChatMessage("Progress:");
        sendChatMessage("🟩⬜⬜⬜⬜⬜⬜⬜");
    }
    else if ((sumOfScores >= (2*50/8)) && (sumOfScores < (3*50/8))){
        sendChatMessage("Progress:");
        sendChatMessage("🟩🟩⬜⬜⬜⬜⬜⬜");
    }
    else if ((sumOfScores >= (3*50/8)) && (sumOfScores < (4*50/8))){
        sendChatMessage("Progress:");
        sendChatMessage("🟩🟩🟩⬜⬜⬜⬜⬜");
    }
    else if ((sumOfScores >= (4*50/8)) && (sumOfScores < (5*50/8))){
        sendChatMessage("Progress:");
        sendChatMessage("🟩🟩🟩🟩⬜⬜⬜⬜");
    }
    else if ((sumOfScores >= (5*50/8)) && (sumOfScores < (6*50/8))){
        sendChatMessage("Progress:");
        sendChatMessage("🟩🟩🟩🟩🟩⬜⬜⬜");
    }
    else if ((sumOfScores >= (6*50/8)) && (sumOfScores < (7*50/8))){
        sendChatMessage("Progress:");
        sendChatMessage("🟩🟩🟩🟩🟩🟩⬜⬜");
    }
    else if ((sumOfScores >= (7*50/8)) && (sumOfScores < (8*50/8))){
        sendChatMessage("Progress:");
        sendChatMessage("🟩🟩🟩🟩🟩🟩🟩⬜");
    }
    else {
        sendChatMessage("Progress:");
        sendChatMessage("🟩🟩🟩🟩🟩🟩🟩🟩");
    }
};







//get n random elements from an array
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
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