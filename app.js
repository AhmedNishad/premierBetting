let api_key = '948682ae1bcffc06e4d67259494f43bb0270bba8676c87f696e5c75cf6a78c5f';

let d = new Date();

console.log(startDate())
console.log(currentDate())
console.log(upcomingDate())

function currentDate(){
    let end = '';

    end += d.getFullYear() + '-'
    end += (d.getMonth() + 1) + '-'
    end += d.getDate();
    return end;
}

function startDate(){
    let start = '';

    //let newD = new Date(2019, 03, 03)
    if(d.getDate() > 5){
        start += d.getFullYear() + '-'
        start += (d.getMonth() +1 )+ '-'
        start += d.getDate() - 5;
    }else{
        start += d.getFullYear() + '-'
        start += (d.getMonth() +1) + '-'
        start += d.getDate() + 25;
    }
    return start;
}


// Scores from the Week

let url_current = ' https://apifootball.com/api/?action=get_events&from=' + startDate() + '&to='+ currentDate() + '&league_id=62&APIkey=' + api_key;

let none_current = document.querySelector('#none_current')

fetch(url_current)
.then(req=> req.json())
.then(data => {
    console.log(data)
    createCurrentMatches(data)
}).catch(err=> {
    console.log(err)
    none_current.classList.remove('hidden')
})


let currentMatchContainer = document.querySelector('.past_matches')

function createCurrentMatchElement(m){
    let match = document.createElement('div');

    let awayTeam = document.createElement('h2');
    let homeTeam = document.createElement('h2');
    let awayScore = document.createElement('h3');
    let homeScore = document.createElement('h3');

    awayTeam.innerHTML = m.match_awayteam_name;
    homeTeam.innerHTML = m.match_hometeam_name ;
    homeScore.textContent = m.match_hometeam_score;
    awayScore.textContent = m.match_awayteam_score

    match.classList.add('match');
    
    match.appendChild(homeTeam);
    match.appendChild(awayTeam);
    match.appendChild(homeScore);
    match.appendChild(awayScore);

    currentMatchContainer.appendChild(match)
}



function createCurrentMatches(matches){
    let matchesWithScore = matches.filter(m=>{
        
        return parseInt(m.match_hometeam_score,10) > -1;
    })

    let matchesWithPrediction = matchesWithScore.filter(e=>{
        return localStorage.getItem(e.match_id)
    })
    if(matchesWithPrediction.length > 1){
    createPredictedMatches(matchesWithPrediction);
    }
    console.log(matchesWithScore)
    matchesWithScore.forEach(element => {
        createCurrentMatchElement(element)
    });
}

let predictionContainer = document.querySelector('.results')

function createPredictedMatches(p_matches){
    predictionContainer.classList.remove('hidden')

    p_matches.forEach(m=>{

    let p_match = document.createElement('div');

    let awayTeam = document.createElement('h2');
    let homeTeam = document.createElement('h2');
    let awayScore = document.createElement('h3');
    let homeScore = document.createElement('h3');
    let predictionEl = document.createElement('h4')

    predictionEl.classList.add('prediction')

    let predictionObj = JSON.parse(localStorage.getItem(m.match_id))

    predictionEl.innerHTML = predictionText(predictionObj)


    function predictionText(p_obj){
        let str = "";
        let homePoints;
        let awayPoints;
        let points = homePoints + awayPoints;
        
        if(homeScore == p_obj.homeScore){
            str += "Congratulations you got the home score right +"
            homePoints += 50;
        } else if(homeScore < p_obj.homeScore){
            str+= "You got the home score off by " + (p_obj.homeScore - homeScore) + " goals +"
            homePoints += (Math.abs(homeScore-p_obj.homeScore)/ homeScore) * 50
        } else{
            str+= "You got the home score off by " + (homeScore - p_obj.homeScore ) + " goals +"
            homePoints += (Math.abs(homeScore-p_obj.homeScore)/ homeScore) * 50
        }
        str += homePoints

        if(awayScore == p_obj.awayScore){
            str += "\nCongratulations you got the away score right +"
            awayPoints += 50
        } else if(awayScore < p_obj.awayScore){
            str+= "\nYou got the away score off by " + (p_obj.awayScore - awayScore) + " goals +"
            awayPoints += (Math.abs(awayScore-p_obj.awayScore)/ awayScore) * 50
        } else{
            str+= "\nYou got the away score off by " + (awayScore - p_obj.awayScore ) + " goals +"
            awayPoints += (Math.abs(awayScore-p_obj.awayScore)/ awayScore) * 50
        }
        str += awayPoints
        addPoints(points);
        return str;
    }

    function addPoints(points){
        let pointsEl = document.querySelector('.points')
        let currentPoints = parseInt(pointsEl.textContent, 10)

        pointsEl.textContent = (currentPoints + points)
    }

    

    awayTeam.innerHTML = m.match_awayteam_name;
    homeTeam.innerHTML = m.match_hometeam_name ;
    homeScore.textContent = m.match_hometeam_score;
    awayScore.textContent = m.match_awayteam_score

    p_match.classList.add('match');
    
    p_match.appendChild(homeTeam);
    p_match.appendChild(awayTeam);
    p_match.appendChild(homeScore);
    p_match.appendChild(awayScore);

    p_match.appendChild(predictionText);

    predictionContainer.appendChild(p_match)
    })
}


