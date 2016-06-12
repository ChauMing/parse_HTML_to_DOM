# HTMLtree

parsing a html string to DOM (Document Object Model);

parsing html string like a DOM;


```js
let html = `
<div id="container">
    <div class="list">
        <a href="http://giantming.net">
            <img src="xxx.jpg">
        </a>
    </div>
    <div class="list">
        <a href="http://giantming.net">
            <img src="xxx.jpg">
        </a>
    </div>
    <div class="list">
        <a href="http://giantming.net">
            <img src="xxx.jpg">
        </a>
    </div>
</div>



`;
var htmlparse = require('index');

document = htmlparse(html);

document.getElementsByTagName('div');

document.getElementsByClassName('list');

document.getElementById('id');




```