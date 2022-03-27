// TODO:
// - only predict once per draw event, feed input through all layers and capture each layer's output so they can also be visualized
// - more performance testing
// - add func to clearn convolution canvases, add it too the clearDrawingAndPrediction func

function clearDrawingAndPrediction() {

    // Clear the drawing
    drawing.clearDrawing()

    // Clear the prediction
    window.scores = Array(10).fill(0)
    updatePlot();

    clearConvDrawings()
    updatePredictionText(null)
}

function getModelInput() {

    let drawingArray = drawing.getDrawingValues(28, 28)

    let modelInput = [tf.tensor(drawingArray).reshape([1, 28, 28, 1])]

    return modelInput
}

function initializeConvolutionDrawings() {

    let convDrawings = {}

    for (layer of [2, 8, 10]) {

        convDrawings[layer] = []

        for (convolutionNum of [...Array(8).keys()]) {

            let convCanvasId = `layer-${layer}-conv-${convolutionNum}`
            let thisDrawing = new CanvasDrawing(canvasElemId = convCanvasId)

            convDrawings[layer].push(thisDrawing)
        }
    }

    window.convDrawings = convDrawings
}

function clearConvDrawings() {

    for (convDrawingArray of Object.values(convDrawings)) { 

        convDrawingArray.forEach( convDrawing => convDrawing.clearDrawing() )
    
    }
}


function getPrediction() {

    if (!window.model) {            
        console.log("Model not ready to predict yet")
        return
    }

    let layerOutputs = getAllLayerOutput()
    let finalOutput = layerOutputs.slice(-1)[0]
    
    finalOutput.array().then(function (scores) {

        scores = scores[0]
        window.scores = scores
        prediction = scores.indexOf(Math.max(...scores))

        updatePredictionText(prediction)
        showAllLayerConvolutions(layerOutputs)

    })
}

async function showAllLayerConvolutions(layerOutputs){

    await showLayerConvolutions(layerOutputs[2], layerNum=2)
    await showLayerConvolutions(layerOutputs[8], layerNum=8)
    await showLayerConvolutions(layerOutputs[10], layerNum=10)

}

function coldStart(){
    let layerOutputs = getAllLayerOutput()
    showAllLayerConvolutions(layerOutputs).then(clearConvDrawings)
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

    if (!window.model) return

    model_input = getModelInput()

    let layerOutputs = [model_input]

    // skip 0th layer, it is a tfjs input layer, I think
    for (let i = 0; i < window.model.layers.length-1; i++) {

        let layer = window.model.layers[i+1]
        let layer_output = layer.apply(layerOutputs[i])
        layerOutputs.push(layer_output);

    }

    return layerOutputs


}
 

function normalizeTensor(tensor) {

    min = tensor.min()
    return  tensor.sub(min).div(tensor.max().sub(min))

}


async function showLayerConvolutions(layerOutput, layerNum){

    let yellowRgbTensor = tf.tensor([1, 0.8, 0]).tile([layerOutput.shape[1]**2]).reshape([...layerOutput.shape.slice(1,3), 3])

    for (let convolutionNum of [...Array(8).keys()]) {
        
        let convCanvas = convDrawings[layerNum][convolutionNum].canvas

        let convolution = layerOutput.slice([0, 0, 0, convolutionNum*4], [...layerOutput.shape.slice(0,3), 1])
        convolution = convolution.reshape([...layerOutput.shape.slice(1,3), 1])
        convolution = normalizeTensor(convolution)

        let convolutionYellow = tf.concat([yellowRgbTensor, convolution], axis=2)

        await tf.browser.toPixels(convolutionYellow, convCanvas)


    }


}


function throttle(callback, interval) {
    let enableCall = true;
  
    return function(...args) {
      if (!enableCall) return;
  
      enableCall = false;
      callback.apply(this, args);
      setTimeout(() => enableCall = true, interval);
    }
  }

getPrediction = throttle(getPrediction, 50)