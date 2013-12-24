var blessed = require('blessed'),
  screen = blessed.screen(),
  _ = require('underscore'),
  say = require('say'),
  fs = require('fs');

function init() {
  var voices = ['Samantha','Paulina','Paulina'],
  languages = ['english','spanish','tseltal'],
  story = JSON.parse(fs.readFileSync('lib/resources/phrases.json', 'utf8')),
  counter = 0, boxes = [];

  function createBox(top, foreground, background, hover) {
    return blessed.box({
      top: top,
      left: 'center',
      width: '80%',
      height: '33%',
      border: {
        type: 'line',
        fg: '#ffffff'
      },
      fg: foreground,
      bg: background,
      tags: true,
      hoverEffects: {
        bg: hover 
      }
    });
  }

  boxes.push(createBox('0%','red','blue','white'));
  boxes.push(createBox('33%','red','yellow','black'));
  boxes.push(createBox('66%','white','magenta','green'));
  _.each(boxes, function(box) {
    screen.append(box);
  });

  function switchContent(c) {
    if (c > story.phrases.length - 1 || c < 0) {
      c = 0; counter = 0;
    }
    _.each(boxes,function(element, index) {
      element.setContent('{center}' + story.phrases[c][index]);
      element.phrase = (story.phrases[c][index]);
    });
    screen.render();
  }

  _.each(boxes,function(box, index) {
    box.on('click', function(data) {
      say.speak(voices[index],boxes[index].phrase);
    });
  });

  screen.key(['space','right','return'], function(ch, key) {
    switchContent(++counter);
    screen.render();
  });

  screen.key(['left'], function(ch, key) {
    switchContent(--counter);
    screen.render();
  });

  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  // Focus our element.
  boxes[0].focus();
  switchContent(0);
}

init();
screen.render();
