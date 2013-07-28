var fs = require('fs');

/* Load the phrases file into memory */
var arr = JSON.parse(fs.readFileSync('test/resources/phrases.json', 'utf8'));
var counter = 1;

console.log(arr.phrases[0]);