
function clearDrawingAndPrediction() {

    // Clear the drawing
    drawing.clearDrawing()

    // Clear the prediction
    window.scores = Array(10).fill(0)
    updatePlot();
}

function getModelInput() {

    let drawingArray = drawing.getDrawingValues(28, 28)

    let modelInput = [tf.tensor(drawingArray).reshape([1, 28, 28, 1])]

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