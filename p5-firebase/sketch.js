let chartCanvas, chart, insertButton, closeButton, insertDiv, data

function setup() {
    noCanvas()
    noLoop()
    insertButton = select('#insertButton').mousePressed(showInsert)
    db.collection("myFootprint").doc("january")
    .onSnapshot( doc => {
        data = doc.data().footprint 
        showPieChart(data) 
    })
}

function showInsert(){
    insertDiv = select('#insertDiv').addClass('show')
    closeButton = select('#closeButton')
    data.labels.map( (label, index) => {
        let newDiv = createDiv(label)
        newDiv.mousePressed(()=>{
            data.values[index] = data.values[index] + 1
            console.log(data)
        })
        insertDiv.child(newDiv)
    })
    closeButton.mousePressed(()=>{
        addData('myFootprint', 'january', {footprint:data})
        insertDiv.html('<p id="closeButton">close</p>')
        insertDiv.removeClass('show')
    })
}

function showPieChart(data){
    console.log(data)
    chart && chart.destroy()
    chart = new Chart(document.getElementById('chartCanvas'), {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)'],
                borderWidth: 3
            }]
        },
    });
}

function addData(collection, id, data){
    // Add a new document in collection "cities"
    db.collection(collection).doc(id).set(data)
    .then(() => {
        console.log("Document successfully written!")
    })
    .catch((error) => {
        console.error("Error writing document: ", error)
    });
}


