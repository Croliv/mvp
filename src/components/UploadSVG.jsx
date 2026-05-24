import { useRef } from 'react'

export default function UploadSVG({ onLoad }) {

    const inputRef = useRef()

    function handleFile(event) {

        const file = event.target.files[0]

        if (!file) return

        const reader = new FileReader()

        reader.onload = (e) => {
            onLoad(e.target.result)
        }

        reader.readAsText(file)
    }

    return (
        <div className="upload-card p-4 border rounded">

            <input
                className="file-input"
                ref={inputRef}
                type="file"
                accept=".svg"
                onChange={handleFile}
            />

        </div>
    )
}