// ==UserScript==
// @name         Among Us
// @namespace    https://github.com/Wolferine3
// @version      1.0.0
// @description  Automated version of AMQ Among Us Mode
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==

/*
    1. reset votes  DONE
    2. randomize killing DONE
    3. cooldown on kills (make it 3 songs for now)
    4. limiter on emergency meetings DONE
    5. unpause button doesn't work?
    6. tell the other imposter who's the other one DONE   <- it doesn't work
    7. announce at the end who wins lol DONE
    8. block the pause while someone already requested one: https://imgur.com/a/wBcCxAa quiz.pausebutton.pauseOn DONE
    9. change all names to lowercases
    10. when vote is the first player of the array, it goes to the skip condition (index problem)
*/

let players = [];
let impostors = [];
let crewmates = [];
let emergencyUsed = [];

let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.message.startsWith("/help")) {
        sendChatMessage("Pastebin for Among Us Mode: https://pastebin.com/dBJLELbc");
        sendChatMessage("Commands:");
        sendChatMessage("To pause the game: /pause");
        sendChatMessage("To vote a player out: /vote [player]");
        sendChatMessage("To skip voting: /skip");
        sendChatMessage("For impostors only: /kill");
    }
    if (payload.message.startsWith("/playwith") && payload.sender === selfName) {
        let message = payload.message.split(" ");
        let numberOfImpostors = message[1];

        players = [];
        impostors = [];
        crewmates = [];
        emergencyUsed = [];
        for (let playerId in lobby.players) {
            players.push(lobby.players[playerId]._name);
            crewmates.push(lobby.players[playerId]._name);
        }

        impostors = getRandom(players, numberOfImpostors);
        impostorsConfirmationMessage = "The impostors are ";
        for (let impostor in impostors){
            impostorsConfirmationMessage += (impostors[impostor] + " ")
        }

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
            setTimeout(function(){ sendDMMessage(impostorsConfirmationMessage, impostors[i]); }, timeout);
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
        if (emergencyUsed.includes(payload.sender)){
            sendDMMessage("You already used your emergency meeting!", payload.sender);
        }
        else if (quiz.pauseButton.pauseOn){
            sendDMMessage("Someone already requested an emergency meeting!", payload.sender);
        }
        else {
            emergencyUsed.push(payload.sender);
            votes = [];
            sendChatMessage(payload.sender + " has requested an emergency meeting!");
            socket.sendCommand({
                type: "quiz",
                command: "quiz pause",
            });
            sendChatMessage("You have 100 seconds to vote a player out or skip voting.")
            inVotePhase = true;
            numberOfVotes = [];
            setTimeout(function() {sendChatMessage("50s...")}, 50000);
            setTimeout(function() {sendChatMessage("30s...")}, 70000);
            setTimeout(function() {sendChatMessage("10s...")}, 90000);
            setTimeout(function() {sendChatMessage("3")}, 97000);
            setTimeout(function() {sendChatMessage("2")}, 98000);
            setTimeout(function() {sendChatMessage("1")}, 99000);
            setTimeout(function() {votePhaseOver()}, 100000);
        }
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
        if (impostors.includes(payload.sender)) {
            let randomCrewmate = getRandomIntInclusive(0,crewmates.length-1);
            let deadmate = crewmates[randomCrewmate]
            setTimeout(function() {sendDMMessage("You have killed " + deadmate + ".", payload.sender)}, 0);
            setTimeout(function() {sendDMMessage("You have been killed by " + payload.sender + ".", deadmate)}, 1000);
            setTimeout(function() {sendDMMessage("Please go to spec at the beginning of song " + (parseInt($("#qpCurrentSongCount").text())+1).toString(), deadmate)}, 2000);
            crewmates.splice(randomCrewmate, randomCrewmate+1);
            if (crewmates.length <= impostors.length){
                sendChatMessage("Game Over, impostors have won.");
            }
        }
        else if (crewmates.includes(payload.sender)) {
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
            sendChatMessage("Nobody was ejected (skip).");
            socket.sendCommand({
                type: "quiz",
                command: "quiz unpause",

            });
        }
        else {
            let playerVoted = playersBeenVoted[indexOfMax[0]];
            if (impostors.includes(playerVoted)) {
                sendChatMessage("@"+ playerVoted + " was an Impostor.");
                sendChatMessage("Please go to spec immediately.");
                setTimeout(function() {socket.sendCommand({
                    type: "quiz",
                    command: "quiz unpause",
                })}, 3000);

                let indexOfVotedPlayer = impostors.indexOf(playerVoted);
                impostors.splice(indexOfVotedPlayer, indexOfVotedPlayer + 1);

                if (impostors.length == 0){
                    sendChatMessage("All impostors have been killed. The crewmates have won!");
                }
            }
            if (crewmates.includes(playersBeenVoted[indexOfMax[0]])) {
                sendChatMessage("@"+playersBeenVoted[indexOfMax[0]] + " was not an Impostor.");
                sendChatMessage("Please go to spec immediately.");
                setTimeout(function() {socket.sendCommand({
                    type: "quiz",
                    command: "quiz unpause",
                })}, 3000);

                let indexOfVotedPlayer = crewmates.indexOf(playerVoted);
                crewmates.splice(indexOfVotedPlayer, indexOfVotedPlayer + 1);

                if (crewmates.length <= impostors.length){
                    sendChatMessage("Game Over, impostors have won.");
                }
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
        sendChatMessage("Crewmates win!");
    }
};


//Randomizer function
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




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
