var blessed = require('blessed');
var say = require('say');
var fs = require('fs');

var englishVoice = 'Samantha';
var spanishVoice = 'Paulina';
var tseltalVoice = 'Paulina';

/* Load the phrases file into memory */
var db = JSON.parse(fs.readFileSync('src/resources/phrases.json', 'utf8'));
var counter = 0;

var screen = blessed.screen();
screen.smartCSR = true;

var spanishbox = blessed.box({
  top: '33%',
  left: 'center',
  width: '80%',
  height: '33%',
  border: {
    type: 'line',
    fg: '#ffffff'
  },
  fg: 'red',
  bg: 'yellow',
  tags: true,
  hoverEffects: {
    bg: 'green'
  }
});

var tseltalbox = blessed.box({
  top: '66%',
  left: 'center',
  width: '80%',
  height: '33%',
  border: {
    type: 'line',
    fg: '#ffffff'
  },
  fg: 'white',
  bg: 'black',
  tags: true,
  hoverEffects: {
    bg: 'blue'
  }

})

var gringobox = blessed.box({  
  top: '0',
  left: 'center',
  width: '80%',
  height: '33%',
  border: {
    type: 'line',
    fg: '#ffffff'
  },
  fg: 'white',
  bg: 'red',
  tags: true,
  hoverEffects: {
    bg: 'blue'
  }

})

function switchContent(c) {
  if (c > db.phrases.length - 1 || c < 0) {
    c = 0; counter = 0;
  } 
  spanishbox.setContent('{center}' + db.phrases[c].spanish);
  spanishbox.phrase = (db.phrases[c].spanish);
  gringobox.setContent('{center}' + db.phrases[c].english);
  gringobox.phrase = db.phrases[c].english;
  tseltalbox.setContent('{center}' + db.phrases[c].tseltal);
  tseltalbox.phrase = db.phrases[c].tseltal;
  screen.render();
}

/* Initialize conent */
switchContent(0);

// Append our box to the screen.
screen.append(spanishbox);
screen.append(gringobox);
screen.append(tseltalbox);

// If our box is clicked, change the content.
spanishbox.on('click', function(data) {
  say.speak(spanishVoice,spanishbox.phrase);
});

gringobox.on('click', function(data) {
  say.speak(englishVoice, gringobox.phrase);
});

tseltalbox.on('click', function(data) {
  say.speak(tseltalVoice, tseltalbox.phrase);
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
spanishbox.focus();

// Render the screen.
screen.render();
