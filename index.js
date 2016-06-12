'use strict';

var html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Document</title>
                </head>
                <body>
                    <header>
                        <img id="logo" src="xxx.jpg">
                        <nav class="nav"></nav>
                    </header>
                     <!-- hell     -->
                    <section>
                        <div class="container">
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
                                    <br>
                                    <img src="xxx.jpg">
                                </a>
                            </div>
                        </div>
                    </section>
                    <footer>
                        <p class="info"></p>
                        <p class="info"></p>
                        <p class="info"></p>
                        <p class="info"></p>
                    </footer>
                </body>
                </html>`;



let tagReg = /<(\/?[a-z]+).*?>/g;
let tag = '';
let treeArr = [];
while (tag = tagReg.exec(html)) {
    let obj = {
        tag: tag[0],
        tagName: tag[1],
        pos: tagReg.lastIndex,
        length:  tag[0].length,
    }
    treeArr.push(obj);
}


const isSingleTag = (tagName) => ['img', 'input', 'br', 'meta'].some((item)=>item===tagName);
const isCloseTag = (tagName) => /\//.test(tagName);
const isPrevTag = (tagName)=> !/\//.test(tagName);


function Node(info) {
    this.prevTag = info.tag;       // 开始标签 <div class="container"> 酱紫
    this.tagName = info.tagName;   // 标签名  div, span  any more...

    this.closeTag = null;                 // 闭合标签  </div>  </span>酱紫
    this.childrens = null;                  // 子元素,  叶子,子树

    this.selfStartPos = info.pos - info.tag.length;                       // 自己的完整标签开始  包含开始标签开始位置
    this.selfEndPos;                         // 自己的完整标签结束  包含结束标签的结束位置
    this.innerHTMLStartPos = info.pos;       // innerHTML的开始位置
    this.innerHTMLEndPos = 0;                // innerHTML的结束位置

    this.parent = info.parent;               // 父元素

    this.innerHTML = '';
    this.selfHTML = '';
}




Node.prototype = {
    constrctor: 'Node',
    close: function(info) {
        this.selfEndPos = info.pos;
        this.innerHtmlEndPos = info.pos - info.tag.length;


        this.innerHtmlEndPos = info.pos;
        this.innerHTML = html.slice(this.innerHTMLStartPos, this.innerHTMLEndPos);

        this.selfHTML = html.slice(this.selfStartPos, this.selfEndPos);

        this.closeTag = info.tag;

        // console.log('tagName: '+this.tagName)

        // console.log('innerHtmlStartPos: '+ this.innerHtmlStartPos);
        // console.log('innerHtmlEndPos: '+ this.innerHtmlEndPos);
        // console.log('innerHTML: ' + this.innerHTML);
    },
    appendChild: function(child) {
        if(child.constrctor !== 'Node') {
            console.error("node must be a Node instance");
        }
        if(!Array.isArray(this.childrens)) {
            this.childrens = [];
        }
        child.index = this.childrens.length;
        this.childrens.push(child);
    }

}

var rootNode = new Node({
    tagName: 'root',
    pos: 0,
    tag: '',
    parent: null
});

let parentPointer = rootNode;

treeArr.forEach(function(tag) {
    // console.log(tag);/
    if(isSingleTag(tag.tagName)) {
        let node = new Node(tag);
        parentPointer.appendChild(node);
    } else if (isCloseTag(tag.tagName)) {
        parentPointer.close(tag);
        parentPointer = parentPointer.parent;
    } else {
        tag.parent = parentPointer;
        let node = new Node(tag);
        parentPointer.appendChild(node);
        parentPointer = node;
        
    }

});


// console.log(rootNode);

function prevLoop(root) {
    console.log(root.tagName);
    if (root.childrens === null) {
        return;
    }
    root.childrens.forEach(function(item) {
        prevLoop(item);
    });
}

prevLoop(rootNode);


console.log(rootNode);