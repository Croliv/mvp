import { parseSvg } from './parseSvg'

export async function svgNestEngine({
    svgText,
    sheetWidth = 2000,
    sheetHeight = 1000,
    spacing = 2
}) {
    window.SvgNest.stop()

    const pieces = await parseSvg(svgText)
    console.table(
        pieces.map(piece => ({
            id: piece.id,
            width: piece.width,
            height: piece.height,
            path: !!piece.path
        }))
    )

    let cursorX = sheetWidth + 100

    const paths = pieces.map(piece => {
        const path = `
        <path
            id="part-${piece.id}"
            d="${piece.path}"
            fill="#000"
            transform="translate(${cursorX} 0)"
        />
    `

        cursorX += piece.width + 50

        return path
    }).join('\n')


    const preparedSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${sheetWidth}" height="${sheetHeight}" viewBox="0 0 ${sheetWidth} ${sheetHeight}">
            <rect id="bin" x="0" y="0" width="${sheetWidth}" height="${sheetHeight}" fill="none" stroke="blue" />
            ${paths}
        </svg>
    `

    window.SvgNest.parsesvg(preparedSvg)

    window.SvgNest.config({
        spacing,
        curveTolerance: 2,
        rotations: 4,
        populationSize: 4,
        mutationRate: 10,
        useHoles: true,
        exploreConcave: false
    })

    const svgDoc = new DOMParser()
        .parseFromString(preparedSvg, 'image/svg+xml')

    const binElement = svgDoc.querySelector('#bin')

    window.SvgNest.setbin(binElement)

    return new Promise(resolve => {

        window.SvgNest.start(

            function (progress) {
            },

            function (
                placementSvg,
                efficiency,
                placed,
                total
            ) {
                if (!placementSvg) {
                    return
                }

            

                window.SvgNest.stop()

                resolve({
                    partsCount: pieces.length,
                    placementSvg,
                    efficiency,
                    placed,
                    total,
                    preparedSvg,
                    sheetWidth,
                    sheetHeight,
                    spacing
                })
            }
        )
    })
}