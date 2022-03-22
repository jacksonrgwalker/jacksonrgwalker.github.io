

class CanvasDrawing {

    constructor(canvasElemId, lineWidth=25, lineColor="#ffcc00", whileDrawingListeners=[]) { 

        let canvas = document.getElementById(canvasElemId)
        let context = canvas.getContext("2d")
        context.strokeStyle = lineColor
        context.lineJoin = "round"
        context.lineWidth = lineWidth

        canvas.addEventListener('mousedown', this.beginPath)
        window.addEventListener('mouseup', this.endPath)

        canvas.addEventListener('touchstart', this.beginPath)
        window.addEventListener('touchend', this.endPath)

        let prevDefault = (event) => { event.preventDefault() }
        let preventDefaultEvent = ['touchstart','touchmove', 'touchend', 'touchcancel', 'mousedown']
        preventDefaultEvent.forEach( evt => canvas.addEventListener(evt, prevDefault))

        this.canvas = canvas
        this.context = context
        this.whileDrawingListeners = whileDrawingListeners.concat([this.addPathNodeFromEvent, this.drawLastPathAddition])

        this.paths = []


    }

    get canvasOffset() {
        return canvas.getBoundingClientRect()
    }

    
    addNewPath = () => {
        this.paths.push([])
    }

    addPathNode = (x, y) => {
        let adjusted_xy = this.adjustPathNodeForOffset(x, y)
        this.paths[this.paths.length-1].push(adjusted_xy)
    }

    addPathNodeFromEvent = (event) => {
        this.addPathNode(event.pageX, event.pageY)
    }

    adjustPathNodeForOffset = (x, y) => {
        return [x - this.canvasOffset.left, y - this.canvasOffset.top]
    }

    drawPath = (path) => {

        this.context.beginPath()
        this.context.moveTo(path[0][0], path[0][1])

        for (let i = 1; i < path.length; i++) {
            this.context.lineTo(path[i][0], path[i][1])
        }
        this.context.closePath();
        this.context.stroke()
    }


    drawLastPathAddition = () => {

        let lastPath = this.paths[this.paths.length-1]
        let lastPathLength = lastPath.length

        if (lastPathLength < 2) {
            return
        }

        this.drawPath(lastPath.slice(-3))

    }

    beginPath = (event) => {
        
        this.addNewPath()
        this.addPathNodeFromEvent(event)

        this.whileDrawingListeners.forEach( listener => canvas.addEventListener('mousemove', listener))
        this.whileDrawingListeners.forEach( listener => canvas.addEventListener('touchmove', listener))

    }




    endPath = () => {

        this.whileDrawingListeners.forEach( listener => canvas.removeEventListener('mousemove', listener))
        this.whileDrawingListeners.forEach( listener => canvas.removeEventListener('touchmove', listener))

    }

    clearDrawing = () => {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.paths = []

    }

    getImageData = (width, height) => {
        
        let resizedContext = document.createElement("canvas").getContext("2d")
        resizedContext.drawImage(this.canvas, 0, 0, width, height)
        let resizedData = resizedContext.getImageData(0, 0, width, height)
        return resizedData
    
    }


    getDrawingValues = (width=28, height=28) => {

        // array of pixels where 0 means nothing drawn there, 1 means something drawn there

        let rgbaArray = this.getImageData(width, height).data

        let drawingArray = []
        for (var i = 0; i < rgbaArray.length; i += 4) {
            drawingArray.push((rgbaArray[i] | rgbaArray[i + 1] | rgbaArray[i + 2]) / 255)
        }
    
        return drawingArray
    }

    getLuminanceValues = (width=28, height=28) => {

        let rgbaArray = this.getImageData(width, height).data
        // ImageData.data
        // Is a Uint8ClampedArray representing a one-dimensional array containing 
        // the data in the RGBA order, with integer values between 0 and 255 (inclusive).
        let luminanceArray = []

        for (let i = 0; i < rgbaArray.length; i += 4) {
            luminanceArray.push(
                    (
                (rgbaArray[i    ] * 0.2126) + // red values
                (rgbaArray[i + 1] * 0.7152) + // green values
                (rgbaArray[i + 2] * 0.0722)   // blue values
                    )
                     * rgbaArray[i + 3]      // alpha values
                    / 255**2
                )
        }
    
        return luminanceArray

    }


}