function drawPiece(ctx, rect, offsetX, offsetY, scale) {
    if (!rect?.data?.path) return

    const path = new Path2D(rect.data.path)

    ctx.save()

    ctx.translate(
        (rect.x - offsetX) * scale,
        (rect.y - offsetY) * scale
    )

    ctx.scale(scale, scale)

    if (rect.rot) {
        ctx.rotate(Math.PI / 2)
        ctx.translate(0, -rect.data.originalHeight)
    }

    ctx.fill(path, 'evenodd')
    ctx.lineWidth = 2
    ctx.stroke(path)

    ctx.restore()
}

export function precisePairCollides(a, b, spacing = 2) {
    const minX = Math.min(a.x, b.x) - spacing
    const minY = Math.min(a.y, b.y) - spacing

    const maxX = Math.max(
        a.x + a.width,
        b.x + b.width
    ) + spacing

    const maxY = Math.max(
        a.y + a.height,
        b.y + b.height
    ) + spacing

    const scale = 0.4

    const width = Math.ceil((maxX - minX) * scale)
    const height = Math.ceil((maxY - minY) * scale)

    if (width <= 0 || height <= 0) return false

    const canvasA = document.createElement('canvas')
    const canvasB = document.createElement('canvas')

    canvasA.width = width
    canvasA.height = height

    canvasB.width = width
    canvasB.height = height

    const ctxA = canvasA.getContext('2d')
    const ctxB = canvasB.getContext('2d')

    ctxA.fillStyle = 'black'
    ctxA.strokeStyle = 'black'

    ctxB.fillStyle = 'black'
    ctxB.strokeStyle = 'black'

    drawPiece(ctxA, a, minX, minY, scale)
    drawPiece(ctxB, b, minX, minY, scale)

    const dataA = ctxA.getImageData(0, 0, width, height).data
    const dataB = ctxB.getImageData(0, 0, width, height).data

    for (let i = 3; i < dataA.length; i += 4) {
        if (dataA[i] > 0 && dataB[i] > 0) {
            return true
        }
    }

    return false
}