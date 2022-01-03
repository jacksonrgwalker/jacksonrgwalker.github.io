var canvas;
var context;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint = false;
var curColor = "#ffcc00";

/**
    - Preparing the Canvas : Basic functions
**/
function drawCanvas() {

    canvas = document.getElementById('canvas');
    context = document.getElementById('canvas').getContext("2d");

    canvas.addEventListener("touchstart",  function(event) {event.preventDefault()})
    canvas.addEventListener("touchmove",   function(event) {event.preventDefault()})
    canvas.addEventListener("touchend",    function(event) {event.preventDefault()})
    canvas.addEventListener("touchcancel", function(event) {event.preventDefault()})

    $('#canvas').bind('mousedown touchstart', function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    });

    $('#canvas').bind('mousemove touchmove', function (e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });

    $('#canvas').bind('mouseup touchend', function (e) {
        paint = false;
    });
}

/**
    - Saves the click postition
**/
function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

/**
    - Clear the canvas and redraw
**/
function redraw() {

    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.strokeStyle = curColor;
    context.lineJoin = "round";
    context.lineWidth = 25;

for (var i = 0; i < clickX.length; i++) {
    context.beginPath();
    if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
        context.moveTo(clickX[i] - 1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
}
}

/**
    - Encodes the image into a base 64 string.
    - Add the string to an hidden tag of the form so Flask can reach it.
**/
function save() {
    var image = new Image();
    var url = document.getElementById('url');
    image.id = "pic";
    image.src = canvas.toDataURL();
    url.value = image.src;
}
