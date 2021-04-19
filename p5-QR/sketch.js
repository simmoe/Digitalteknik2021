//setup er den funktion der kører, før selve web-appen starter 
function setup() {
  let img = select('#qr')
  img.elt.src = 'https://api.qrserver.com/v1/create-qr-code/?data=' + window.location.origin + '/destination'  + '&amp;size=100x100'
}

