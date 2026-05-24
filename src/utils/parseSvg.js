import { svgPathProperties } from 'svg-path-properties'
import svgpath from 'svgpath'
import { parse } from 'svgson'
import pathBounds from 'svg-path-bounds'

const SCALE = 65.84
const POINT_STEP = 40

export async function parseSvg(svgText) {
    const json = await parse(svgText)

    const pieces = []

    function walk(node) {
        try {
            if (
                node.name === 'path' ||
                node.name === 'polygon'
            ) {
                let d = ''

                if (node.name === 'path') {
                    d = node.attributes.d
                }

                if (node.name === 'polygon') {
                    const polygonPoints = node.attributes.points

                    if (!polygonPoints) return

                    d = `M ${polygonPoints} Z`
                }

                if (!d) return

                const bounds = pathBounds(d)

                const minX = bounds[0]
                const minY = bounds[1]
                const maxX = bounds[2]
                const maxY = bounds[3]

                const width = (maxX - minX) / SCALE
                const height = (maxY - minY) / SCALE

                if (width <= 0 || height <= 0) return

                const normalizedPath = svgpath(d)
                    .translate(-minX, -minY)
                    .scale(1 / SCALE)
                    .toString()

                const properties = new svgPathProperties(normalizedPath)
                const totalLength = properties.getTotalLength()

                const points = []

                for (let i = 0; i < totalLength; i += POINT_STEP) {
                    const point = properties.getPointAtLength(i)

                    points.push({
                        x: point.x,
                        y: point.y
                    })
                }

                pieces.push({
                    id: pieces.length + 1,

                    width,
                    height,

                    originalWidth: width,
                    originalHeight: height,

                    path: normalizedPath,
                    points
                })
            }

            if (node.children) {
                node.children.forEach(walk)
            }

        } catch (error) {
            console.error('Erro ao ler item SVG:', error)
        }
    }

    walk(json)

    return pieces
}