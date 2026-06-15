import { useMemo } from 'react';
import { generatePdfBlob } from '../utils/srtConverter';

export function ResultItem({ fileData, pdfFooter, editedName, onNameChange }) {
    const textUrls = useMemo(() => {
        const srtBlob = new Blob([fileData.srtContent], { type: 'text/plain' });
        const vttBlob = new Blob([fileData.vttContent], { type: 'text/vtt' });
        const txtBlob = new Blob([fileData.txtContent], { type: 'text/plain' });

        return {
            srt: URL.createObjectURL(srtBlob),
            vtt: URL.createObjectURL(vttBlob),
            txt: URL.createObjectURL(txtBlob),
        };
    }, [fileData]);

    const exportName = editedName.trim() || fileData.baseName;

    const pdfUrl = useMemo(() => {
        const blob = generatePdfBlob(fileData.txtContent, exportName, pdfFooter);
        return URL.createObjectURL(blob);
    }, [fileData.txtContent, exportName, pdfFooter]);

    return (
        <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border-2 border-[var(--c-border)] transition-all hover:bg-gray-50">
            <div className="w-full sm:w-auto flex-1 min-w-0 mr-0 sm:mr-4 mb-3 sm:mb-0">
                <div className="flex items-center gap-1.5 group">
                    <input
                        type="text"
                        value={editedName}
                        onChange={e => onNameChange(fileData.baseName, e.target.value)}
                        className="text-sm font-bold text-[var(--c-text-main)] font-mono bg-transparent border-b-2 border-transparent group-hover:border-[var(--c-border)] focus:border-[var(--c-primary)] focus:outline-none min-w-0 w-full"
                        title="Click to rename export files"
                        aria-label={`Export name for ${fileData.baseName}`}
                    />
                    <svg className="w-3 h-3 text-[var(--c-text-muted)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </div>
                <p className="text-[10px] font-mono text-[var(--c-text-muted)] truncate mt-0.5" title={fileData.originalName}>
                    {fileData.originalName}
                </p>
            </div>
            <div
                className="flex flex-wrap gap-2 w-full sm:w-auto"
                role="group"
                aria-label={`Download options for ${exportName}`}
            >
                <a
                    href={textUrls.srt}
                    download={`${exportName}.srt`}
                    className="text-xs font-bold bg-white text-[var(--c-text-main)] px-3 py-1 rounded retro-press hover:bg-[var(--c-bg-main)] text-center flex-1 sm:flex-none"
                    aria-label={`Download ${exportName} as SRT`}
                >
                    SRT
                </a>
                <a
                    href={textUrls.vtt}
                    download={`${exportName}.vtt`}
                    className="text-xs font-bold bg-[var(--c-secondary)] text-white px-3 py-1 rounded retro-press hover:opacity-90 text-center flex-1 sm:flex-none"
                    aria-label={`Download ${exportName} as VTT`}
                >
                    VTT
                </a>
                <a
                    href={textUrls.txt}
                    download={`${exportName}.txt`}
                    className="text-xs font-bold bg-[var(--c-accent)] text-[var(--c-text-main)] px-3 py-1 rounded retro-press hover:opacity-90 text-center flex-1 sm:flex-none"
                    aria-label={`Download ${exportName} as TXT`}
                >
                    TXT
                </a>
                <a
                    href={pdfUrl}
                    download={`${exportName}.pdf`}
                    className="text-xs font-bold bg-[var(--c-primary)] text-white px-3 py-1 rounded retro-press hover:opacity-90 text-center flex-1 sm:flex-none"
                    aria-label={`Download ${exportName} as PDF`}
                >
                    PDF
                </a>
            </div>
        </li>
    );
}
