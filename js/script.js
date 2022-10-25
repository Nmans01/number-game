(function () {
    "use strict";

    let queue;
    let stack;
    let stupidThing;
    let shapes;
    let round;
    let connectIndicator;
    let connectWrapper;

    window.addEventListener('load',init);

    function init () {
        queue = document.getElementById('queue').children;
        stack = document.getElementById('stack');
        stupidThing = document.getElementById('stack').cloneNode(true);
        shapes = stupidThing.children;

        round = 0;

        connectIndicator = document.getElementById('connectIndicator')
        connectIndicator.remove();
        connectWrapper = {'shapes':[],'sum':0}; // "its just a list"


        stack.innerHTML = '';

        window.addEventListener('keydown',onKeydown);
        window.addEventListener('mousedown',onMousedown);
        window.addEventListener('contextmenu',e => e.preventDefault()); //disable rightclick menu
    }

    function onKeydown (e) {
        e.preventDefault();
        // console.log(e.key);
        switch (e.key) {
            case 'ArrowUp':
                bottomToTop();
                drop();
                break;
            case 'ArrowDown':
                topToBottom();
                drop();
                break;
            case ' ':
                drop();
                break;
            case 'ArrowRight':
                break;
        }
    }
    function onMousedown (e) {
        e.preventDefault();
        let shape = shapeTargeted(e.target);
        if (shape && e.button == 0 && connectWrapper.sum == 0) {
            
            let stackArray = Array.from(stack.children);
            let startIndex = stackArray.indexOf(shape);
            let endIndex;
            let maxIndex;
            let minIndex;
            let sum;

            let connect = function (e) {
                let shape = shapeTargeted(e.target);
                if (!shape) return;

                endIndex = stackArray.indexOf(shape);

                maxIndex = Math.max(startIndex,endIndex);
                minIndex = Math.min(startIndex,endIndex);

                sum = 0;
                for (let i=0; i<stack.children.length; i++) {
                    if (minIndex <= i && i <= maxIndex) {
                        stackArray[i].classList.add('connected');
                        sum += parseInt(stackArray[i].children[0].innerText);
                    } else {
                        stackArray[i].classList.remove('connected');
                    }
                }
                
                stackArray[minIndex].appendChild(connectIndicator);
                connectIndicator.innerText=sum;
            };

            window.addEventListener('mouseover', connect);

            window.addEventListener('mouseup', (e) => {
                window.removeEventListener('mouseover', connect);
                console.log(minIndex+" "+maxIndex);
                if (minIndex!=maxIndex) {
                    connectWrapper.shapes = stackArray.slice(minIndex,maxIndex+1);
                    connectWrapper.sum = sum;
                    update();
                } else {
                    stackArray.forEach(a => a.classList.remove('connected'));
                    connectIndicator.remove();
                }
            });
        }
    }
    function shapeTargeted (t) {
        while (t.parentNode!=stack) {
            if (t.parentNode==document)
                return null;
            t=t.parentNode;
        }
        return t;
    }

    function drop() {
        let shape=queue[0].children[0];
        // console.log(shape);
        stack.appendChild(queue[0].removeChild(shape));
        shape = shape=queue[1].children[0];
        queue[0].appendChild(shape);
        queue[1].appendChild(getNew());
        update();
        round++;
        console.log("round: " + round);
    }
    function topToBottom() {
        let top = stack.children[stack.children.length-1];
        stack.insertBefore(top,stack.children[0]);
    }
    function bottomToTop() {
        let bottom = stack.children[0];
        stack.appendChild(bottom);
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
        let weirdified = [];
        for (let i=0; i<stack.children.length; i++) {
            let a = stack.children[i];
            if (a.classList.contains('connected')) {
                weirdified.push(connectWrapper);
                i+=connectWrapper.shapes.length-1;
            } else {
                weirdified.push({'shapes':[a],'sum':parseInt(a.children[0].innerText)});
            }
        }

        console.log(weirdified);
        for (let i=0; i<weirdified.length-1; i++) {
            let a = weirdified[i];
            let b = weirdified[i+1];

            // make b the connectWrapper if there is one
            if (a.shapes.length>b.shapes.length) {
                let c = a;
                a = b;
                b = c;
            }

            if (a.sum == b.sum) {

                a.shapes[0].children[0].innerText = a.sum + b.sum;
                b.shapes.forEach(shape => stack.removeChild(shape));
                b.shapes = [];
                b.sum = 0;
                update(); // check through the whole stack again
                return;
            }
        }
    }
})();