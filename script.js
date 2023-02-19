//Get username
console.log('siema')
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if(urlParams.get('summoner')===null){
    summoner='hiyoraa'
}
else{
    summoner=urlParams.get('summoner')
    if(summoner=='hiyroaa'){
        document.getElementById('link').href ="?summoner=RågnårLødbrøk"
    }
    else{
        document.getElementById('link').href ="?summoner=hiyoraa"
    }
}
var timezone = 3600000;
var remakeTime = 360000;
var matchesCount = 20;
var matchesInfo = [];
var matchesDetails = [];
var dates = [];
var champions = [];
var queues = [];
var result = [];
var stats = [];
var gameDuration = [];
var winStreak = 0;
var loseStreak = 0;
var match = document.getElementsByClassName('match')
const date = new Date();
const day = date.getDate();
const month = date.getMonth()+1;
const today = "0"+month+"-"+day;
var apiKey = "RGAPI-ef3268fb-feac-4532-9ddf-99adc3f16851";


//Check if we choose summoner




//Check if he win or lose today
checkStreak = () =>{
    for(let i =0; i<matchesCount; i++){
        if(gameDuration[i]>remakeTime){
            if(dates[i].slice(0,5)==today){
                if(queues[i]=='Ranked flex'|| queues[i]=='Ranked solo/duo'){
                    if(result[i]==true){
                        winStreak++;
                    }
                    else{
                        loseStreak++;
                    }
                }
            }
        }
    }
    var winratio = Math.floor(winStreak/(winStreak+loseStreak)*100);
    document.getElementById('streak').innerHTML = "Dziś już: "+winStreak+" win/ "+loseStreak+ " lose";
    if(isNaN(winratio)){
        document.getElementById('winratio').innerHTML = "Nie rozegrano rankedów";
    }
    else{
        document.getElementById('winratio').innerHTML = winratio+"% winratio";
    }
}


// Draw matches

drawMatches = () =>{
    for(let i = 0; i<matchesCount; i++){
        const matchDiv = document.createElement('div')
        matchDiv.classList.add('match')
        document.getElementById('match-list').appendChild(matchDiv)
        const dateDiv = document.createElement('div')
        dateDiv.classList.add('data')
        dateDiv.innerHTML = dates[i]
        match[i].appendChild(dateDiv)
        const championDiv = document.createElement('div')
        championDiv.classList.add('champion-name')
        championDiv.innerHTML = champions[i]
        match[i].appendChild(championDiv)
        const statsDiv = document.createElement('div')
        statsDiv.classList.add('stats')
        statsDiv.innerHTML = stats[i]
        match[i].appendChild(statsDiv)
        const queueDiv = document.createElement('div')
        queueDiv.classList.add('mode')
        queueDiv.innerHTML = queues[i]
        match[i].appendChild(queueDiv)
        const resultDiv = document.createElement('div')
        resultDiv.classList.add('resoult')

        if(result[i]==true){
            resultDiv.innerHTML = 'Zwycięstwo'
            match[i].classList.add('victory');
        }
        else{
            resultDiv.innerHTML = 'Porażka'
            match[i].classList.add('lose');
        }
        match[i].appendChild(resultDiv)
    }
}
//Time format

format_time = (s) =>{
    return new Date(s).toISOString().slice(5, 16).replace('T', ' ');
}
//loading screen

loadingScreen = () =>{
    document.getElementById('loading').classList.add('none')
    document.getElementById('content').classList.remove('none')

}
// Get data from api's and store them 

async function getUserData(summoner){
    try{
        let res = await fetch('https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+summoner+'?api_key='+apiKey);
        return await res.json();
    }
    catch(error){
        console.log('brak użykownika')
    }
}

async function inGame(summonerId){
    try{
        let res = await fetch('https://eun1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/'+summonerId+'?api_key='+apiKey)
    return await res.json();
    }
    catch(error){
        return false
    }
}

async function getUserMatches(puuid){
    let res = await fetch('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/'+puuid.puuid+'/ids?start=0&count='+matchesCount+'&api_key='+apiKey)
    return await res.json();
}

async function getUserMatchesInfo(gameId){
        let res = await fetch('https://europe.api.riotgames.com/lol/match/v5/matches/'+gameId+'?api_key='+apiKey)
        return await res.json();
}

async function getCurrentUserMatch(gameInfo){
    return gameInfo.info.participants
}


async function displayData(){
    const userData = await getUserData(summoner);
    const inGameData = await inGame(userData.id)
    console.log(inGameData)
    if(inGameData==false){
        document.getElementById('game-type').innerHTML = "Nie jest w grze";
        document.getElementById('ingame-icon').classList.add('lose')
    }
    else{
        if(inGameData.gameQueueConfigId==440){
            document.getElementById('game-type').innerHTML = "w grze: Raned Flex"
            document.getElementById('ingame-icon').classList.add('victory')

        }
        else{
            if(inGameData.gameQueueConfigId==420){
                document.getElementById('game-type').innerHTML = "w grze: Ranked solo/duo"
                document.getElementById('ingame-icon').classList.add('victory')

            }
            else{
                document.getElementById('game-type').innerHTML = "w grze: Other"
                document.getElementById('ingame-icon').classList.add('victory')


            }
        }
    }
    document.getElementById('nickname').innerHTML = userData.name
    document.getElementById('summoner-lvl').innerHTML = userData.summonerLevel
    document.getElementById('summoner-icon').style.backgroundImage = 'url(https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/'+userData.profileIconId+'.jpg)';
    const usersMatches = await getUserMatches(userData);
    console.log(usersMatches)
    for(let i =0; i<usersMatches.length; i++){
        const userMatchesInfo = await getUserMatchesInfo(usersMatches[i]);
        console.log(userMatchesInfo.info)
        console.log(format_time(userMatchesInfo.info.gameEndTimestamp+timezone))
        dates.push(format_time(userMatchesInfo.info.gameEndTimestamp+timezone))
        if(userMatchesInfo.info.queueId==440){
            console.log("Ranked flex")
            queues.push('Ranked flex')
        }
        else{
            if(userMatchesInfo.info.queueId==420){
                console.log("Ranked solo/duo")
                queues.push('Ranked solo/duo')
            }
            else{
                console.log("Other")
                queues.push('Other')
            }
        }
        for(let i =0; i<userMatchesInfo.info.participants.length; i++){
            if(userMatchesInfo.info.participants[i].puuid==userData.puuid){
                console.log("To ty: "+userMatchesInfo.info.participants[i].championName)
                console.log("To ty: "+userMatchesInfo.info.participants[i].win)
                champions.push(userMatchesInfo.info.participants[i].championName);
                result.push(userMatchesInfo.info.participants[i].win);
                stats.push(userMatchesInfo.info.participants[i].kills+"/"+userMatchesInfo.info.participants[i].deaths+"/"+userMatchesInfo.info.participants[i].assists);
                gameDuration.push(userMatchesInfo.info.gameEndTimestamp-userMatchesInfo.info.gameStartTimestamp);
            }
            else{
                console.log(userMatchesInfo.info.participants[i].championName)
            }
        }
    }
    await drawMatches();
    await checkStreak();
    await loadingScreen();

}

//Change summoner 

displayData()
