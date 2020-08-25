// ==UserScript==
// @name         Expand Library Radio
// @match        https://animemusicquiz.com/
// @match        https://animemusicquiz.com/?forceLogin=True
// ==/UserScript==

(function() {

    if (document.getElementById('startPage')) {
        return
    }

    addAnimationStyle()
    addExpandRadioButton()
    addRadioOverlay()
    createRadioSettings()
    loadExpandLibrary()
})();


var allAnimeSongDetailsList
var isFirstTimeLaunch = true
var shouldAutoplayAfterLoading = shouldAutoplayOnLaunch()

var playHistory
var playHistoryIndex

var filterOpening=getCookie("radioFilterOpening",true)
var filterEnding=getCookie("radioFilterEnding",true)
var filterInsert=getCookie("radioFilterInsert",true)

var animeList

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

		animeList=payload.questions
        updateAllAnimeSongDetailsListUsing()
    }).bindListener()

    socket.sendCommand({
        type: "library",
        command: "expandLibrary questions"
    })
}

function updateAllAnimeSongDetailsListUsing() {

    allAnimeSongDetailsList = []
    playHistory = []
    playHistoryIndex = -1

    for (var anime of animeList) {
        let songDetailsList = songDetailsListFrom(anime)
        allAnimeSongDetailsList = allAnimeSongDetailsList.concat(songDetailsList)
    }

    if (isFirstTimeLaunch) {
        queueRandomSong()
        isFirstTimeLaunch = false
    }

    if (shouldAutoplayAfterLoading) {
        pauseOrPlay()
        shouldAutoplayAfterLoading = false
    }
}

