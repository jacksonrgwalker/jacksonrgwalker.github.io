---
# status: "🚧Under Construction🏗️"
tags: ["AI", "python", "tensorflow", "MNIST", "neural networks"]
description: "A simple, deployed, AI model to predict a drawn number"
---

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js"></script>
<script src="/assets/js/NNNN/canvas.js"></script>

<h2 class="display-4 text-center warning font-weight-bold text-warning mb-6">draw a single digit number</h2>

<div style="text-align: center;">
    <canvas class="border border-warning rounded" id="canvas" name="draw" width="400" height="400" style="text-align: center;">

        <script type="text/javascript">
            $(document).ready(function () {
                drawCanvas();
            });
        </script>
    </canvas>

    <div class="col text-center">
        <button type="button" class="btn btn-outline-warning mt-2" onclick="clearCanvas()">clear</button>
    </div>

    <h4 id="predictionText" class="display-4 text-center warning font-weight-bold text-warning mb-6"></h4> 

</div>

<script>
tf.loadLayersModel("/assets/models/NNNN_model/model.json").then(function(model) {
 window.model = model;
});
</script>

