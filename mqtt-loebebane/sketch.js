//client er den variabel der bruges til at oprette forbindelse til mqtt serveren
let client 
//Vi skal bruge en knap man kan trykke start på og en til at resette spillet
let startButton, resetButton
//vi skal bruge to variabler til at tage tid i millisekunder og til at gemme starttidspunktet  
let milliseconds, seconds, startTime = 0; 
//og en timer 
let timer; 
//og et DIV element til at vise tiden
let timerDiv 

//Vi gemmer løberne som objekter i et array, hvor vi også har en reference til deres mqtt navn
let runners = [ 
                {'name':'løber 1', 'mqtt': 'm5-1', 'time':0 }, 
                {'name':'løber 2', 'mqtt': 'm5-2', 'time':0 }, 
              ]
//og så skal vi bruge et DIV element til at vise løbernes tider, og et andet til at vise hvem der har vundet 
let statsDiv, winnerDiv

//setup er den funktion der kører, før selve web-appen går starter 
function setup() {
  //det første vi gør her, er at oprette forbindelse til mqtt serveren - selve funktionen kan ses længere nede
  mqttInit()
  //vi har ikke brug for et canvas eller en run funktion, selvom det er en del af p5.js
  noCanvas(); noLoop();
  //vi subscriber til alle topics som starter med m5/
  client.subscribe('m5/+')
  //vi begynder meed at nulstille alle m5'ere
  client.publish('m5/all', 'off')
  //vi initialiserer startknappen
  startButton = createButton('start') 
  //når man trykker på knappen, skal spillet begynde - det sker i funktionen startGame
  startButton.mouseReleased(startGame)
  //og reset knappen
  resetButton = createButton('nulstil')
  //som kalder en funktion der nulstiller alt  
  resetButton.mouseReleased(resetGame)
  //vi initialiserer den DIV der skal vise tiden 
  timerDiv = createDiv('0:00').class('timer')
  //og de div'er der skal vise stats og vinder
  statsDiv = createDiv().class('stats') 
  winnerDiv = createDiv().class('winner')

  //vi bruger funktionen showStats til at vise løbernes tider
  showStats()
  //her modtager vi MQTT beskeder fra m5'erne 
  client.on('message', (topic, message) => {
    //så vi går de forskellige løbere igennem og ser hvem det er vi har fået besked fra
    runners.map( runner => {
      //når vi finder løberen tjekker vi at tiden i forvejen er 0 - og sætter så en sluttid 
      if(topic.includes(runner.mqtt) && runner.time == 0) runner.time = seconds
    }) 
    //vi tjekker om alle løberes tider er sat 
    let anyMoreRunners = runners.find( runner => runner.time == 0 )
    //hvis de er det, kalder vi funktionen endGame()
    if( ! anyMoreRunners ) endGame()
  }) 
}

function startGame(){
  //vi gemmer starttidspunktet i startTime - millisekunder siden 1970 
  startTime = new Date().getTime()
  //timeren sættes op som et interval, der hele tiden kalder funktionen showTime()
  timer = setInterval( showTime , 50 )
}

function showTime(){
  //vi sætter så milliseconds til antallet af millisekunder siden startTime
  milliseconds = new Date().getTime() - startTime 
  seconds = (milliseconds/1000).toFixed(2)
  timerDiv.html( seconds )
  showStats()
}

//funktion der nulstiller spillet
function resetGame(){
  //først sætter vi alle løberes tider til 0
  runners.map(runner => runner.time = 0)
  //vi nulstiller timeren, og sætter de andre variabler og tekster tilbage til 0
  window.clearInterval(timer)
  milliseconds = 0
  timerDiv.html('0:00')
  winnerDiv.html('').removeClass('in')
  showStats()
} 

//funktion der viser statistik om løbernes tider 
function showStats(){
  //Vi bygger en lille html-tekst, som viser løbernes tider - først en overskrift
  stats = '<h3>Stats</h3>'
  //så går vi løberne igennem og tilføjer deres navn og tid 
  runners.map(runner => {
    stats += runner.name + ': ' + runner.time + '</br>'
  })
  //til sidst viser vi hele teksten i statsDiv
  statsDiv.html(stats)
}

function endGame(){
  //Stop tiden
  clearInterval(timer)
  //vis stats en sidste gang
  showStats()
  //Vi skal finde ud af hvem der har vundet - først sætter vi en variabel til at pege på den allerførste løber  
  let winner = runners[0]
  //så løber vi alle løbere igennem og hvis deres tid er bedre end den første, sætter vi dem som vinder i stedet
  runners.map( runner => runner.time < winner.time ? winner = runner : '' )
  //og så kan vi vise hvem der har vundet
  winnerDiv.html('<h3>' + winner.name + ' vinder med tiden: ' + winner.time +  '</h3>')
  winnerDiv.addClass('in')
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