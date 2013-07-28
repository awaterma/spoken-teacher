var blessed = require('blessed');
var say = require('say');
var Q = require('q');
var fs = require('fs');
var through = require('through');

var englishVoice = 'Alex';
var spanishVoice = 'Paulina';

/* Load the phrases file into memory */
var db = JSON.parse(fs.readFileSync('src/resources/phrases.json', 'utf8'));
var counter = 0;

var screen = blessed.screen();
screen.smartCSR = true;

var bienvenidos = "Bienvenidos a su maestra virtual de Íngles";
var welcome = "Welcome to virtual English teacher";

var topbox = blessed.box({
  top: '0',
  left: 'center',
  width: '80%',
  height: '50%',
  border: {
    type: 'line',
    fg: '#ffffff'
  },
  fg: 'red',
  bg: 'yellow',
  content: '{center}' + bienvenidos,
  tags: true,
  hoverEffects: {
    bg: 'green'
  }
});

var bottombox = blessed.box({  
  top: '50%',
  left: 'center',
  width: '80%',
  height: '50%',
  border: {
    type: 'line',
    fg: '#ffffff'
  },
  fg: 'white',
  bg: 'red',
  content: '{center}' + welcome, 
  tags: true,
  hoverEffects: {
    bg: 'blue'
  }

})

topbox.phrase = bienvenidos;
bottombox.phrase = welcome;

function switchContent(c) {
  if (c > db.phrases.length - 1 || c < 0) {
    c = 0; counter = 0;
  } 
  topbox.setContent('{center}' + db.phrases[c].spanish);
  topbox.phrase = (db.phrases[c].spanish);
  bottombox.setContent('{center}' + db.phrases[c].english);
  bottombox.phrase = db.phrases[c].english;
  screen.render();
}

// Append our box to the screen.
screen.append(topbox);
screen.append(bottombox);

// If our box is clicked, change the content.
topbox.on('click', function(data) {
  say.speak(spanishVoice,topbox.phrase);
});

bottombox.on('click', function(data) {
  say.speak(englishVoice, bottombox.phrase);
});

screen.key(['space','right','return'], function(ch, key) {
  switchContent(++counter);
  screen.render();
})

screen.key(['left'], function(ch, key) {
  switchContent(--counter);
  screen.render();
})

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
topbox.focus();

// Render the screen.
screen.render();
