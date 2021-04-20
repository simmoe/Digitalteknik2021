let position = 0
let pages 

function setup() {
    select('#start').mousePressed(()=>goLeft())
    pages = selectAll('.page')
}

function goRight(){
    if(position < pages.length - 1) position--
    selectAll('.page').map( e => e.style('transform', 'translateX(' + position * -100 + 'vw)') )
}
function goLeft(){
    if(position <= 0) position--
    selectAll('.page').map( e => e.style('transform', 'translateX(' + position * 100 + 'vw)') )
}


function addData(collection, doc, data){
    // Add a new document in collection "cities"
    db.collection(collection).doc(doc).set(data)
    .then(() => {
        console.log("Document successfully written!")
    })
    .catch((error) => {
        console.error("Error writing document: ", error)
    });
}


