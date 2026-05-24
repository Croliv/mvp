function drawPiece(ctx, rect, margin, scale) {
    if (!rect?.data?.path) return

    const path = new Path2D(rect.data.path)

    ctx.save()

    ctx.setTransform(
        scale,
        0,
        0,
        scale,
        (rect.x + margin) * scale,
        (rect.y + margin) * scale
    )

    ctx.fill(path, 'evenodd')
    ctx.lineWidth = 2 * scale
    ctx.stroke(path)

    ctx.restore()
}

export function createRasterMap(rects, margin = 25) {
    const scale = 0.10

    const width = Math.ceil(2000 * scale)
    const height = Math.ceil(1000 * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.strokeStyle = 'black'

    rects.forEach(rect => {
        drawPiece(ctx, rect, margin, scale)
    })

    return {
        canvas,
        ctx,
        scale,
        width,
        height
    }
}

export function rasterCandidateCollides(candidate, raster, margin = 25) {
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = raster.width
    tempCanvas.height = raster.height

    const tempCtx = tempCanvas.getContext('2d')
    tempCtx.fillStyle = 'black'
    tempCtx.strokeStyle = 'black'

    drawPiece(tempCtx, candidate, margin, raster.scale)

    const base = raster.ctx.getImageData(
        0,
        0,
        raster.width,
        raster.height
    ).data

    const test = tempCtx.getImageData(
        0,
        0,
        raster.width,
        raster.height
    ).data

    for (let i = 3; i < base.length; i += 4) {
        if (base[i] > 0 && test[i] > 0) {
            return true
        }
    }

    return false
}

export function addCandidateToRaster(candidate, raster, margin = 25) {
    drawPiece(raster.ctx, candidate, margin, raster.scale)
}