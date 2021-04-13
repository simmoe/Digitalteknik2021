//client er den variabel der bruges til at oprette forbindelse til mqtt serveren
let client 
//vi har et array med svarmuligheder - dem ville vi i praksis modtage fra serveren, men.. 
let options = ['nummer 1', 'nummer 2', 'nummer 3', 'nummer 4']
//vi bruger en boolean variabel som tjekker om vi allerede har stemt
let selected = false

//setup er den funktion der kører, før selve web-appen starter 
function setup() {
  //det første vi gør her, er at oprette forbindelse til mqtt serveren - selve funktionen kan ses længere nede
  mqttInit()
  //vi løber mulighederne igennem og laver hver mulighed som en ny div
  options.map( (option, index) => {
    let newDiv = createDiv(option)
    select('#vote').child(newDiv)
    newDiv.mousePressed(() => {
      if(selected)return
      selected = true
      client.publish('filmfestival-afstemning', index.toString())
      newDiv.addClass('chosen')
    })
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