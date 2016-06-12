'use strict';

const parseHTML = require('../index');
const fs = require('fs');

let html = fs.readFileSync('./test.html').toString();






console.time('time');
let document = parseHTML(html);
console.timeEnd('time');

let list = document.getElementsByClassName('list');



list.forEach(item=>console.log('\n'+item.innerHTML));

