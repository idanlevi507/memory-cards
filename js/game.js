// Those are global variables, they stay alive and reflect the state of the game
let elPreviousCard = null;
let flippedCouplesCount = 0;

let isProcessing = false
let i = 0


let users = null;
let userJson = {};
let numOfUsers = 1;
let playerId = '1';
var playerName = '';

//set stop watch
var milSec = 0;
var sec = 0;
var min = 0;
var looper ;
var isOn = false;
var bestTime = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
const TOTAL_COUPLES_COUNT = 6;

// Load an audio file
const audioWin = new Audio('sound/win.mp3');
const audioWrong = new Audio('sound/wrong.mp3')
const audioRight = new Audio('sound/right.mp3')
initClient() ;

function initClient() {
    //check if player exist
    users = localStorage.getItem('users');
    fastest = localStorage.getItem('best-time');
    playerName = localStorage.getItem ('fastest-name');


    if(users) { // check if we have ever set a player name in local storage 
        userJson = JSON.parse(users);  // convert string to Json
        playerName = userJson['1'].name; // getting the name of my first player
        document.getElementById("timer").innerHTML = 'Your best time: <br> ' + userJson[playerId].bestScore;
        numOfUsers = Object.keys(userJson).length; // getting the number of players 
        document.getElementById('all-best').innerHTML = 'All time best <br> ' +'(' + localStorage.getItem('fastest-name') + ') ' + localStorage.getItem('best-time');
        
    } else {
        document.getElementById('all-best').innerHTML = 'All time best <br> 00:00:00 ';
        playerName = prompt('enter your name');
        userJson = {
            '1': {
                name:  playerName,
                bestScore: '0:0:0'
            }
        };
        localStorage.setItem('users', JSON.stringify(userJson));
        shem = playerName;
    }

    document.getElementById("name").innerHTML = playerName;
    document.getElementById("counter").innerHTML = flippedCouplesCount;

    console.log('playerId1', playerId)
    console.log('userJson1', userJson)

}
// This function is called whenever the user click a card
function cardClicked(elCard) {
    clickStart();

    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }
    if (isProcessing) {
        return;
    }
    // Flip it
    elCard.classList.add('flipped');

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        var card1 = elPreviousCard.getAttribute('data-card');
        var card2 = elCard.getAttribute('data-card');
        isProcessing = true ; 

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2){
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                audioWrong.play();
                isProcessing = false ; 
            }, 1000)

        } else {
            // Yes! a match!

            flippedCouplesCount++;
            document.getElementById("counter").innerHTML = flippedCouplesCount;
            elPreviousCard = null;
            audioRight.play();
            isProcessing = false;

            // All cards flipped!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                stopWatch();
                audioWin.play();
                document.getElementById("kaftor").classList.remove('hide');
                var elBestTime = document.getElementById("timer").innerHTML;  
                if(checkIfNewRecord()) {
                    setNewRecord();
                    alert ('You set a new personal record!');
                    elBestTime = min + ':' + sec + ':' + milSec;
                    if (checkBestTime()) {
                        alert ('you just broke the All-Time-Best record!');
                        localStorage.setItem('best-time' , (min + ':' + sec + ':' + milSec));
                        localStorage.setItem('fastest-name' ,playerName )
                        document.getElementById('all-best').innerHTML = 'All time best: <br> ' +'(' + playerName+ ') ' + localStorage.getItem('best-time');
                    }
                } else {
                    alert ('try again');
                }
            }

        }

    }


}

  
function changePlayer() {
    playerName = prompt('who\'s playing?');
    resetGame();
    resetTimer();
    if(playerName) {
        playerId = getPlayerIdByName(playerName);
        if(!playerId)  {

            numOfUsers++;
            playerId = String(numOfUsers);
            userJson[playerId] = {
                name:  playerName,
                bestScore: '00:00:00'
            }
            localStorage.setItem('users', JSON.stringify(userJson));
        }
        alert(playerName + " selected." ); 
        document.getElementById("name").innerHTML = playerName;
        document.getElementById("timer").innerHTML = 'your best score: <br>' + userJson[playerId].bestScore;
        console.log(userJson);
    }
    
} 

