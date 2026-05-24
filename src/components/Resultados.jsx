export default function Resultados({
    bins,
    valorChapa
}) {
    const totalChapas = bins.length

    const totalPecas = bins.reduce((total, bin) => {
        if (bin.placedCount !== undefined) {
            return total + bin.placedCount
        }

        return total + (bin.rects?.length || 0)
    }, 0)

    const valorTotal =
        totalChapas * valorChapa

    return (
        <div className="result-card space-y-2 p-4 border rounded">

            <div className="result-line">Chapas: {totalChapas}</div>

            <div className="result-line">Peças posicionadas: {totalPecas}</div>

            <div className="result-line">Valor por chapa: R$ {valorChapa}</div>

            <div className="result-line">Valor total: R$ {valorTotal}</div>

        </div>
    )
}