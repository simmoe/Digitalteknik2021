let data, chart

function setup() {
//     UNCOMMENT THIS TO GET DATA FROM FIREBASE
//     db.collection("collection-name").doc("doc-name")
//     .onSnapshot( doc => {
//         console.log(doc.data())
//         showChart(doc.data())
//     })

}

function showChart(data){
    chart && chart.destroy()
    chart = new Chart(document.getElementById('myChart'), {
        type: 'polarArea',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.9)',
                    'rgba(54, 162, 235, 0.9)',
                    'rgba(255, 206, 86, 0.9)',
                    ],
                }]
            },
        });
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


