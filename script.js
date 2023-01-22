const painter = (function () {
  let canvas,
    ctx,
    colorPicker,
    canvasColor,
    widthRange,
    painting,
    lastX,
    lastY,
    widthValue
  let previousWidth, previousColor
  let undoSteps = 1;
  let undoStack = []

  function init() {
    canvas = document.getElementById("myCanvas")
    ctx = canvas.getContext("2d")
    canvasColor = document.getElementById("canvasColor")
    colorPicker = document.getElementById("colorPicker")
    widthRange = document.getElementById("widthRange")
    previousColor = ctx.strokeStyle
    painting = false
    lastX = lastY = null
    widthValue = document.getElementById("widthValue")

    previousWidth = ctx.lineWidth
    previousColor = ctx.strokeStyle

    widthRange.addEventListener("input", function () {
      widthValue.innerHTML = widthRange.value
      previousWidth = ctx.lineWidth
      ctx.lineWidth = widthRange.value
    })

    colorPicker.addEventListener("change", function () {
      previousColor = ctx.strokeStyle
      ctx.strokeStyle = colorPicker.value
    })

    canvas.addEventListener("mousedown", startPainting)
    canvas.addEventListener("mouseup", stopPainting)
    canvas.addEventListener("mousemove", draw)

    colorPicker.addEventListener("change", function () {
      ctx.strokeStyle = colorPicker.value
    })
    canvasColor.addEventListener("change", function () {
      canvas.style.backgroundColor = canvasColor.value
    })
    const undoButton = document.getElementById("undoButton")
    undoButton.addEventListener("click", undo)

    const saveButton = document.getElementById("saveButton")
    saveButton.addEventListener("click", save)

    const resetButton = document.getElementById("resetButton")
    resetButton.addEventListener("click", reset)
  }
  
  function startPainting() {
    painting = true
    ctx.beginPath()
    var rect = canvas.getBoundingClientRect()
    lastX = event.clientX - rect.left
    lastY = event.clientY - rect.top
  }

  function stopPainting() {
    painting = false
    // save the current canvas state to undo stack
    undoStack.push(canvas.toDataURL())
  }

  function draw(e) {
    if (!painting) return
    var rect = canvas.getBoundingClientRect()
    lastX = e.clientX - rect.left
    lastY = e.clientY - rect.top
    ctx.lineWidth = widthRange.value
    ctx.lineCap = "round"
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  function undo() {
    for (let i = 0; i < undoSteps; i++) {
        if (undoStack.length > 0) {
            const undoDataURL = undoStack.pop();
            const img = new Image();
            img.src = undoDataURL;
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}
  function save() {
    for (let i = 0; i < undoSteps; i++) {
        if (undoStack.length > 0) {
            const undoDataURL = undoStack.pop();
            const img = new Image();
            img.src = undoDataURL;
            document.body.appendChild(img);
        }
    }
}

  function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    undoStack = []
  }

  return {
    init: init,
  }
})()

painter.init()
