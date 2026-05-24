export function parseSvgNestResult(svgElements) {
    if (!svgElements?.length) {
        return []
    }

    return svgElements.map(svgElement => {
        const clone = svgElement.cloneNode(true)

        clone.setAttribute('width', '500')
        clone.setAttribute('height', '250')
        clone.setAttribute('preserveAspectRatio', 'xMinYMin meet')

        const style = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'style'
        )

        style.textContent = `
            path {
                fill: none !important;
                stroke: red !important;
                stroke-width: 2 !important;
            }

            rect.bin {
                fill: none !important;
                stroke: cyan !important;
                stroke-width: 4 !important;
            }
        `

        clone.appendChild(style)

        return {
            width: 2000,
            height: 1000,
            rects: [],
            rawSvg: clone.outerHTML,
            placedCount: clone.querySelectorAll('g').length
        }
    })
}   