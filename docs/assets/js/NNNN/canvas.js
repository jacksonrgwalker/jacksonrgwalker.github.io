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

    canvas.addEventListener('mousedown', beginDrawingPath)
    canvas.addEventListener('touchstart', beginDrawingPath)

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

    canvas.addEventListener("mousemove", updatePlot);
    canvas.addEventListener("touchmove", updatePlot);


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

    var i = clickX.length - 1

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

    context.clearRect(0, 0, canvas.width, canvas.height);

    updatePredictionText()

    window.scores = Array(10).fill(0)
    updatePlot();

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

    let resizedContext = getResizeCanvas();
    let resizedData = getImageData(resizedContext);
    let drawingArray = parseImageData(resizedData);
    let reshapedArray = reshapeParsedImageData(drawingArray);
    let modelInput = [tf.tensor(reshapedArray).reshape([1, 28, 28, 1])]

    return modelInput
}


function getPrediction(updateText = true) {

    modelInput = getModelInput()

    if (window.model) {
        window.model.predict(modelInput).array().then(function (scores) {

            scores = scores[0];
            window.scores = scores

            prediction = scores.indexOf(Math.max(...scores));
            if (updateText) updatePredictionText(prediction);

        });
    }
    else console.log("Model not ready to predict yet")
}

function updatePredictionText(prediction) {
    var predictionTextElement = document.getElementById("predictionText");
    if (Number.isInteger(prediction)) {
        predictionTextElement.textContent = `you drew the number ${prediction}`;
        predictionTextElement.style.visibility = 'visible';
    }
    else {
        predictionTextElement.style.visibility = 'hidden';
    }
}

function addNoise() {


    for (let i = 0; i < canvas.width; i++) {

        for (let j = 0; j < canvas.width; j++) {

            let thresh = (i * j) ** 2 % i
            if (Math.random() < thresh) continue

            opacity = Math.random();
            context.fillStyle = `rgba(255, 204, 0, ${opacity})`;
            context.fillRect(i, j, 1, 1)
        }
    };
    getPrediction();
    updatePlot();
}


function getAllLayerOutput() {

    modelInput = getModelInput()

    if (!window.model) return

    model_input = getModelInput()

    let layer_outputs = [model_input]

    let layer_outputs_awaited = [] 

    // skip 0th layer, it is a tfjs input layer, I think
    for (let layer_num = 1; layer_num < window.model.layers.length; layer_num++) {

        let layer = window.model.layers[layer_num]
        let layer_output = layer.apply(layer_outputs[layer_num - 1])
        layer_outputs.push(layer_output);

        layer_output.array().then(function (layer_output_array) {
            layer_outputs_awaited.push({
                name: layer.name,
                data: layer_output_array[0],
                shape: layer_output.shape.slice(1)
            })
        })

    }

    window.layer_outputs = layer_outputs_awaited

    return layer_outputs_awaited


}


async function getConvVisuals(layerIndex, canvasElem){

    if (!window.layer_outputs) getAllLayerOutput()

    const single_conv = tf.slice(window.layer_outputs[layerIndex].data, [0, 0, 0], [28, 28, 1])

    const resized = tf.tidy(() => tf.image.resizeNearestNeighbor(single_conv, [28,28]).clipByValue(0.0, 1.0));

    await tf.browser.toPixels(resized, canvasElem); 

} 