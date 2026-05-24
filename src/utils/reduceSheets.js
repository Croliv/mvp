import {
    createRasterMap,
    rasterCandidateCollides,
    addCandidateToRaster
} from './rasterCollision'

export function reduceSheets(bins) {
    if (bins.length <= 1) return bins

    const newBins = [...bins]

    for (let sourceIndex = newBins.length - 1; sourceIndex > 0; sourceIndex--) {
        const sourceBin = newBins[sourceIndex]

        const piecesToMove = [...sourceBin.rects].sort((a, b) => {
            const areaA = a.width * a.height
            const areaB = b.width * b.height

            return areaA - areaB
        })

        piecesToMove.forEach(piece => {
            if (!piece?.data?.path) return

            if (
                !Number.isFinite(piece.width) ||
                !Number.isFinite(piece.height)
            ) {
                return
            }

            if (piece.width > 500 || piece.height > 500) {
                return
            }

            let moved = false

            for (let targetIndex = 0; targetIndex < sourceIndex; targetIndex++) {
                const targetBin = newBins[targetIndex]

                const raster = createRasterMap(targetBin.rects, 25)

                let attempts = 0
                const maxAttempts = 3000

                for (let y = 0; y <= 950 - piece.height; y += 10) {
                    for (let x = 0; x <= 1950 - piece.width; x += 10) {
                        attempts++

                        if (attempts > maxAttempts) break

                        const rotations = [false, true]

                        for (const rot of rotations) {
                            const candidate = {
                                ...piece,
                                x,
                                y,
                                rot,
                                width: rot ? piece.height : piece.width,
                                height: rot ? piece.width : piece.height,
                                data: {
                                    id: piece.data?.id,
                                    path: piece.data?.path,
                                    points: piece.data?.points,
                                    originalWidth: piece.data?.originalWidth,
                                    originalHeight: piece.data?.originalHeight
                                }
                            }

                            if (!rasterCandidateCollides(candidate, raster, 25)) {
                                targetBin.rects.push(candidate)

                                addCandidateToRaster(candidate, raster, 25)

                                sourceBin.rects = sourceBin.rects.filter(
                                    r => r.data?.id !== piece.data?.id
                                )

                                console.log(
                                    `Peça ${piece.data.id} movida da chapa ${sourceIndex + 1} para chapa ${targetIndex + 1}`,
                                    rot ? 'rotacionada' : 'normal'
                                )

                                moved = true
                                break
                            }
                        }

                        if (moved) break
                    }

                    if (moved || attempts > maxAttempts) break
                }

                if (moved) break
            }

            if (!moved) {
                console.log(
                    `Peça ${piece.data?.id} não encontrou espaço`
                )
            }
        })
    }

    return newBins.filter(bin => bin.rects.length > 0)
}