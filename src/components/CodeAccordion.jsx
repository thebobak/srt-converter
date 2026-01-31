const codeSnippet = `/**
 * PDF Generation Logic
 * Design System: Uses Helvetica (standard PDF font)
 * but paginates nicely.
 */
function generatePdfBlob(text, title) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Layout Config
    const margin = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const maxWidth = doc.internal.pageSize.width - (margin * 2);
    let y = margin + 10;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, margin, margin);

    // Body Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // Split text into paragraphs
    const paragraphs = text.split('\\n\\n');

    paragraphs.forEach(para => {
        // Wrap text to fit width
        const lines = doc.splitTextToSize(para, maxWidth);

        // Check if we need a new page
        if (y + (lines.length * lineHeight) > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }

        doc.text(lines, margin, y);
        y += (lines.length * lineHeight) + lineHeight;
    });

    return doc.output('blob');
}`;

export function CodeAccordion() {
    return (
        <div className="mt-8 pt-6 border-t-2 border-dashed border-[var(--c-border)] text-left">
            <details className="group">
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-[var(--c-text-main)] hover:text-[var(--c-primary)] transition select-none">
                    <span className="flex items-center gap-2 font-mono text-sm uppercase">
                        <span className="border border-[var(--c-border)] w-5 h-5 flex items-center justify-center rounded text-xs">?</span>
                        View Source Logic
                    </span>
                    <span className="transition transform group-open:rotate-180 border-2 border-[var(--c-border)] rounded bg-white w-6 h-6 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(43,45,66,1)]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </summary>

                <div className="mt-4 text-sm font-mono leading-relaxed">
                    <div className="p-2 bg-[var(--c-text-main)] text-white border-2 border-[var(--c-border)] border-b-0 rounded-t-lg text-xs uppercase tracking-wider font-bold flex justify-between items-center">
                        <span>logic.js</span>
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-[var(--c-primary)] rounded-full" />
                            <span className="w-2 h-2 bg-[var(--c-accent)] rounded-full" />
                        </div>
                    </div>
                    <pre className="bg-[#272822] text-[#f8f8f2] p-4 overflow-x-auto border-2 border-[var(--c-border)] rounded-b-[var(--radius-main)] m-0">
                        <code>{codeSnippet}</code>
                    </pre>
                </div>
            </details>
        </div>
    );
}
