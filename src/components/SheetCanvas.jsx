import React from 'react'

import {
    Stage,
    Layer,
    Rect,
    Text,
    Path
} from 'react-konva'

export default function SheetCanvas({
    bins,
    sheetWidth = 2000,
    sheetHeight = 1000
}) {

    const maxPreviewWidth = 500
    const scale = maxPreviewWidth / sheetWidth
    const previewWidth = sheetWidth * scale
    const previewHeight = sheetHeight * scale

    const margin = 25

    // Visual colors pulled from CSS variables so theme controls appearance only
    const rootEl = typeof document !== 'undefined' ? document.getElementById('root') : null
    const computed = rootEl ? getComputedStyle(rootEl) : getComputedStyle(document.documentElement)
    const colorText = computed.getPropertyValue('--text-h').trim() || 'white'
    const colorBorder = computed.getPropertyValue('--border').trim() || 'white'
    const colorAccent = computed.getPropertyValue('--accent').trim() || 'cyan'
    const colorRect = computed.getPropertyValue('--accent-bg').trim() || 'rgba(0,0,0,0)'
    const colorStroke = computed.getPropertyValue('--accent').trim() || 'cyan'

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                alignItems: 'flex-start'
            }}
        >

            {bins.map((bin, index) => (

                <div key={index}>

                        <h2 className="canvas-title">
                        Chapa {index + 1}
                    </h2>

                    {bin.placedCount !== undefined && (
                        <p className="canvas-subtitle">
                            Peças nesta chapa: {bin.placedCount}
                        </p>
                    )}

                    {bin.rawSvg ? (

                        <div
                            className="canvas-preview"
                            style={{ width: previewWidth, height: previewHeight }}
                            dangerouslySetInnerHTML={{
                                __html: bin.rawSvg.replace(
                                    '<svg',
                                    `<svg style="width:${previewWidth}px;height:${previewHeight}px;"`
                                )
                            }}
                        />

                    ) : (

                        <Stage
                            width={previewWidth}
                            height={previewHeight}
                        >

                            <Layer>

                                <Rect x={0} y={0} width={previewWidth} height={previewHeight} stroke={colorBorder} />

                                <Rect
                                    x={margin * scale}
                                    y={margin * scale}
                                    width={(sheetWidth - margin * 2) * scale}
                                    height={(sheetHeight - margin * 2) * scale}
                                    stroke={colorStroke}
                                    strokeWidth={2}
                                />

                                {bin.rects.map((rect, i) => (

                                    <React.Fragment key={i}>

                                        {Number.isFinite(rect.width) &&
                                            Number.isFinite(rect.height) && (
                                                <Rect
                                                    x={(rect.x + margin) * scale}
                                                    y={(rect.y + margin) * scale}
                                                    width={rect.width * scale}
                                                    height={rect.height * scale}
                                                    stroke={colorBorder}
                                                />
                                            )}

                                        {rect.data?.path && (
                                                <Path
                                                    data={rect.data.path}
                                                    x={(rect.x + margin) * scale}
                                                    y={(rect.y + margin) * scale}
                                                    scaleX={scale}
                                                    scaleY={scale}
                                                    rotation={rect.rot ? 90 : 0}
                                                    offsetY={
                                                        rect.rot ? rect.data.originalHeight : 0
                                                    }
                                                    stroke={colorAccent}
                                                    strokeWidth={1}
                                                />
                                        )}

                                        {rect.data?.id && (
                                            <Text
                                                x={(rect.x + margin) * scale + 6}
                                                y={(rect.y + margin) * scale + 6}
                                                text={`${rect.data.id}`}
                                                fontSize={14}
                                                fill={colorText}
                                            />
                                        )}

                                    </React.Fragment>
                                ))}

                            </Layer>

                        </Stage>
                    )}

                </div>
            ))}

        </div>
    )
}