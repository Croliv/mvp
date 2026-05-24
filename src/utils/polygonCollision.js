function linesIntersect(a, b, c, d) {
    const det =
        (d.x - c.x) * (b.y - a.y) -
        (d.y - c.y) * (b.x - a.x)

    if (det === 0) return false

    const lambda =
        ((d.y - c.y) * (d.x - a.x) +
            (c.x - d.x) * (d.y - a.y)) / det

    const gamma =
        ((a.y - b.y) * (d.x - a.x) +
            (b.x - a.x) * (d.y - a.y)) / det

    return (
        lambda >= 0 &&
        lambda <= 1 &&
        gamma >= 0 &&
        gamma <= 1
    )
}

function polygonBounds(poly) {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    poly.forEach(point => {
        minX = Math.min(minX, point.x)
        minY = Math.min(minY, point.y)
        maxX = Math.max(maxX, point.x)
        maxY = Math.max(maxY, point.y)
    })

    return { minX, minY, maxX, maxY }
}

function boundsOverlap(a, b, spacing = 0) {
    return !(
        a.maxX + spacing < b.minX ||
        a.minX - spacing > b.maxX ||
        a.maxY + spacing < b.minY ||
        a.minY - spacing > b.maxY
    )
}

function pointInPolygon(point, polygon) {
    let inside = false

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x
        const yi = polygon[i].y
        const xj = polygon[j].x
        const yj = polygon[j].y

        const intersect =
            yi > point.y !== yj > point.y &&
            point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi

        if (intersect) inside = !inside
    }

    return inside
}

function pointToSegmentDistance(p, a, b) {
    const dx = b.x - a.x
    const dy = b.y - a.y

    if (dx === 0 && dy === 0) {
        return Math.hypot(p.x - a.x, p.y - a.y)
    }

    const t = Math.max(
        0,
        Math.min(
            1,
            ((p.x - a.x) * dx + (p.y - a.y) * dy) /
                (dx * dx + dy * dy)
        )
    )

    const projection = {
        x: a.x + t * dx,
        y: a.y + t * dy
    }

    return Math.hypot(
        p.x - projection.x,
        p.y - projection.y
    )
}

function segmentsTooClose(a1, a2, b1, b2, spacing) {
    return (
        pointToSegmentDistance(a1, b1, b2) <= spacing ||
        pointToSegmentDistance(a2, b1, b2) <= spacing ||
        pointToSegmentDistance(b1, a1, a2) <= spacing ||
        pointToSegmentDistance(b2, a1, a2) <= spacing
    )
}

export function polygonsIntersect(polyA, polyB, spacing = 2) {
    if (!polyA?.length || !polyB?.length) {
        return false
    }

    const boundsA = polygonBounds(polyA)
    const boundsB = polygonBounds(polyB)

    if (!boundsOverlap(boundsA, boundsB, spacing)) {
        return false
    }

    for (let i = 0; i < polyA.length; i++) {
        const a1 = polyA[i]
        const a2 = polyA[(i + 1) % polyA.length]

        for (let j = 0; j < polyB.length; j++) {
            const b1 = polyB[j]
            const b2 = polyB[(j + 1) % polyB.length]

            if (linesIntersect(a1, a2, b1, b2)) {
                return true
            }

            if (segmentsTooClose(a1, a2, b1, b2, spacing)) {
                return true
            }
        }
    }

    for (const point of polyA) {
        if (pointInPolygon(point, polyB)) {
            return true
        }
    }

    for (const point of polyB) {
        if (pointInPolygon(point, polyA)) {
            return true
        }
    }

    return false
}

export function transformPoints(points, rect, margin = 0) {
    if (!points?.length) return []

    return points.map(point => {
        if (rect.rot) {
            return {
                x: rect.x + margin + rect.height - point.y,
                y: rect.y + margin + point.x
            }
        }

        return {
            x: rect.x + margin + point.x,
            y: rect.y + margin + point.y
        }
    })
}