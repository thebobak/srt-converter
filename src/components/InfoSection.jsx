export function InfoSection() {
    return (
        <div className="mt-2 mb-6 text-left max-w-lg mx-auto">
            <details className="group">
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-[var(--c-text-main)] hover:text-[var(--c-primary)] transition select-none">
                    <span className="flex items-center gap-2 font-mono text-sm uppercase">
                        <span className="border border-[var(--c-border)] w-5 h-5 flex items-center justify-center rounded text-xs">i</span>
                        How It Works
                    </span>
                    <span className="transition transform group-open:rotate-180 border-2 border-[var(--c-border)] rounded bg-white w-6 h-6 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(43,45,66,1)]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </summary>

                <div className="mt-4 bg-[var(--c-bg-main)] border-2 border-[var(--c-border)] rounded-[var(--radius-main)] p-4 text-sm space-y-4">
                    {/* Output Formats */}
                    <div>
                        <h3 className="font-bold text-[var(--c-text-main)] mb-2">Output Formats</h3>
                        <ul className="space-y-1 text-[var(--c-text-muted)]">
                            <li><span className="font-mono font-bold text-[var(--c-secondary)]">VTT</span> — Web-compatible subtitle format for HTML5 video players</li>
                            <li><span className="font-mono font-bold text-[var(--c-accent)]">TXT</span> — Clean transcript with smart paragraph grouping</li>
                            <li><span className="font-mono font-bold text-[var(--c-primary)]">PDF</span> — Formatted document ready for print or sharing</li>
                        </ul>
                    </div>

                    {/* Tips */}
                    <div>
                        <h3 className="font-bold text-[var(--c-text-main)] mb-2">Tips</h3>
                        <ul className="space-y-1 text-[var(--c-text-muted)] list-disc list-inside">
                            <li>The PDF title uses your input filename — name your .srt file accordingly</li>
                            <li>Upload multiple files at once for batch conversion</li>
                            <li>Use "Download ZIP" to grab all formats in one click</li>
                        </ul>
                    </div>

                    {/* Limitations */}
                    <div>
                        <h3 className="font-bold text-[var(--c-text-main)] mb-2">Limitations</h3>
                        <ul className="space-y-1 text-[var(--c-text-muted)] list-disc list-inside">
                            <li>Only .srt format is supported as input</li>
                            <li>Styling tags in subtitles are stripped from TXT/PDF output</li>
                        </ul>
                    </div>
                </div>
            </details>
        </div>
    );
}
