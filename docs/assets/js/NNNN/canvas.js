var canvas;
var context;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint = false;
var curColor = "#ffcc00";

function drawCanvas() {

    canvas = document.getElementById('canvas');
    context = document.getElementById('canvas').getContext("2d");

    canvas.addEventListener("touchstart", function (event) { event.preventDefault() })
    canvas.addEventListener("touchmove", function (event) { event.preventDefault() })
    canvas.addEventListener("touchend", function (event) { event.preventDefault() })
    canvas.addEventListener("touchcancel", function (event) { event.preventDefault() })

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

    // canvas.addEventListener("mousedown", function(e){
    //     this.addEventListener("mousemove", getPrediction);
    // });
    
    // canvas.addEventListener("mouseup", function(e){
    //     this.removeEventListener("mousemove", getPrediction);
    // });

    canvas.addEventListener('mousemove', getPrediction);
    canvas.addEventListener('touchmove', getPrediction);

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

    // context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
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

// Clears the canvas to be blank
function clearCanvas() {

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
}

function getResizeCanvas() {

    var canvas_element = document.getElementById("canvas");
    var resizedCanvas = document.createElement("canvas");
    var resizedContext = resizedCanvas.getContext("2d");
    resizedContext.drawImage(canvas_element, 0, 0, 28, 28);

    return resizedContext

}

function getImageData(resizedContext) {

    resizedData = resizedContext.getImageData(0, 0, 28, 28)

    return resizedData
}


function parseImageData(resizedData) {

    let pixels = resizedData.data;
    let drawingArray = []
    for (var i = 0; i < pixels.length; i += 4) {
        drawingArray.push([(pixels[i] | pixels[i + 1] | pixels[i + 2]) / 255])
    }

    return drawingArray
}

function reshapeParsedImageData(drawingArray) {

    const reshapedArray = [];
    while (drawingArray.length) reshapedArray.push(drawingArray.splice(0, 28));

    return reshapedArray
}


function getModelInput() {

    var resizedContext = getResizeCanvas();
    var resizedData = getImageData(resizedContext);
    var drawingArray = parseImageData(resizedData);
    var reshapedArray = reshapeParsedImageData(drawingArray);

    return reshapedArray
}


function getPrediction() {

    modelInput = getModelInput()
    window.model.predict([tf.tensor(modelInput).reshape([1, 28, 28, 1])]).array().then(function (scores) {
        scores = scores[0];
        prediction = scores.indexOf(Math.max(...scores));
        updatePredictionText(prediction);

        console.log(scores)
        console.log(prediction)
    });
}

function updatePredictionText(prediction){
    var predictionTextElement = document.getElementById("predictionText");
    // predictionTextElement.textContent = prediction;
    predictionTextElement.textContent = `you drew the number ${prediction}`;
}
