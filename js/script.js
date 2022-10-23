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
        // console.log(shape);
        stack.appendChild(queue[0].removeChild(shape));
        shape = shape=queue[1].children[0];
        queue[0].appendChild(shape);
        queue[1].appendChild(getNew());
        update();
    }

    function getNew () {
        let x = Math.random();
        let i = Math.floor( curve(sigmoid(round/10)*x) *shapes.length);
        return(shapes[i].cloneNode(true));
    }
    function sigmoid(z) { // Adjust probability curve based on round
        return 1 / (1 + Math.exp(-z));
    }
    function curve(z) { // Control probability of generated numbers
        return (Math.pow(z,4)+Math.pow(z,3)+z)/3;
    }

    function update () {
        for (let i=0; i<stack.children.length-1; i++) {
            // console.log("doot");
            let a = stack.children[i];
            let b = stack.children[i+1];
            if (a.children[0].innerText == b.children[0].innerText) {
                a.children[0].innerText = parseInt(a.children[0].innerText) + parseInt(b.children[0].innerText);
                stack.removeChild(b);
                i=0; // check through the whole stack again
            }
        }

        round++;
        console.log("round: " + round);
    }
})();