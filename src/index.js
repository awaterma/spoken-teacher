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

var topbox = blessed.box({
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

var midbox = blessed.box({
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

var bottombox = blessed.box({  
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
  topbox.setContent('{center}' + db.phrases[c].spanish);
  topbox.phrase = (db.phrases[c].spanish);
  bottombox.setContent('{center}' + db.phrases[c].english);
  bottombox.phrase = db.phrases[c].english;
  midbox.setContent('{center}' + db.phrases[c].tseltal);
  midbox.phrase = db.phrases[c].tseltal;
  screen.render();
}

/* Initialize conent */
switchContent(0);

// Append our box to the screen.
screen.append(topbox);
screen.append(bottombox);
screen.append(midbox);

// If our box is clicked, change the content.
topbox.on('click', function(data) {
  say.speak(spanishVoice,topbox.phrase);
});

bottombox.on('click', function(data) {
  say.speak(englishVoice, bottombox.phrase);
});

midbox.on('click', function(data) {
  say.speak(tseltalVoice, midbox.phrase);
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
