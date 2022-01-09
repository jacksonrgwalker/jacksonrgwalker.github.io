var canvas;
var context;

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();

function drawCanvas() {

    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");

    context.strokeStyle = "#ffcc00";
    context.lineJoin = "round";
    context.lineWidth = 25;

    canvas.addEventListener("touchstart", function (event) { event.preventDefault() })
    canvas.addEventListener("touchmove", function (event) { event.preventDefault() })
    canvas.addEventListener("touchend", function (event) { event.preventDefault() })
    canvas.addEventListener("touchcancel", function (event) { event.preventDefault() })
    canvas.addEventListener("mousedown", function (event) { event.preventDefault() })


    window.addEventListener('mousedown', beginDrawingPath)
    window.addEventListener('touchstart', beginDrawingPath)

    window.addEventListener('mouseup', endDrawingPath)
    window.addEventListener('touchend', endDrawingPath)

}

function endDrawingPath() {

    canvas.removeEventListener("mousemove", dragAndDraw);
    canvas.removeEventListener("touchmove", dragAndDraw);

    canvas.removeEventListener("mousemove", getPrediction);
    canvas.removeEventListener("touchmove", getPrediction);

}

function beginDrawingPath(event) {

    //  begining of path, we are not dragging (yet)
    addClick(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, false);

    // while drawing, we want to get predictions for the number
    canvas.addEventListener("mousemove", dragAndDraw);
    canvas.addEventListener("touchmove", dragAndDraw);

    canvas.addEventListener("mousemove", getPrediction);
    canvas.addEventListener("touchmove", getPrediction);

}

function dragAndDraw(event) {
    addClick(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, true);
    drawLastPath();
}

function addClick(x, y, dragging) {

    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);

}

function drawLastPath() {

    context.beginPath();

    var i = clickX.length-1

    if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
        context.moveTo(clickX[i], clickY[i]);
    }

    context.lineTo(clickX[i], clickY[i]);

    context.closePath();
    context.stroke();
}

function clearCanvas() {

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    updatePredictionText()

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

        // console.log(scores)
        // console.log(prediction)
    });
}

function updatePredictionText(prediction) {
    var predictionTextElement = document.getElementById("predictionText");
    if (Number.isInteger(prediction)) {
        predictionTextElement.textContent = `you drew the number ${prediction}`;
    }
    else {
        predictionTextElement.textContent = null
    }
}

