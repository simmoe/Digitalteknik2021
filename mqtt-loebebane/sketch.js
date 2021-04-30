//client er den variabel der bruges til at oprette forbindelse til mqtt serveren
let client 
//vi skal bruge to variabler til at tage tid i millisekunder og til at gemme starttidspunktet  
let milliseconds, seconds, startTime = 0; 
//og en timer - som er en variabel i javascript, der kaldes i et interval 
let timer; 

//Vi gemmer løberne som objekter i et array, hvor vi også har en reference til deres mqtt navn
let runner = {'name':'løber 1', 'mqtt': 'm5-1', 'time':0 }
//og laver en anden liste til highscores
let highscore = [1.55, 1.89, 2.56, 5.55]

//setup er den funktion der kører, før selve web-appen går starter 
function setup() {
  //det første vi gør her, er at oprette forbindelse til mqtt serveren - selve funktionen kan ses længere nede
  mqttInit()
  //vi har ikke brug for et canvas eller en run funktion, selvom det er en del af p5.js
  noCanvas(); noLoop();
  //når der trykkes på knapperne
  select('#readyButton').mouseReleased(()=>{goToPage(1)})
  select('#startButton').mouseReleased(startGame)
  select('#cancelButton').mouseReleased(resetGame)
  select('#resetButton').mouseReleased(resetGame)

  //vi subscriber til beskeder fra m5/m5-1
  client.subscribe('m5/m5-1')
  //vi begynder med at nulstille m5'eren
  client.publish('m5', 'off')
  client.on('message', (topic, message) => {
    if(runner.time == 0) {
      runner.time = seconds
      endGame()
    }
  }) 
}

function goToPage(where){
  select('main').style('transform', 'translateX(-' + where * 100 + 'vw)')
}

function startGame(){
  goToPage(2)
  //vi gemmer starttidspunktet i startTime - millisekunder siden 1970 
  startTime = new Date().getTime()
  //timeren sættes op som et interval, der hele tiden kalder funktionen showTime()
  timer = setInterval( showTime , 50 )
}

function showTime(){
  //vi sætter så milliseconds til antallet af millisekunder siden startTime
  milliseconds = new Date().getTime() - startTime 
  seconds = (milliseconds/1000).toFixed(2)
  select('#timer').html( seconds )
}

//funktion der nulstiller spillet
function resetGame(){
  //Stop tiden
  clearInterval(timer)
  //sæt løberens tid til 0
  runner.time = 0
  //gå tilbage til forsiden
  goToPage(0)
} 


function endGame(){
  runner.time = seconds
  //Stop tiden
  clearInterval(timer)
  select('#endTime').html(runner.time)
  highscore.push(float(runner.time))
  highscore.sort()
  console.log(highscore)

  select('#highscore').html('<h3>Highscore</h3>')
  highscore.map( score => {
    let div = createDiv(score)
    if(score == runner.time) div.class('me')
    select('#highscore').child(div)
  })
  //gå til slutsiden
  goToPage(3)
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