function getPlayerIdByName(playerName) {
    for(var i=1; i<= numOfUsers; i++){
        const key = String(i);
        const user = userJson[key];
        if(user.name == playerName) {
            return key;
        }
    }
    return null;
}

function checkIfNewRecord() {
    const bestScore = userJson[playerId].bestScore;
    let OldScoreArray = bestScore.split(':');

    let oldMin = Number(OldScoreArray[0]) ;
    let oldSec = Number(OldScoreArray[1]);
    let oldMilSec = Number(OldScoreArray[2]) ;
    
    if ((oldMin + oldSec + oldMilSec) === 0) {
        return true ;
    }

    if (oldMin < min) {
        return false
    }  else if (oldMin > min) {
        return true
    }  
    if (oldSec < sec) {
        return false;
    } else if (oldSec > sec) {
        return true;
    }
    if (oldMilSec < milSec) {
        return false;
    } else if (oldMilSec > milSec) {
        
        return true;
    } else {
        alert("you are tied!!");
        return false
    }
}


function checkBestTime() {
    var bestTime = localStorage.getItem('best-time') ; 
    if (!bestTime) { 
        return true}
        else { 
    var bestTimeArray = bestTime.split(':')
    var bestMin = Number(bestTimeArray[0]) ;
    var bestSec = Number(bestTimeArray[1]) ;
    var bestMil = Number(bestTimeArray[2]) ;

    if ((bestMin + bestSec + bestMil) === 0) {
        return true ;}

    if (bestMin < min) {
        return false
    }  else if (bestMin > min) {
        return true
    }  
    if (bestSec < sec) {
        return false;
    } else if (bestSec > sec) {
        return true;
    }
    if (bestMil < milSec) {
        return false;
    }    else if (bestMil > milSec) {
            return true
        } else {
            alert("WOW you are tied(!!) the world record. what are the odds");
            return false
        }

    }

}

function setNewRecord() {
    if (min < 10){
        min = '0' + min.toString()
    }
    if (sec < 10) {
        sec = '0' + sec.toString()
    }

    userJson[playerId].bestScore = (min).toString() + ':' + sec.toString() + ':' + (milSec).toString();
    localStorage.setItem('users', JSON.stringify(userJson));
    document.getElementById("timer").innerHTML = 'your best score: <br>' + userJson[playerId].bestScore;


}

function resetGame() {
    document.getElementById("kaftor").classList.add('hide');
    elPreviousCard = null;
    flippedCouplesCount = 0;
    document.getElementById("counter").innerHTML = flippedCouplesCount;
    var divs = document.querySelectorAll('div');
    for (var i = 0 ; i < divs.length ; ++i) {
        divs[i].classList.remove('flipped');
        resetTimer();
        
    }
}


function shuffle() {
    var board = document.querySelector('.board');
    console.log();
    for (var i=board.children.length; i>=0 ; i--) {
        board.appendChild(board.children[Math.random()*i|0]);
    }

}




function resetTimer() {
    stopWatch();
    shuffle()
    min = 0;
    sec = 0;
    milSec = 0;
    minDisplay = '00';
    secDisplay = '00';
    milSecDisplay = '00';
    document.getElementById("display").innerText = minDisplay + ':' + secDisplay + ':' + milSecDisplay;
}

function startWatch() {
                
    milSec++;
    if (milSec === 99) {
        sec++;
        milSec = 00
        }
    if (sec === 60) {
        min++;
        sec = 00
    }
    
    if (min < 10) {
        minDisplay = '0' + min.toString()
    } else {
        minDisplay = min
    }
    if (sec < 10) {
        secDisplay = '0' + sec.toString()
    } else {
        secDisplay = sec
    }
    
     milSecDisplay = milSec
    

    document.getElementById("display").innerText = minDisplay + ':' + secDisplay + ':' + milSecDisplay;
    
}
    
function clickStart() {
    if (!isOn) {
    looper = setInterval(startWatch,10);
    isOn = true;
    }
    }

function stopWatch() {
        clearInterval(looper);
        isOn = false ;
    }
