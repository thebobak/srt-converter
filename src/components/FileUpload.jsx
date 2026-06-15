import { useRef, useState } from 'react';

export function FileUpload({ onFilesSelected }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }
        e.target.value = '';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.name.toLowerCase().endsWith('.srt'));
        if (files.length > 0) {
            onFilesSelected(files);
        }
    };

    return (
        <div
            className="mb-8 relative group focus-within:ring-3 focus-within:ring-[var(--c-primary)] focus-within:ring-offset-2 rounded-[var(--radius-main)]"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <label
                htmlFor="srtFile"
                className={`block w-full border-2 border-dashed rounded-[var(--radius-main)] p-10 cursor-pointer transition-all focus-within:bg-white focus-within:border-[var(--c-primary)] relative overflow-hidden ${
                    isDragging
                        ? 'bg-white border-[var(--c-primary)] scale-[1.01]'
                        : 'border-[var(--c-border)] bg-[var(--c-bg-main)] hover:bg-white hover:border-[var(--c-primary)]'
                }`}
            >
                {/* Hover Pattern Effect */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                />

                <div className="flex flex-col items-center relative z-10">
                    <div className="bg-[var(--c-bg-card)] p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200 retro-press retro-press-lg" aria-hidden="true">
                        <svg className="w-8 h-8 text-[var(--c-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <span className="text-[var(--c-text-main)] font-bold text-lg" id="file-upload-label">Drop .SRT files here</span>
                    <span className="text-sm text-[var(--c-text-muted)] font-mono mt-2 bg-[var(--c-bg-main)] px-2 py-1 border border-[var(--c-border)] rounded" id="file-upload-hint">
                        or click to browse
                    </span>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    id="srtFile"
                    accept=".srt"
                    multiple
                    className="sr-only"
                    onChange={handleChange}
                    aria-label="Upload SRT subtitle files"
                    aria-describedby="file-upload-label file-upload-hint"
                />
            </label>
        </div>
    );
}
