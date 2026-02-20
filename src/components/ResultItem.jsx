import { useMemo } from 'react';

export function ResultItem({ fileData }) {
    const urls = useMemo(() => {
        const srtBlob = new Blob([fileData.srtContent], { type: 'text/plain' });
        const vttBlob = new Blob([fileData.vttContent], { type: 'text/vtt' });
        const txtBlob = new Blob([fileData.txtContent], { type: 'text/plain' });

        return {
            srt: URL.createObjectURL(srtBlob),
            vtt: URL.createObjectURL(vttBlob),
            txt: URL.createObjectURL(txtBlob),
            pdf: URL.createObjectURL(fileData.pdfBlob)
        };
    }, [fileData]);

    return (
        <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border-2 border-[var(--c-border)] transition-all hover:bg-gray-50">
            <div className="w-full sm:w-auto flex-1 min-w-0 mr-0 sm:mr-4 mb-3 sm:mb-0">
                <p
                    className="text-sm font-bold text-[var(--c-text-main)] truncate font-mono"
                    title={fileData.originalName}
                    id={`filename-${fileData.baseName}`}
                >
                    {fileData.originalName}
                </p>
            </div>
            <div
                className="flex flex-wrap gap-2 w-full sm:w-auto"
                role="group"
                aria-label={`Download options for ${fileData.baseName}`}
            >
                <a
                    href={urls.srt}
                    download={fileData.originalName}
                    className="text-xs font-bold bg-white text-[var(--c-text-main)] px-3 py-1 rounded retro-press hover:bg-[var(--c-bg-main)] text-center flex-1 sm:flex-none"
                    aria-label={`Download ${fileData.baseName} as SRT`}
                >
                    SRT
                </a>
                <a
                    href={urls.vtt}
                    download={`${fileData.baseName}.vtt`}
                    className="text-xs font-bold bg-[var(--c-secondary)] text-white px-3 py-1 rounded retro-press hover:opacity-90 text-center flex-1 sm:flex-none"
                    aria-label={`Download ${fileData.baseName} as VTT`}
                >
                    VTT
                </a>
                <a
                    href={urls.txt}
                    download={`${fileData.baseName}.txt`}
                    className="text-xs font-bold bg-[var(--c-accent)] text-[var(--c-text-main)] px-3 py-1 rounded retro-press hover:opacity-90 text-center flex-1 sm:flex-none"
                    aria-label={`Download ${fileData.baseName} as TXT`}
                >
                    TXT
                </a>
                <a
                    href={urls.pdf}
                    download={`${fileData.baseName}.pdf`}
                    className="text-xs font-bold bg-[var(--c-primary)] text-white px-3 py-1 rounded retro-press hover:opacity-90 text-center flex-1 sm:flex-none"
                    aria-label={`Download ${fileData.baseName} as PDF`}
                >
                    PDF
                </a>
            </div>
        </li>
    );
}
