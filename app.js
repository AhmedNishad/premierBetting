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
    homeTeam.innerHTML = m.match_hometeam_name + '-';
    homeScore.textContent = m.match_hometeam_score + '-';
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
    console.log(matchesWithScore)
    matchesWithScore.forEach(element => {
        createCurrentMatchElement(element)
    });
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
        start += 30  - d.getDate() ;
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

    let awayTeam = document.createElement('h2');
    let homeTeam = document.createElement('h2');
    let matchDate = document.createElement('h4');
    let predictButton = document.createElement('button')

    predictButton.innerText = "predict"

    // Add onclick listener to predict button

    awayTeam.innerHTML = m.match_awayteam_name;
    homeTeam.innerHTML = m.match_hometeam_name + '-';
    matchDate.textContent = m.match_date;


    upcoming.appendChild(homeTeam);
    upcoming.appendChild(awayTeam)
    upcoming.appendChild(matchDate)
    upcoming.appendChild(predictButton)

    upcomingContainer.appendChild(upcoming)
}


// Adding on click listener to predict button
function addPredictButtonListeners(){
    document.querySelector('body').addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'button') {
          createPredictionForm(event.target.parentElement)
          event.target.classList.add('hidden')
        }
      });
}


function createPredictionForm(parent){
    let form = document.createElement('form')

    let homeScore = document.createElement('input')
    let awayScore = document.createElement('input')
    let submit_btn = document.createElement('button')

    homeScore.setAttribute('type', 'number')
    awayScore.setAttribute('type', 'number')

    submit_btn.textContent = 'Make Prediction'

    form.appendChild(homeScore)
    form.appendChild(awayScore)
    form.appendChild(submit_btn)

    parent.appendChild(form)
}