function songDetailsListFrom(animeEntry) {

    let expandLibrarySongList = animeEntry.songs
    var animeSongDetailsList = []

    for (var expandLibrarySong of expandLibrarySongList) {
        if (expandLibrarySong.examples.mp3 == null) continue
	    if(expandLibrarySong.type==1 && !filterOpening) continue
		if(expandLibrarySong.type==2 && !filterEnding) continue
		if(expandLibrarySong.type==3 && !filterInsert) continue

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




function addExpandRadioButton() {
    var openRadioButton = document.createElement("div")
    openRadioButton.id = "openRadioButton"
    openRadioButton.className = "button"
    openRadioButton.style.width = "12px"
    openRadioButton.style.height = "52px"
    openRadioButton.style.background = "#424242"
    openRadioButton.style.boxShadow = "0 0 10px 2px rgb(0, 0, 0)"
    openRadioButton.style.position = "absolute"
    openRadioButton.style.top = "5%"
    openRadioButton.onclick = expandRadioOverlay
    openRadioButton.onwheel=volumeControl

    var openRadioButtonIcon = document.createElement("div")
    openRadioButtonIcon.innerHTML = "▶"
    openRadioButtonIcon.style.color = "#d9d9d9"
    openRadioButtonIcon.style.position = "absolute"
    openRadioButtonIcon.style.top = "16px"
    openRadioButton.append(openRadioButtonIcon)

    document.body.append(openRadioButton)
}

function addAnimationStyle() {

    var scrollingAnimationStyle = document.createElement("style")
    scrollingAnimationStyle.innerHTML =`
@-moz-keyframes songTitleScroll {
0%   { -moz-transform: translateX(150px); }
100% { -moz-transform: translateX(-100%); }
}
@-webkit-keyframes songTitleScroll {
0%   { -webkit-transform: translateX(150px); }
100% { -webkit-transform: translateX(-100%); }
}
@keyframes songTitleScroll {
0%   {
-moz-transform: translateX(150px);
-webkit-transform: translateX(150px);
transform: translateX(150px);
}
100% {
-moz-transform: translateX(-100%);
-webkit-transform: translateX(-100%);
transform: translateX(-100%);
}
}`
    document.head.append(scrollingAnimationStyle)
}

function addRadioOverlay() {

    var radioOverlay = document.createElement("div")
    radioOverlay.id = "radioOverlay"
    radioOverlay.style.width = "150px"
    radioOverlay.style.height = "52px"
    radioOverlay.style.background = "#424242"
    radioOverlay.style.boxShadow = "0 0 10px 2px rgb(0, 0, 0)"
    radioOverlay.style.position = "absolute"
    radioOverlay.style.top = "5%"
    radioOverlay.style.visibility = "hidden"
	radioOverlay.onwheel=volumeControl

    radioOverlay.append(createPlayerTitle())
    radioOverlay.append(createSongInformationLabel())
    radioOverlay.append(createPlayerButtons())
    radioOverlay.append(createCollapseButton())
    radioOverlay.append(createSettingsButton())
    radioOverlay.append(createRadioPlayer())

    document.body.append(radioOverlay)
}

function createPlayerTitle() {
    var playerTitleLabel = document.createElement("div")
    playerTitleLabel.style.color = "#d9d9d9"
    playerTitleLabel.style.textAlign = "center"
    playerTitleLabel.innerHTML = "Now Playing"

    return playerTitleLabel
}

function createSongInformationLabel() {

    var songInformationLabelWrapper = document.createElement("div")
    songInformationLabelWrapper.id = "radioSongInformationWrapper"
    songInformationLabelWrapper.className = "radioSongInformationWrapper"
    songInformationLabelWrapper.style.width = "90%"
    songInformationLabelWrapper.style.left = "5%"
    songInformationLabelWrapper.style.position = "relative"
    songInformationLabelWrapper.style.overflow = "hidden"

    songInformationLabelWrapper.setAttribute("data-toggle", "popover")
    songInformationLabelWrapper.setAttribute("data-trigger", "hover")
    songInformationLabelWrapper.setAttribute("data-content", "")
    songInformationLabelWrapper.setAttribute("data-placement", "right")
    songInformationLabelWrapper.setAttribute("data-container", "body")

    var songInformationLabel = document.createElement("div")
    songInformationLabel.id = "radioSongInformationLabel"
    songInformationLabelWrapper.className = "radioSongInformationLabel"
    songInformationLabel.style.color = "#d9d9d9"
    songInformationLabel.style.whiteSpace = "nowrap"
    songInformationLabel.style.fontSize = "10px"
    songInformationLabel.style.width = "fit-content"
    songInformationLabel.style.transform = "translateX(100%)"
    songInformationLabel.style.animation = "songTitleScroll 15s linear infinite"

    songInformationLabel.innerHTML = "Loading"
    songInformationLabelWrapper.append(songInformationLabel)

    return songInformationLabelWrapper
}

function createPlayerButtons() {

    var buttonRow = document.createElement("div")
    buttonRow.id = "radioButtonRow"
    buttonRow.style.textAlign = "center"

    var prevSongButton = document.createElement("div")
    prevSongButton.id = "radioPrevSongButton"
    prevSongButton.className = "button"
    prevSongButton.style.width = "15px"
    prevSongButton.style.paddingRight = "5px"
    prevSongButton.style.display = "inline"
    prevSongButton.onclick = playPrevSong

    var prevSongButtonIcon = document.createElement("i")
    prevSongButtonIcon.className = "fa fa-fast-backward"
    prevSongButtonIcon.style.color = "#d9d9d9"
    prevSongButtonIcon.style.fontSize = "17px"
    prevSongButtonIcon.style.verticalAlign = "top"

    prevSongButton.append(prevSongButtonIcon)
    buttonRow.append(prevSongButton)

    var playButton = document.createElement("div")
    playButton.id = "radioPlayButton"
    playButton.className = "button"
    playButton.style.width = "15px"
    playButton.style.paddingRight = "5px"
    playButton.style.display = "inline"
    playButton.onclick = pauseOrPlay

    var playButtonIcon = document.createElement("i")
    playButtonIcon.className = "fa fa-play"
    playButtonIcon.style.color = "#d9d9d9"
    playButtonIcon.style.fontSize = "15px"
    playButtonIcon.style.verticalAlign = "text-top"

    playButton.append(playButtonIcon)
    buttonRow.append(playButton)

    var nextSongButton = document.createElement("div")
    nextSongButton.id = "radioPlayButton"
    nextSongButton.className = "button"
    nextSongButton.style.width = "15px"
    nextSongButton.style.display = "inline-block"
    nextSongButton.onclick = playRandomSong

    var nextSongButtonIcon = document.createElement("i")
    nextSongButtonIcon.className = "fa fa-fast-forward"
    nextSongButtonIcon.style.color = "#d9d9d9"
    nextSongButtonIcon.style.fontSize = "17px"
    nextSongButtonIcon.style.verticalAlign = "top"

    nextSongButton.append(nextSongButtonIcon)
    buttonRow.append(nextSongButton)

    return buttonRow
}

function createCollapseButton() {
    var collapseButton = document.createElement("div")
    collapseButton.className = "button"
    collapseButton.style.position = "absolute"
    collapseButton.style.right = "5px"
    collapseButton.style.top = "0px"
    collapseButton.innerHTML = "✖"
    collapseButton.onclick = collapseRadioOverlay

    return collapseButton
}

function createSettingsButton() {
    var settingsButton = document.createElement("div")
    settingsButton.className = "button"
    settingsButton.style.position = "absolute"
    settingsButton.style.right = "3px"
    settingsButton.style.bottom = "0px"

    var settingsButtonIcon = document.createElement("i")
    settingsButtonIcon.className = "fa fa-cog"
    settingsButtonIcon.style.color = "#d9d9d9"
    settingsButtonIcon.style.fontSize = "17px"
    settingsButtonIcon.style.verticalAlign = "top"

    settingsButton.append(settingsButtonIcon)
    settingsButton.onclick = openRadioSettings

    return settingsButton
}

function createRadioPlayer() {
    var radioPlayer = document.createElement("audio")
    radioPlayer.id = "radioPlayer"
    radioPlayer.onended = playRandomSong
    radioPlayer.onplaying = showPauseButton
    radioPlayer.onpause = showPlayButton

    return radioPlayer
}



function expandRadioOverlay() {
    var radioOverlay = document.getElementById('radioOverlay')
    radioOverlay.style.visibility = "visible"

    var openRadioButton = document.getElementById('openRadioButton')
    openRadioButton.style.visibility = "hidden"
}

function collapseRadioOverlay() {
    var radioOverlay = document.getElementById('radioOverlay')
    radioOverlay.style.visibility = "hidden"

    var openRadioButton = document.getElementById('openRadioButton')
    openRadioButton.style.visibility = "visible"
}

function playRandomSong() {
	playHistoryIndex++
	if(playHistoryIndex>=playHistory.length) {
		playHistory.push(randomSongIndex(allAnimeSongDetailsList.length))
	}
    play(allAnimeSongDetailsList[playHistory[playHistoryIndex]])
}

function queueRandomSong() {
	playHistoryIndex++
	if(playHistoryIndex>=playHistory.length) {
		playHistory.push(randomSongIndex(allAnimeSongDetailsList.length))
	}
    queue(allAnimeSongDetailsList[playHistory[playHistoryIndex]])
}

function playPrevSong() {
	if(playHistoryIndex < 0) return;
	let radioPlayer = document.getElementById('radioPlayer')
	if(radioPlayer.currentTime<1) {
		if(playHistoryIndex==0) return;
		playHistoryIndex--
	}
    play(allAnimeSongDetailsList[playHistory[playHistoryIndex]])
}

function showPauseButton() {
    var radioPlayerPlayButtonIcon = document.getElementById('radioPlayButton').children[0]
    radioPlayerPlayButtonIcon.className = "fa fa-pause"
}

function showPlayButton() {
    var radioPlayerPlayButtonIcon = document.getElementById('radioPlayButton').children[0]
    radioPlayerPlayButtonIcon.className = "fa fa-play"
}

function pauseOrPlay() {
    let radioPlayer = document.getElementById('radioPlayer')

    if (radioPlayer.paused) {
        radioPlayer.play()
    } else {
        radioPlayer.pause()
    }
}

function randomSongIndex(songCount) {
    return Math.floor(Math.random() * (songCount))
}

function play(song) {

    var radioPlayer = document.getElementById('radioPlayer')
    queue(song)
    radioPlayer.play()
}

var songtype=["Opening","Ending","Insert"]

function queue(song) {
    var radioPlayer = document.getElementById('radioPlayer')
    radioPlayer.src = song.mp3Link

    var songInformationLabel = document.getElementById('radioSongInformationLabel')
    songInformationLabel.innerHTML = song.title + " by " + song.artist

    var popoverElement = document.getElementById('radioSongInformationWrapper')
    popoverElement.setAttribute("data-content", song.anime+" - "+songtype[song.type-1]+" "+(song.type<3?song.number:""))
}

function volumeControl(event) {
	let radioPlayer = document.getElementById('radioPlayer');
	var volumetemp=radioPlayer.volume;
	if(event.deltaY<0)
		volumetemp+=.1;
	else
		volumetemp-=.1;
	radioPlayer.volume=Math.min(Math.max(volumetemp, 0), 1)
}




function createRadioSettings() {
    createRadioSettingsWindow()
    createRadioSettingBackdrop()
}

function createRadioSettingBackdrop() {
    var settingsBackdropFade = document.createElement("div")
    settingsBackdropFade.id = "radioSettingsBackdrop"
    settingsBackdropFade.className = "modal-backdrop fade"
    settingsBackdropFade.style.display = "none"
    document.body.append(settingsBackdropFade)
}

function createRadioSettingsWindow() {

    var radioSettingsWindow = document.createElement("div")
    radioSettingsWindow.className = "modal fade"
    radioSettingsWindow.id = "radioSettingsModal"
    radioSettingsWindow.tabindex = "-1"
    radioSettingsWindow.role = "dialog"
    radioSettingsWindow.style.display = "none"

    var radioSettingsWindowDialog = document.createElement("div")
    radioSettingsWindowDialog.className = "modal-dialog"
    radioSettingsWindowDialog.role = "document"
    radioSettingsWindowDialog.style.width = "300px"

    var radioSettingsWindowContent = document.createElement("div")
    radioSettingsWindowContent.className = "modal-content"
    radioSettingsWindowContent.append(createRadioSettingsHeader())
    radioSettingsWindowContent.append(createRadioSettingsBody())

    radioSettingsWindowDialog.append(radioSettingsWindowContent)
    radioSettingsWindow.append(radioSettingsWindowDialog)
    document.body.append(radioSettingsWindow)
}

function createRadioSettingsHeader() {
    var header = document.createElement("div")
    header.className = "modal-header"

    var headerCloseButton = document.createElement("button")
    headerCloseButton.className = "close"
    headerCloseButton.onclick = closeRadioSettings

    var headerCloseButtonIcon = document.createElement("span")
    headerCloseButtonIcon.innerHTML = "×"
    headerCloseButton.append(headerCloseButtonIcon)
    header.append(headerCloseButton)

    var headerTitle = document.createElement("h2")
    headerTitle.className = "modal-title"
    headerTitle.innerHTML = "Radio Settings"
    header.append(headerTitle)

    return header
}

function createRadioSettingsBody() {
    var settingsBody = document.createElement("div")
    settingsBody.className = "modal-body"

    var autoplayOnLaunchSetting = document.createElement("div")
    autoplayOnLaunchSetting.style.display = "inline-flex"

    var autoplayOnLaunchTitle = document.createElement("label")
    autoplayOnLaunchTitle.innerHTML = "Autoplay after loading"
    autoplayOnLaunchTitle.style.paddingRight = "30px"
    autoplayOnLaunchTitle.style.paddingLeft = "30px"
    autoplayOnLaunchSetting.append(autoplayOnLaunchTitle)

    var autoplayOnLaunchCheckboxContainer = document.createElement("div")
    autoplayOnLaunchCheckboxContainer.className = "customCheckbox"

    var autoplayOnLaunchCheckbox = document.createElement("input")
    autoplayOnLaunchCheckbox.type = "checkbox"
    autoplayOnLaunchCheckbox.id = "autoplayOnLaunchCheckbox"
    autoplayOnLaunchCheckbox.checked = shouldAutoplayOnLaunch()
    autoplayOnLaunchCheckbox.onclick = changeAutoplayOnLaunchSetting
    autoplayOnLaunchCheckboxContainer.append(autoplayOnLaunchCheckbox)

    var autoplayOnLaunchCheckedIconLabel = document.createElement("label")
    autoplayOnLaunchCheckedIconLabel.htmlFor = "autoplayOnLaunchCheckbox"

    var autoplayOnLaunchCheckedIcon = document.createElement("i")
    autoplayOnLaunchCheckedIcon.className = "fa fa-check"
    autoplayOnLaunchCheckedIconLabel.append(autoplayOnLaunchCheckedIcon)
    autoplayOnLaunchCheckboxContainer.append(autoplayOnLaunchCheckedIconLabel)
    autoplayOnLaunchSetting.append(autoplayOnLaunchCheckboxContainer)

    settingsBody.append(autoplayOnLaunchSetting)


    settingsBody.append(addCheckbox("filterOpening","OP",getCookie("radioFilterOpening",true),changeFilterOp))
    settingsBody.append(addCheckbox("filterEnding","ED",getCookie("radioFilterEnding",true),changeFilterEd))
    settingsBody.append(addCheckbox("filterInsert","INS",getCookie("radioFilterInsert",true),changeFilterIns))

    return settingsBody
}

function addCheckbox(id, label, value, onclick) {
    var item = document.createElement("div")
    item.style.display = "inline-flex"

    var itemTitle = document.createElement("label")
    itemTitle.innerHTML = label
    itemTitle.style.paddingRight = "5px"
    itemTitle.style.paddingLeft = "25px"
    item.append(itemTitle)

	var checkboxContainer = document.createElement("div")
    checkboxContainer.className = "customCheckbox"

    var checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = id
    checkbox.checked = value
    checkbox.onclick = onclick
    checkboxContainer.append(checkbox)

    var checkedIconLabel = document.createElement("label")
    checkedIconLabel.htmlFor = id

    var checkedIcon = document.createElement("i")
    checkedIcon.className = "fa fa-check"
    checkedIconLabel.append(checkedIcon)
    checkboxContainer.append(checkedIconLabel)

    item.append(checkboxContainer);

	return item
}

function openRadioSettings() {
    var radioSettingsWindow = document.getElementById('radioSettingsModal')
    radioSettingsWindow.style.display = "block"
    setTimeout(function(){ radioSettingsWindow.className = "modal fade in" }, 10)

    var radioSettingsBackdrop = document.getElementById('radioSettingsBackdrop')
    radioSettingsBackdrop.style.display = "block"
    setTimeout(function(){ radioSettingsBackdrop.className = "modal-backdrop fade in" }, 10)
}

function closeRadioSettings() {
    var radioSettingsWindow = document.getElementById('radioSettingsModal')
    radioSettingsWindow.className = "modal fade out"
    setTimeout(function(){ radioSettingsWindow.style.display = "none" }, 500)

    var radioSettingsBackdrop = document.getElementById('radioSettingsBackdrop')
    radioSettingsBackdrop.className = "modal-backdrop fade out"
    setTimeout(function(){ radioSettingsBackdrop.style.display = "none" }, 500)
}

function shouldAutoplayOnLaunch() {
    var cookieKey = "shouldAutoplayOnLaunch"
    var cookieList = document.cookie.split(";")
    var shouldAutoplayOnLaunchCookie = cookieList.find(function(cookie) {
        return cookie.includes(cookieKey)
    })

    if (shouldAutoplayOnLaunchCookie == null) {
        return false
    }

    var cookieValue = shouldAutoplayOnLaunchCookie.substring(cookieKey.length + 2)
    return cookieValue == "true"
}

function changeAutoplayOnLaunchSetting() {
    document.cookie = "shouldAutoplayOnLaunch=" + (!shouldAutoplayOnLaunch()).toString()
}

function changeFilterOp() {
	filterOpening=!filterOpening
	setCookie("radioFilterOpening", filterOpening.toString())
	updateAllAnimeSongDetailsListUsing()
}
function changeFilterEd() {
	filterEnding=!filterEnding
	setCookie("radioFilterEnding", filterEnding.toString())
	updateAllAnimeSongDetailsListUsing()
}
function changeFilterIns() {
	filterInsert=!filterInsert
	setCookie("radioFilterInsert", filterInsert.toString())
	updateAllAnimeSongDetailsListUsing()
}

function getCookie(cookieKey, defaultValue) {
    var cookieList = document.cookie.split(";")
    var tempValue = cookieList.find(function(cookie) {
        return cookie.includes(cookieKey)
    })

    if (tempValue == null) {
        return defaultValue
    }

    var cookieValue = tempValue.substring(cookieKey.length + 2)
    return cookieValue == "true"
}
function setCookie(cookieKey, value) {
	document.cookie = cookieKey+"=" + value.toString()
}