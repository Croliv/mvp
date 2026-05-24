import {
    polygonsIntersect,
    transformPoints
} from './polygonCollision'

function hasCollision(candidate, placed, margin = 0) {
    if (!candidate.data?.points?.length) {
        return true
    }

    function rectsOverlap(a, b) {
        return !(
            a.x + a.width < b.x ||
            a.x > b.x + b.width ||
            a.y + a.height < b.y ||
            a.y > b.y + b.height
        )
    }
    const candidatePoly = transformPoints(
        candidate.data.points,
        candidate,
        margin
    )

    return placed.some(item => {

        if (!rectsOverlap(candidate, item)) {
            return false
        }

        if (!item.data?.points?.length) {
            return false
        }

        const itemPoly = transformPoints(
            item.data.points,
            item,
            margin
        )

        return polygonsIntersect(candidatePoly, itemPoly)
    })
}

export function tryFillEmptySpaces(bin, margin = 25) {
    const smallLimit = 500

    const smallPieces = bin.rects.filter(rect =>
        rect.width <= smallLimit &&
        rect.height <= smallLimit
    )

    const largePieces = bin.rects.filter(rect =>
        !(rect.width <= smallLimit && rect.height <= smallLimit)
    )

    const placed = [...largePieces]

    smallPieces.forEach(piece => {
        let placedSuccessfully = false

        for (let y = 0; y <= 950 - piece.height; y += 20) {
            for (let x = 0; x <= 1950 - piece.width; x += 20) {
                const candidate = {
                    ...piece,
                    x,
                    y,
                    rot: false
                }

                if (!hasCollision(candidate, placed, margin)) {

                    console.log(
                        `Peça ${piece.data.id} movida para x:${x}, y:${y}`
                    )

                    placed.push(candidate)
                    placedSuccessfully = true
                    break
                }
            }

            if (placedSuccessfully) break
        }

        if (!placedSuccessfully) {
            placed.push(piece)
        }
    })

    bin.rects = placed

    return bin
}