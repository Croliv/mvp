import { useState, useEffect } from 'react'

import UploadSVG from './components/UploadSVG'
import Resultados from './components/Resultados'
import SheetCanvas from './components/SheetCanvas'

import { svgNestEngine } from './utils/svgNestEngine'
import { parseSvgNestResult } from './utils/parseSvgNestResult'

import { materiais } from "./data/materiais";
import './theme-rda.css';

export default function App() {

    const [bins, setBins] = useState([])
    const [loading, setLoading] = useState(false)
    const [reiTheme, setReiTheme] = useState(false)

    useEffect(() => {

        const root = document.getElementById('root')
        if (root) {
            if (reiTheme) root.classList.add('theme-rei')
            else root.classList.remove('theme-rei')
        }
    }, [reiTheme])


    const [materialSelecionado, setMaterialSelecionado] =
        useState(materiais[0].id)

    const material = materiais.find(
        (m) => m.id === materialSelecionado
    )

    const [sheetSize, setSheetSize] = useState('full')

    const sheetWidth = sheetSize === 'half' ? material.largura / 2 : material.largura
    const sheetHeight = material.altura
    const sheetValue = sheetSize === 'half' ? material.precoChapa / 2 : material.precoChapa


    const [svgText, setSvgText] = useState(null)


    async function runNesting(svg) {
        setLoading(true)
        setBins([])

        try {
            const svgNestResult = await svgNestEngine({
                svgText: svg,
                sheetWidth,
                sheetHeight,
                spacing: material.espacamento
            })

            const parsed = parseSvgNestResult(svgNestResult.placementSvg)
            setBins(parsed)
        } finally {
            setLoading(false)
        }
    }

    async function handleSvg(text) {
        setSvgText(text)
        await runNesting(text)
    }

    useEffect(() => {
        if (!svgText) return
        runNesting(svgText)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [materialSelecionado, sheetSize])



    return (
        <div className="p-10 space-y-10">

            <button
                onClick={() => setReiTheme((r) => !r)}
                style={{
                    position: 'fixed',
                    top: 12,
                    left: 18,
                    zIndex: 9999,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: reiTheme ? 'var(--accent)' : 'rgba(0,0,0,0.06)',
                    color: reiTheme ? '#2b1a00' : '#111',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                Tema Rei
            </button>

            <h1 className="text-3xl font-bold">
                Nesting - Otimizador de corte
            </h1>

            <div className="space-y-2">
                <label className="font-bold block">
                    Material da chapa
                </label>

                <select
                    value={materialSelecionado}
                    onChange={(e) =>
                        setMaterialSelecionado(e.target.value)
                    }
                    className="border rounded p-2 w-full max-w-xl"
                >
                    {materiais.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.nome} — {m.largura}x{m.altura}mm — R$ {m.precoChapa}
                        </option>
                    ))}
                </select>

                <div className="text-sm text-gray-600">
                    Chapa selecionada: {material.largura}x{material.altura}mm |
                    Espaçamento: {material.espacamento}mm |
                    Valor: R$ {material.precoChapa}
                </div>
            </div>

            <div className="space-y-2">
                <label className="font-bold block">Tamanho</label>

                <select
                    value={sheetSize}
                    onChange={(e) => setSheetSize(e.target.value)}
                    className="border rounded p-2 w-full max-w-xl"
                >
                    <option value="full">Chapa inteira</option>
                    <option value="half">Meia chapa</option>
                </select>

                <div className="text-sm text-gray-600">
                    {sheetSize === 'half'
                        ? `Meia chapa: ${Math.round(material.largura / 2)}x${material.altura}mm |
                           Valor: R$ ${Math.round(material.precoChapa / 2)}`
                        : `Chapa inteira: ${material.largura}x${material.altura}mm |
                           Valor: R$ ${material.precoChapa}`}
                </div>
            </div>


            <UploadSVG onLoad={handleSvg} />

            {loading && (
                <div style={{ color: 'orange', fontWeight: 'bold' }}>
                    Processando nesting, aguarde...
                </div>
            )}

            <Resultados
                bins={bins}
                valorChapa={sheetValue}
            />

            <SheetCanvas
                bins={bins}
                sheetWidth={sheetWidth}
                sheetHeight={sheetHeight}
            />


            <a
                href="https://instagram.com/rafaelcroliv"
                target="_blank"
                rel="noreferrer"
                style={{
                    position: 'fixed',
                    bottom: 12,
                    right: 18,
                    fontSize: 12,
                    color: 'rgba(0,0,0,0.55)',
                    background: 'rgba(255,255,255,0.75)',
                    padding: '6px 10px',
                    borderRadius: 10,
                    letterSpacing: 1,
                    textDecoration: 'none',
                    backdropFilter: 'blur(4px)',
                    transition: '0.2s',
                    zIndex: 9999
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.75'
                }}
            >
                Developed by @rafaelcroliv
            </a>

        </div>
    )
}
