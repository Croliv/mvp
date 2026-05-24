import { precisePairCollides } from './preciseCollision'

import {
    polygonsIntersect,
    transformPoints
} from './polygonCollision'

function createBin(sheetWidth, sheetHeight) {
    return {
        width: sheetWidth,
        height: sheetHeight,
        rects: []
    }
}

function rectsOverlap(a, b, spacing = 2) {
    return !(
        a.x + a.width + spacing < b.x ||
        a.x > b.x + b.width + spacing ||
        a.y + a.height + spacing < b.y ||
        a.y > b.y + b.height + spacing
    )
}

function createCandidate(piece, x, y, rot = false) {
    return {
        ...piece,
        x,
        y,
        rot,
        width: rot ? piece.height : piece.width,
        height: rot ? piece.width : piece.height,
        data: {
            id: piece.id,
            path: piece.path,
            points: piece.points,
            originalWidth: piece.originalWidth,
            originalHeight: piece.originalHeight
        }
    }
}

function collides(candidate, placed, spacing = 2) {
    if (!candidate?.points?.length) {
        return true
    }

    const candidatePoints = transformPoints(
        candidate.points,
        candidate,
        0
    )

    return placed.some(item => {

        if (!item?.points?.length) {
            return false
        }

        if (!rectsOverlap(candidate, item, spacing)) {
            return false
        }

        const itemPoints = transformPoints(
            item.points,
            item,
            0
        )

        const polygonCollision = polygonsIntersect(
            candidatePoints,
            itemPoints,
            spacing
        )

        if (polygonCollision) {
            return true
        }

        return precisePairCollides(
            candidate,
            item,
            spacing
        )
    })
}

export function polygonNesting({
    pieces,
    sheetWidth,
    sheetHeight,
    spacing = 2
}) {

    const bins = [
        createBin(sheetWidth, sheetHeight)
    ]

    const sortedPieces = [...pieces].sort((a, b) => {

        const sizeA = a.width + a.height
        const sizeB = b.width + b.height

        return sizeB - sizeA
    })

    sortedPieces.forEach(piece => {

        let placed = false

        const step =
            piece.width > 500 ||
                piece.height > 500
                ? 60
                : 40

        const canRotate =
            piece.width < 800 &&
            piece.height < 800

        const rotations = canRotate
            ? [false, true]
            : [false]

        for (const bin of bins) {

            for (
                let y = 0;
                y <= sheetHeight - piece.height;
                y += step
            ) {

                for (
                    let x = 0;
                    x <= sheetWidth - piece.width;
                    x += step
                ) {

                    for (const rot of rotations) {

                        const candidate = createCandidate(
                            piece,
                            x,
                            y,
                            rot
                        )

                        if (
                            candidate.x < 0 ||
                            candidate.y < 0 ||
                            candidate.x + candidate.width > sheetWidth ||
                            candidate.y + candidate.height > sheetHeight
                        ) {
                            continue
                        }

                        if (
                            !collides(
                                candidate,
                                bin.rects,
                                spacing
                            )
                        ) {

                            bin.rects.push(candidate)

                            placed = true
                            break
                        }
                    }

                    if (placed) break
                }

                if (placed) break
            }

            if (placed) break
        }

        if (!placed) {

            const newBin = createBin(
                sheetWidth,
                sheetHeight
            )

            const candidate = createCandidate(
                piece,
                0,
                0,
                false
            )

            newBin.rects.push(candidate)

            bins.push(newBin)
        }
    })

    return bins
}