// Upcoming Matches

function upcomingDate(){
    let start = '';

    //let newD = new Date(2019, 03, 03)
    if(d.getDate() < 24){
        start += d.getFullYear() + '-'
        start += (d.getMonth() + 1) + '-'
        start += (d.getDate() + 6 );
    }else{
        start += d.getFullYear() + '-'
        start += (d.getMonth() + 2) + '-'
        start += 10-(30 - d.getDate() ) ;
    }
    return start;
}



let url_upcoming = ' https://apifootball.com/api/?action=get_events&from=' + currentDate() + '&to='+ upcomingDate() + '&league_id=62&APIkey=' + api_key;

fetch(url_upcoming).then(req=> req.json())
.then(data=>{
    
    createUpcomingMatches(data)
}).catch(err=> console.log(err))

function createUpcomingMatches(matches){
    let matchesWithoutScore = matches.filter( e=>
        e.match_hometeam_score == ""
    )
    matchesWithoutScore.forEach(match =>{
        createUpcomingMatchElement(match);
    })
    addPredictButtonListeners();
}

let upcomingContainer = document.querySelector('.upcoming_matches')

function createUpcomingMatchElement(m){
    let upcoming = document.createElement('div')

    upcoming.classList.add('match');
    upcoming.setAttribute('match_id', m.match_id)
    

    let awayTeam = document.createElement('h2');
    let homeTeam = document.createElement('h2');
    let matchDate = document.createElement('h4');
    let predictButton = document.createElement('button')

    awayTeam.setAttribute('away_name', m.match_awayteam_name)
    homeTeam.setAttribute('home_name', m.match_hometeam_name)

    predictButton.innerText = "predict"

    awayTeam.innerHTML = m.match_awayteam_name;
    homeTeam.innerHTML = m.match_hometeam_name ;
    matchDate.textContent = m.match_date;

    upcoming.appendChild(homeTeam);
    upcoming.appendChild(awayTeam)
    upcoming.appendChild(matchDate)
    upcoming.appendChild(predictButton)

    // Check if prediction already made

    if(localStorage.getItem(m.match_id)){
        predictButton.classList.add('hidden')
        let predictionEl = document.createElement('div');
        predictionEl.classList.add('prediction')
        let p_obj = JSON.parse(localStorage.getItem(m.match_id))

        let ph_score =  document.createElement('h3')
        ph_score.innerHTML = p_obj.homeScore;

        let pa_score =  document.createElement('h3')
        pa_score.innerHTML = p_obj.awayScore;

        predictionEl.appendChild(ph_score);
        predictionEl.appendChild(pa_score)

        upcoming.appendChild(predictionEl)
    }

    upcomingContainer.appendChild(upcoming)
}


// Adding on click listener to predict button
function addPredictButtonListeners(){
    document.querySelector('body').addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'button') {
            if(event.target.textContent === "predict"){
                createPredictionForm(event.target.parentElement)
                event.target.classList.add('hidden')
            } else{
                submitPrediction(event.target.parentElement)
                addPredictionToStorage(event.target.parentElement)
            }
        }
      });
}


function createPredictionForm(parent){
    let form = document.createElement('div')

    let homeScore = document.createElement('input')
    let awayScore = document.createElement('input')
    let button = document.createElement('button')

    homeScore.setAttribute('type', 'number')
    awayScore.setAttribute('type', 'number')

    //button.removeAttribute('type')

    button.innerText = "submit"

    form.appendChild(homeScore)
    form.appendChild(awayScore)
    form.appendChild(button)

    parent.appendChild(form)
}

// Submit Prediction logic

function submitPrediction(submission){
    if(submission.children[0].value == "" || submission.children[1].value == ""){
        console.log('value required')
    }else{
        createSuccessElement(submission);
    }

}


function createSuccessElement(element){
    let inputEl = element.children;
    for(let i=0; i<inputEl.length; i++){
        inputEl[i].classList.add('hidden')
    }

    let success = document.createElement('h2')
    success.innerText = "Prediction Made"
    
    element.appendChild(success);
}

function predictObj(el){
    let matchP = el.parentElement;

    console.log(matchP.children[1])

    let hTeam = matchP.children[0].getAttribute('home_name');
    let aTeam = matchP.children[1].getAttribute('away_name');
    let pAScore = el.children[1].value;
    let pHScore = el.children[0].value;

   
    let obj = {
        homeTeam: hTeam,
        awayTeam: aTeam,
        awayScore: pAScore,
        homeScore: pHScore
    }
    //let str = "You've predicted that " + hTeam + " will " + " score " + pHScore + " and " + aTeam + " will score " + pAScore;

    return obj;
}


function addPredictionToStorage(element){
    let matchId = element.parentElement.getAttribute('match_id')
    let prediction = predictObj(element)
    
    localStorage.setItem(matchId, JSON.stringify(prediction))
    console.log(JSON.parse(localStorage.getItem(matchId)))
}


