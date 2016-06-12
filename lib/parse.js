'use strict';

const isSingleTag = (tagName) => ['img', 'input', 'br', 'meta'].some((item)=>item===tagName);  // 判断是否是单标签
const isCloseTag = (tagName) => /\//.test(tagName);                                            // 判断是否是闭合标签


const inumerable = (obj, attr) => Object.defineProperty(obj, attr, {enumerable: false,configurable: true,writable: true,});

/**
 * Class Node
 */
function Node(info) {
    inumerable(this, '_prevTag');
    inumerable(this, '_closeTag');
    inumerable(this, '_selfStartPos');
    inumerable(this, '_selfEndPos');
    inumerable(this, '_innerHTMLStartPos');
    inumerable(this, '_innerHTMLEndPos');
    inumerable(this, '_selfHTML');
    inumerable(this, '_attributes');


    this._prevTag = info.tag;       // 开始标签 <div class="container"> 酱紫
    this.tagName = info.tagName;   // 标签名  div, span  any more...

    this._closeTag = null;                 // 闭合标签  </div>  </span>酱紫
    this.childrens = null;                  // 子元素,  叶子,子树

    this._selfStartPos = info.pos - info.tag.length;                       // 自己的完整标签开始  包含开始标签开始位置
    this._selfEndPos;                         // 自己的完整标签结束  包含结束标签的结束位置
    this._innerHTMLStartPos = info.pos;       // innerHTML的开始位置
    this._innerHTMLEndPos = 0;                // innerHTML的结束位置

    this.parent = info.parent;               // 父元素

    this.innerHTML = '';
    this._selfHTML = '';

    this._attributes = {};
    let nodeSelf = this;

    let reg  = /<[a-z]+\s([^>]+)?>/g;

    let att = reg.exec(this._prevTag)
    if (att !== null) {
        let attStr = att[1].trim();
        let attArr = attStr.split(' ');
        
        attArr.forEach(function(item, index) {
            let fuck = item.split('=');
            let attr = fuck[0];
            let value = fuck[1];
            nodeSelf._attributes[attr] = value ? value.replace(/"/g, '') : '';
        });
    }
}

Node.prototype = {
    constrctor: 'Node',
    _close: function(info) {
        this._selfEndPos = info.pos;
        this._innerHTMLEndPos = info.pos - info.tag.length;


        this.innerHTML = Node.html.slice(this._innerHTMLStartPos, this._innerHTMLEndPos);
        this._selfHTML = Node.html.slice(this._selfStartPos, this._selfEndPos);
        // console.log('info ' + info.tag.length);
        // console.log('tagNameL: '+ this.tagName);
        // console.log('_innerHTMLStartPos: ' + this._innerHTMLStartPos);
        // console.log('_innerHTMLEndPos  ' + this._innerHTMLEndPos);
        // console.log('_selfStartPos: '+ this._selfStartPos);
        // console.log('_selfEndPos: '+ this._selfEndPos);
        // console.log('Node.html: '+ Node.html.slice(this._innerHTMLStartPos, this._innerHTMLEndPos));
        // console.log('_selfHTML: '+ this._selfHTML);
        this._closeTag = info.tag;

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
    },
    getElementById: function (id) {
        let obj = {};
        function prevLoop(node) {
            if(node._attributes['id'] === id) obj = node;
            if(node.childrens === null) return;
            node.childrens.forEach((item)=>{
                prevLoop(item);
            });
        }
        prevLoop(this);
        return obj;
    },
    getElementsByClassName: function(names) {
        let objArr = [];
        function prevLoop(node) {
            if(node._attributes['class'] === names) {
                objArr.push(node);
            };
            if(node.childrens === null) return;
            node.childrens.forEach((item)=>{
                prevLoop(item);
            });
        }
        prevLoop(this);
        return objArr;
    },
    getElementsByTagName: function(name) {
        let objArr = [];
        function prevLoop(node) {
            if(node.tagName.toLowerCase() === name.toLowerCase()) {
                objArr.push(node);
            };
            if(node.childrens === null) return;
            node.childrens.forEach((item)=>{
                prevLoop(item);
            });
        }
        prevLoop(this);
        return objArr;
    }

}


function parseHTML(html) {
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


    Node.html = html;
    var rootNode = new Node({
        tagName: 'root',
        pos: 0,
        tag: '',
        parent: null
    });

    let parentPointer = rootNode;



    treeArr.forEach(function(tag) {
        if(isSingleTag(tag.tagName)) {
            let node = new Node(tag);
            parentPointer.appendChild(node);
        } else if (isCloseTag(tag.tagName)) {
            parentPointer._close(tag);
            parentPointer = parentPointer.parent;
        } else {
            tag.parent = parentPointer;
            let node = new Node(tag);
            parentPointer.appendChild(node);
            parentPointer = node;
            
        }
    });


    return rootNode;
}

module.exports = parseHTML;