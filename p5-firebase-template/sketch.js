let data 

function setup() {
    //UNCOMMENT THIS TO GET DATA FROM FIREBASE
    // db.collection("connection-name").doc("doc-name")
    // .onSnapshot( doc => {
    //     data = doc.data() 
    // })
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


