(function () {
    "use strict";

    let queue;
    let stack;
    let stupidThing;
    let shapes;
    let round;

    window.addEventListener('load',init);

    function init () {
        queue = document.getElementById('queue').children;
        stack = document.getElementById('stack');
        stupidThing = document.getElementById('stack').cloneNode(true);
        shapes = stupidThing.children;

        round = 0;

        stack.innerHTML = '';

        window.addEventListener('keydown',onKeydown);
    }

    function onKeydown (e) {
        e.preventDefault();
        // console.log(e.key);
        switch (e.key) {
            case 'ArrowUp':
                break;
            case 'ArrowDown':
                break;
            case ' ':
                drop();
                break;
            case 'ArrowRight':
                break;
        }
    }

    function drop() {
        let shape=queue[0].children[0];
        if (shape==undefined)
            return;
        // console.log(shape);
        stack.appendChild(queue[0].removeChild(shape));
        shape = shape=queue[1].children[0];
        if (shape==undefined)
            return;
        queue[0].appendChild(shape);
        queue[1].appendChild(getNew());
        update();
    }

    function getNew () {
        let x = Math.random();
        let i = Math.floor( curve(sigmoid(round/10)*x) *shapes.length);
        return(shapes[i].cloneNode(true));
    }
    function sigmoid(z) {
        return 1 / (1 + Math.exp(-z));
    }
    function curve(z) {
        return (Math.pow(z,4)+Math.pow(z,3)+z)/3;
    }

    function update () {
        
        round+=1;
        console.log("round: " + round);
    }
})();