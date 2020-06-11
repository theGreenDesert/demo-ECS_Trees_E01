//! создание узла (карточки) 🐰

function ECSNode(data) {
    this.data = data; // содержит данные, связанные с узлом
    this.parent = null; // указывает на один отцовский узел
    this.children = []; // указывает на множество дочерних узлов
    this.tier = null; // указывает на ярус дерева на котором находится узел
    this.id = null; // айди узла
}

//! создание корня дерева 🐢

function ECSTree(data) {
    var node = new ECSNode(data);
    this._root = node; // назначает node как корень дерева
}

//todo --------------------🍌------

//! обход дерева с поиском в глубину

ECSTree.prototype.walkDepthFirst = function(callback) { 
    (function recurse(currentNode) {
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(currentNode.children[i]);
        }
        callback(currentNode);
    })(this._root); 
};

//! обход дерева с поиском в ширину

ECSTree.prototype.walkBreadthFirst = function(callback) {    
    class Queue {
        constructor() {
            this.records = [];
        }
        enqueue(record) {
            this.records.unshift(record); // добавляет элемент в начало массива
        }
        dequeue() {
            return this.records.pop(); // удаляет последний элемент из массива и возвращает его
        }
    }
    var queue = new Queue();     
    queue.enqueue(this._root); 
    currentNode = queue.dequeue(); 
    while(currentNode){
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            queue.enqueue(currentNode.children[i]);
        } 
        callback(currentNode);
        currentNode = queue.dequeue();
    }
};

//! поиск конкретного значения в нашем дереве

ECSTree.prototype.search = function(callback, walkMethod) {
    walkMethod.call(this, callback);
};

//! добавление новой карточки к определенному узлу дерева

ECSTree.prototype.add = function(toId, walkMethod, id, data) {
    var child = new ECSNode(data),
        parent = null,
        callback = function(node) {
            if (node.id === toId) {
                parent = node;
            }
        }; 
    this.search(callback, walkMethod); 
    if (parent) {
        parent.children.push(child);
        child.parent = parent;
        child.tier = parent.tier + 1;
        child.id = id + 1;
    } else {
        throw new Error('Cannot add node to a non-existent parent 💔');
    }
};

//! удаление узла и всех его дочерних элементов

ECSTree.prototype.remove = function(id, fromId, walkMethod) {
    var tree = this, //todo ? tree не используется
        parent = null,
        childToRemove = null,
        index; 
    var callback = function(node) {
        if (node.id === fromId) {
            parent = node;
        }
    }; 
    this.search(callback, walkMethod); 
    if (parent) {
        index = findIndex(parent.children, id); 
        if (index === undefined) {
            throw new Error('Node to remove does not exist 💔');
        } else {
            childToRemove = parent.children.splice(index, 1); //TODO почитать про .splice
        }
    } else {
        throw new Error('Parent does not exist 💔');
    } 
    return childToRemove;
};

function findIndex(arr, id) {
    var index; 
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            index = i;
        }
    } 
    return index;
}

//todo --------------------🍌------

//! количество всех узлов

function allNodes(tree) {
    var i = 0;
    tree.walkBreadthFirst(function (node) {
        i++;
    });
    return i;
}

//! количество ярусов дерева

function allTiers(tree) {
    var i = 0;
    tree.walkBreadthFirst(function (node) {
        if (i < node.tier) {
            i = node.tier;
        }
    });
    return i;
}

//! количество "хвостов" у дерева

function allTails(tree) {
    var i = 0;
    tree.walkBreadthFirst(function (node) {
        if (node.children.length === 0) {
            i++;
        }
    });
    return i;
}

//! массив количества дочерних узлов у всех карточек

function arrChildrens(tree) {
    var arr =[];
    tree.walkBreadthFirst(function (node) {
        arr.push(node.children.length);
    });
    return arr;
}

//! массив айди всех карточек (🍌)

function arrIDs(tree) {
    var arr =[];
    tree.walkBreadthFirst(function (node) {
        arr.push(node.id);
    });
    return arr;
}

//! поиск "предыдущего" айди (🍌)

function searchId(arr) {
    arr.sort((a, b) => (a - b));
    for (let i = 0; i < arr.length; i++) {
        if (arr[i+1] - arr[i] !== 1) {
            return arr[i];
        }
    }
    return arr.length;
}

//todo --------------------🍌------

//! вывод сегоднешней даты и времени

function addTodayData() {    
    const dateElement = document.querySelector("#date");
    const options = {weekday : "long", month:"long", day:"numeric", hour:"numeric", minute:"numeric"};
    const today = new Date();
    dateElement.innerHTML = today.toLocaleDateString("en-US", options);
}

//! создание списка из объекта

