const properties = new svgPathProperties(normalizedPath)
const totalLength = properties.getTotalLength()

const points = []

for (let i = 0; i < totalLength; i += 10) {
    const point = properties.getPointAtLength(i)

    pieces.push({
        id: pieces.length + 1,
        width: Math.ceil(width),
        height: Math.ceil(height),
        path: normalizedPath,
        points
    })
}