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
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'no-label',
                data: Object.values(data),
                backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)'],
                borderWidth: 3,
                
            }],
        },
        options:{
            plugins:{
                legend:{
                    display:false
                },
                title:{
                    display:true,
                    text:'chart title'
                }
            }
        }

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


