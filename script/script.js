console.log("hello world");


const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// larghezza
canvas.width = window.innerWidth;
// altezza
canvas.height = window.innerHeight;

// oggetto per le particelle
let arrayParticelle = [];
// aggiustamento valori
let aggiustamentoX = -5;
let aggiustamentoY = 20;
// interazione mouse
const mouse = {
  x: null,
  y: null,
  // ampiezza
  radius: 120
};

// evento movimento mouse
window.addEventListener('mousemove', function(evento) {
  // coordinate movimento
  mouse.x = event.x;
  mouse.y = event.y;
  //console.log("evento mouse asse x: ", mouse.x,"evento mouse asse y: ", mouse.y);
})

//di default il testo sarà vuoto per riempirlo
context.fillStyle = 'green';

// font testo
context.font = '15px bold Italic';
// riempimento testo in canvas
//primo attributo testo secondo e terzo asse quarto altezza
context.fillText('Hello World!' , 0 , 15);

// scansione area da modificare (canvas)
//context.strokeStyle = 'white';
// visione area
//context.strokeReact(0,0,100,100);

const areaTesto = context.getImageData(0,0,100,100);

// creazione classe
class Particelle {
  // coordinate da passare
  constructor(x, y){
    this.x = x + 200;
    this.y = y - 100;
    this.size = 4;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = ((Math.random() * 40) + 5);
  }
  // riempimento particelle
  riempi() {
    context.fillStyle = 'green';
    context.beginPath();
    // math pi valore per il radio
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }
  aggiornamento(){
    // distanza tra punti e mouse calcolo
    let distanzaX = mouse.x - this.x;
    let distanzaY = mouse.y - this.y;
    //per calcolare la distanza precisa bisogna creare un triangolo tra punti
    // calcolo distanza tra punti (triangolo)
    let distazaTot = Math.sqrt((distanzaX * distanzaX) + (distanzaY * distanzaY));
    // animazione movimento
    let movimentoX = distanzaX / distazaTot;
    let movimentoY = distanzaY / distazaTot;
    // distanza massima
    let distanzaMassima = mouse.radius;
    // distanza mouse e distanza da particella per interazione sul raggio del mouse
    let esternoMov = (distanzaMassima - distazaTot) / distanzaMassima;
    let forzaMovimentoX = movimentoX * esternoMov * this.density;
    let forzaMovimentoY = movimentoY * esternoMov * this.density;
    if (distazaTot < mouse.radius + this.size) {
      // movimento verso il mouse
      // con += si avvicinano con -= si allontanano
      this.x -= forzaMovimentoX;
      this.y -= forzaMovimentoY;

      // this.x += movimentoX * 3;
      // this.y += movimentoY * 3;

      // animazione ingrandimento
      //this.size = 20;
    } else {
      // this.size = 2;
      // se la distanza di movimento non è quella originale
      if(this.x !== this.baseX ){
        // this.baseX cambia perchè viene spostato dal movimento del mouse
        let dx = this.x - this.baseX;
        this.x -= dx/10;
      }
      if (this.y !== this.baseY ) {
        let dy = this.y - this.baseY;
        this.y -= dy/10;
      }
    }
  }
}
// console.log(areaTesto);
// la proprietà data è un Uint8ClampedArray
function init(){
  arrayParticelle = [] ;

  for (let i = 0, i2 = areaTesto.height; i < i2 ; i++) {
    for (var x = 0, x2 = areaTesto.width; x < x2 ; x++) {

      // area di testo ha delle proprietà generate automaticamente
      // tra cui height width e data
      if (areaTesto.data[(i * 4 * areaTesto.width) + (x * 4) + 3 ] > 128) {
        // controllo se l'opacità del valore è maggiore al 50% del totale(256)
        let posizioneX = x + aggiustamentoX;
        let posizioneY = i + aggiustamentoY;
        arrayParticelle.push(new Particelle(posizioneX * 20 , posizioneY * 20));
      }
    }
  }

  /*
  for (var i = 0; i < 1000; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    arrayParticelle.push(new Particelle(x,y));
  }
  */
  // inserimento particelle
  //arrayParticelle.push(new Particelle(200,200))
  //arrayParticelle.push(new Particelle(180,350))
}

// test funzione ed arrayParticelle
init();
console.log(arrayParticelle);


// animazione
function animazione(){
  context.clearRect(0,0, canvas.width, canvas.height);
  // loop
  for (let a = 0; a < arrayParticelle.length; a++) {
    arrayParticelle[a].aggiornamento();
    arrayParticelle[a].riempi();
  }
  unisci();
  requestAnimationFrame(animazione);
}
animazione();

function unisci(){
  for (let a = 0; a < arrayParticelle.length; a++) {
    for (let b = 0; b < arrayParticelle.length; b++) {
      let dx = arrayParticelle[a].x - arrayParticelle[b].x;
      let dy = arrayParticelle[a].y - arrayParticelle[b].y;
      let distanza = Math.sqrt(dx * dx + dy * dy);

      if (distanza < 50 ) {
        context.strokeStyle = 'green';
        context.lineWidht = 2;
        context.beginPath();
        context.moveTo(arrayParticelle[a].x, arrayParticelle[a].y);
        context.lineTo(arrayParticelle[b].x, arrayParticelle[b].y);
        context.stroke();

      }
    }
  }
}
