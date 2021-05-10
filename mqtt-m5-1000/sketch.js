//client er den variabel der bruges til at oprette forbindelse til mqtt serveren
let client 
//vi bruger en boolsk variabel til at tjekke om m5'eren er tændt
let on = false
//vi sættter en variabel med det antal sekunder vi vil have knappen skal tænde i
let seconds = 10

//setup er den funktion der kører, før selve web-appen går starter 
function setup() {
  //det første vi gør her, er at oprette forbindelse til mqtt serveren - selve funktionen kan ses længere nede
  mqttInit()
  //vi har ikke brug for et canvas, selvom det er en del af p5.js
  noCanvas();

  //vi subscriber til beskeder fra m5-1000
  client.subscribe('m5-1000')

  //vi begynder med at nulstille m5'eren
  client.publish('m5-1000', 'off')
  
  client.on('message', (topic, message) => {
    if(topic == 'm5-1000' && message == 'touch' && on == false){
      on = true
      client.publish('m5-1000', 'on')
      let t = setTimeout(()=>{
        client.publish('m5-1000', 'off')
        on = false
      }, seconds * 1000)
    }
  }) 
}

function draw(){
  select('#on').html(on ? 'on' : 'off')
  select('#seconds').html(seconds)
  select('#on-2').html(on ? 'on' : 'off')
  if(on){
    select('#on-2').addClass('on')
  }else{
    select('#on-2').removeClass('on')
  }
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