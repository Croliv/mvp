import { MaxRectsPacker } from 'maxrects-packer'

export function optimizeLayout({
    pieces,
    sheetWidth,
    sheetHeight,
    spacing,
    allowRotation = true
}) {

    const packer = new MaxRectsPacker(
        sheetWidth,
        sheetHeight,
        spacing,
        {
            smart: true,
            pot: false,
            square: false,
            allowRotation
        }
    )
    // ordena da maior área para menor
    const sortedPieces = [...pieces].sort(
        (a, b) => {

            const areaA =
                a.width * a.height

            const areaB =
                b.width * b.height

            return areaB - areaA
        }
    )

    sortedPieces.forEach(piece => {

        packer.add(
            piece.width,
            piece.height,
            {
                id: piece.id,
                path: piece.path,
                points: piece.points,
                originalWidth: piece.originalWidth,
                originalHeight: piece.originalHeight
            }
        )
    })

    return packer.bins
}