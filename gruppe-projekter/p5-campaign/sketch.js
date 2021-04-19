let position = 0
let pages 

function setup() {
    db.collection("quiz")
    .onSnapshot( quiz => {
        quiz.forEach( question => {
            question = question.data()
            let newPage = createElement('div').class('page quiz')
            newPage.child(createElement('h1', question.title))
            newPage.child(createElement('p', question.description))
            question.options.forEach( o => {
                newPage.child(createElement('li', o))
            })
            question.options.forEach( (o, index) => {
                answerBtn = createElement('button', o)
                answerBtn.mousePressed(()=> showAnswer(question, index))
                newPage.child(answerBtn)
            })

            
            select('main').child(newPage)
        })
        pages = selectAll('.page')
        console.log(pages.length)
    })
    select('#startButton').mousePressed(goRight)
}

function showAnswer(question, index){
    if(question.correct == index){
        console.log('correct')
    }else{
        console.log('wroong')
    }
}
function goRight(){
    if(position < pages.length-1) position++
    selectAll('.page').map( e => e.style('transform', 'translateY(' + position * -100 + 'vh)') )
}
function goLeft(){
    if(position >= 1) position--
    selectAll('.page').map( e => e.style('transform', 'translateY(' + position * -100 + 'vh)') )
}






//      UNCOMMENT THIS TO TRACK ANALYTICS PARAMETERS
//      analytics.logEvent('trigger_name', { label_name: 'a user just fired the trigger_name dimension'});
