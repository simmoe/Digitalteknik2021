//client er den variabel der bruges til at oprette forbindelse til mqtt serveren
let client 
//vi skal bruge en variabel til at gemme brugerens navn
let myName = 'sus'
//Vi skal bruge nogle HTML elementer til at vise chatten
let chatContainer, input, submit, messages

//setup er den funktion der kører, før selve web-appen starter 
function setup() {
  //det første vi gør her, er at oprette forbindelse til mqtt serveren - selve funktionen kan ses længere nede
  mqttInit()
  //vi vil gerne have besked hver gang der kommer nye beskeder i emnet "filmfestival"
  client.subscribe('filmfestival')
  //først vil vi gerne vide hvad brugeren hedder (eller vil kalde sig)
  myName = window.prompt('what´s your name?')
  //vi laver chatten i en lille funktion
  createChat()
  client.on('message', (topic, message)=>{
    messages.html( messages.html() + '<br/>' + message)
    messages.elt.scrollTop = messages.elt.scrollHeight
  })
}

function createChat(){
    //så opretter vi chatvinduet 
    chatContainer = createDiv('').class('chat')
    input = createInput().attribute('placeholder', 'skriv noget og send det til de andre...')
    submit = createButton('send')
    messages = createDiv()
    chatContainer.child(input)
    chatContainer.child(submit)
    chatContainer.child(messages)
    submit.mouseReleased(()=>{
      client.publish('filmfestival', myName + ' siger: ' + input.value())
      input.value('')
    })
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