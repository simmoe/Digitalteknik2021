//client er den variabel der bruges til at oprette forbindelse til mqtt serveren
let client 
//vi bruger et JSON objekt til afstemningen
let vote = {
  options:['nummer 1', 'nummer 2', 'nummer 3', 'nummer 4'],
  votes:[0,0,0,0],
}
//Vi har også en liste med farver til charts mm
let backgroundColors = ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)']
//og så skal vi bruge en timer
let timer
//og et antal sekunder det skal tage at svare
let seconds = 20

//setup er den funktion der kører, før selve web-appen starter 
function setup() {
  //det første vi gør her, er at oprette forbindelse til mqtt serveren - selve funktionen kan ses længere nede
  mqttInit()
  //vi skal have besked hver gang der kommer nye beskeder i emnet "filmfestival-afstemning"
  client.subscribe('filmfestival-afstemning')
  client.on('message', (topic, message) => {
    vote.votes[message.toString()] ++
    console.log(vote.votes)
  })
  //Så skal vi oprette afstemningen - vi løber mulighederne igennem og laver hver mulighed som en ny div
  vote.options.map( (option, index) => {
    select('#options').child(createDiv(option).style('backgroundColor', backgroundColors[index]))
  })
  //vi sætter antal sekunder ind i den div der viser tiden
  select('#timer').html(seconds)
  //så starter vi tiden
  timer = setInterval(() => {
    //hver gang der er gået et sekund, tæller vi sekunderne ned og viser den nye tid
    seconds--
    select('#timer').html(seconds)
    //hvis alle sekunderne er gået, kalder vi funktionen showResults
    if (seconds == 0) showResults()
  }, 1000)
}

function showResults(){
  //stop timeren
  clearInterval(timer)
  //tilføj klassen 'show' til den div der viser vores chart
  select('#chart').addClass('show')
  //opret chart med resultater fra afstemningen
  chart = new Chart(document.getElementById('chartCanvas'), {
      type: 'bar',
      data: {
        labels: vote.options,
        datasets: [{
            label: 'Resultat',
            data: vote.votes,
              backgroundColor: backgroundColors,
              borderWidth: 3
          }]
      },
  });
}



















const mqttInit = () => {
  //opret et id med en random talkode og sæt gem servernavnet i en variabel
  const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
  const host = 'wss://test.mosquitto.org:8081'

  //opret et objekt med de oplysninger der skal bruges til at forbinde til serveren
  const options = {
    keepalive: 30,
    clientId: clientId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false
    },
    rejectUnauthorized: false
  }

  console.log('connecting mqtt client')

  //forsøg at oprette forbindelse 
  client = mqtt.connect(host, options)

  //hvis der sker en fejl kaldes denne funktion
  client.on('error', (err) => {
    console.log('Connection error: ', err)
    client.end()
  })

  //og hvis forbindelsen mistes kaldes denne funktion
  client.on('reconnect', () => {
    console.log('Reconnecting...')
  })

  //hvis forbindelsen lykkes kaldes denne funktion
  client.on('connect', () => {
    console.log('Client connected:' + clientId)
  })

  //når klienten modtager beskeder fra serveren kaldes denne funktion
  client.on('message', (topic, message, packet) => {
    console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)
  })

  //når forbindelsen lukkes kaldes denne funktion
  client.on('close', () => {
    console.log(clientId + ' disconnected')
  })
} 