function createList(tree) {
        
    tree.walkBreadthFirst(function (node) {

        let treeroot = document.querySelector('#treeroot');
        if (node.parent !== null) {
            if (node.parent.id < 10) {
                treeroot = document.querySelector("#\\3" + node.parent.id + " > .parent");
            }
            else if (node.parent.id < 100) {
                treeroot = document.querySelector("#\\3" + (node.parent.id - node.parent.id%10)/10 + "\\3" + node.parent.id%10 + " > .parent");
            }
            else { 
                treeroot = document.querySelector("#treebox");
            }
        }
        //
        let li = document.createElement('li');
        li.className = "node";
        li.id = node.id;

        let div_form = document.createElement('div');
        div_form.className = "node-form";

        let span_del = document.createElement('span');
        if (node.parent !== null) {
            span_del.className = "node-del";
            span_del.innerHTML = "-";
        }
        let div_data = document.createElement('div');
        div_data.className = "node-form-data";
        div_data.innerHTML = node.data;

        let span_add = document.createElement('span');
        span_add.className = "node-add";
        span_add.innerHTML = "+";

        let ol = document.createElement('ol');
        ol.className = "parent";
        
        div_form.append(span_del);
        div_form.append(div_data);
        div_form.append(span_add);

        li.append(div_form);        
        li.append(ol);
        
        treeroot.append(li);

        // let liAdd = `
        // <li class="node" id="${node.id}">
        //     <div class="node-form">
        //         <span class="node-del">-</span><div class="node-form-data">${node.data}</div><span class="node-add">+</span>
        //     </div><ol class="parent"></ol>
        // </li>
        // `;

        // treeroot.innerHTML += liAdd;

    });

    //? console.log(arrIDs(tree));
    
}

//! создание обработчика для кнопки "+"

function buttonAdd(tree) {

    tree.walkBreadthFirst(function (node) {

        let btn_add;
        if (node.id < 10) {
            btn_add = document.querySelector("#\\3" + node.id + " > .node-form > .node-add");
        }
        else if (node.id < 100) {
            btn_add = document.querySelector("#\\3" + (node.id - node.id % 10) / 10 + "\\3" + node.id % 10 + " > .node-form > .node-add");
        }
        else {
            btn_add = document.querySelector("#\\3" + (node.id - node.id % 100) / 100 + "\\3" + (node.id % 100 - node.id % 10) / 10 + "\\3" + node.id % 10 + " > .node-form > .node-add");
        }

        let node_id = node.id;
        
        btn_add.addEventListener("click", () => listAdd(tree, node_id));

    });
}

function listAdd(tree, node_id) {

    let new_data = prompt('what do you need?', 'eight');

    let new_id = searchId(arrIDs(tree));
    tree.add(node_id, tree.walkBreadthFirst, new_id, new_data);
    

    let treeroot;
    if (node_id < 10) {
        treeroot = document.querySelector("#\\3" + node_id + " > .parent");
    }
    else if (node_id < 100) {
        treeroot = document.querySelector("#\\3" + (node_id - node_id % 10)/10 + "\\3" + node_id % 10 + " > .parent");
    }
    else { 
        treeroot = document.querySelector("#\\3" + (node_id - node_id % 100) / 100 + "\\3" + (node_id % 100 - node_id % 10) / 10 + "\\3" + node_id % 10 + " > .parent");
    }

    let li = document.createElement('li');
    li.className = "node";
    li.id = new_id + 1;
    
    let div_form = document.createElement('div');
    div_form.className = "node-form";
    
    let span_del = document.createElement('span');
    span_del.className = "node-del";
    span_del.innerHTML = "-";
    
    let div_data = document.createElement('div');
    div_data.className = "node-form-data";
    div_data.innerHTML = new_data;

    let span_add = document.createElement('span');
    span_add.className = "node-add";
    span_add.innerHTML = "+";

    let ol = document.createElement('ol');
    ol.className = "parent";

    div_form.append(span_del);
    div_form.append(div_data);
    div_form.append(span_add);

    li.append(div_form);        
    li.append(ol);

    treeroot.append(li);

    // let liAdd = `
    //     <li class="node" id="${searchId(arrIDs(tree))}">
    //         <div class="node-form">
    //             <span class="node-del">-</span><div class="node-form-data">${new_data}</div><span class="node-add">+</span>
    //         </div><ol class="parent"></ol>
    //     </li>
    //     `;

    //     treeroot.innerHTML += liAdd;

    span_add.addEventListener("click", () => listAdd(tree, new_id + 1));
    
    span_del.addEventListener("click", () => listDel(tree, new_id + 1, node_id));

    //? console.log(arrIDs(tree));

}

//! создание обработчика для кнопки "-"

function buttonDel(tree) {

    tree.walkBreadthFirst(function (node) {
        
        if (node.parent !== null) {
            let btn_del;
            if (node.id < 10) {
                btn_del = document.querySelector("#\\3" + node.id  + " > .node-form > .node-del");
            }
            else if (node.id < 100) {
                btn_del = document.querySelector("#\\3" + (node.id - node.id % 10) / 10 + "\\3" + node.id % 10 + " > .node-form > .node-del");
            }
            else {
                btn_del = document.querySelector("#\\3" + (node.id - node.id % 100) / 100 + "\\3" + (node.id % 100 - node.id % 10) / 10 + "\\3" + node.id % 10 + " > .node-form > .node-del");
            }
            btn_del.addEventListener("click", () => listDel(tree, node.id, node.parent.id));

        }
    });
}

function listDel(tree, node_id, parent_id) {
    
    tree.remove(node_id, parent_id, tree.walkBreadthFirst);

    let liDel;
    if (node_id < 10) {
        liDel = document.querySelector("#\\3" + node_id);
    }
    else if (node_id < 100) {
        liDel = document.querySelector("#\\3" + (node_id - node_id % 10) / 10 + "\\3" + node_id % 10);
    }
    else {
        liDel = document.querySelector("#\\3" + (node_id - node_id % 100) / 100 + "\\3" + (node_id % 100 - node_id % 10) / 10 + "\\3" + node_id % 10);
    }
    liDel.parentNode.removeChild(liDel);

    //? console.log(arrIDs(tree));
    
}

//! END
