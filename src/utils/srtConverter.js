import { jsPDF } from 'jspdf';

export function convertSrtToVtt(srtContent) {
    const blocks = srtContent.trim().split(/\r?\n\r?\n/);
    let vttContent = 'WEBVTT\n\n';

    blocks.forEach(block => {
        const lines = block.split(/\r?\n/);
        const timeIndex = lines.findIndex(l => l.includes('-->'));

        if (timeIndex !== -1) {
            const timestampLine = lines[timeIndex];
            const textLines = lines.slice(timeIndex + 1);

            const vttTimestamp = timestampLine.replace(/,/g, '.');
            vttContent += vttTimestamp + '\n';
            vttContent += textLines.join('\n') + '\n\n';
        }
    });
    return vttContent;
}

export function parseSrtTimestamp(timeString) {
    if (!timeString) return 0;
    const parts = timeString.trim().replace(',', '.').split(':');
    if (parts.length < 3) return 0;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const secondsParts = parts[2].split('.');
    const seconds = parseInt(secondsParts[0], 10);
    const ms = parseInt(secondsParts[1] || '0', 10);

    return (hours * 3600) + (minutes * 60) + seconds + (ms / 1000);
}

export function isSentenceEnd(text) {
    if (!text) return false;

    const trimmed = text.trim();
    if (!/[.!?]["']?$/.test(trimmed)) return false;
    if (/[!?]["']?$/.test(trimmed)) return true;

    const clean = trimmed.replace(/["']$/, '');
    const abbrevs = [
        'mr.', 'mrs.', 'ms.', 'dr.', 'prof.', 'sr.', 'jr.', 'st.',
        'mt.', 'ft.', 'etc.', 'vs.', 'e.g.', 'i.e.', 'a.m.', 'p.m.',
        'capt.', 'gen.', 'col.', 'lt.', 'maj.', 'sgt.', 're.', 'est.'
    ];

    const lower = clean.toLowerCase();
    const lastWord = lower.split(' ').pop();

    if (abbrevs.includes(lastWord)) return false;
    if (/[a-z]\.[a-z]\.$/.test(lower)) return false;
    if (/\s[a-z]\.$/.test(lower)) return false;

    return true;
}

export function convertSrtToSmartTxt(srtContent) {
    const blocks = srtContent.trim().split(/\r?\n\r?\n/);

    let paragraphs = [];
    let currentParagraphText = [];
    let paragraphStartTime = null;
    let lastBlockEndTime = 0;

    blocks.forEach(block => {
        const lines = block.split(/\r?\n/);
        const timeIndex = lines.findIndex(l => l.includes('-->'));

        if (timeIndex !== -1) {
            const timeLine = lines[timeIndex];
            const [startStr, endStr] = timeLine.split(' --> ');

            const startTime = parseSrtTimestamp(startStr);
            const endTime = parseSrtTimestamp(endStr);

            const rawTextLines = lines.slice(timeIndex + 1);
            const cleanText = rawTextLines
                .join(' ')
                .replace(/<[^>]*>/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            if (!cleanText) return;

            if (paragraphStartTime === null) paragraphStartTime = startTime;

            const isSignificantPause = (lastBlockEndTime > 0) && ((startTime - lastBlockEndTime) > 2.0);
            const currentDuration = endTime - paragraphStartTime;
            const endsWithSentencePunctuation = isSentenceEnd(cleanText);
            const isTimeLimitReached = currentDuration > 10;

            if (isSignificantPause && currentParagraphText.length > 0) {
                paragraphs.push(currentParagraphText.join(' '));
                currentParagraphText = [];
                paragraphStartTime = startTime;
            }

            currentParagraphText.push(cleanText);
            lastBlockEndTime = endTime;

            if (isTimeLimitReached && endsWithSentencePunctuation) {
                paragraphs.push(currentParagraphText.join(' '));
                currentParagraphText = [];
                paragraphStartTime = null;
            }
        }
    });

    if (currentParagraphText.length > 0) {
        paragraphs.push(currentParagraphText.join(' '));
    }

    return paragraphs.join('\n\n');
}

function addPageFooter(doc, footerText) {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;

    doc.setDrawColor(150, 150, 150);
    doc.line(margin, pageHeight - margin - 6, pageWidth - margin, pageHeight - margin - 6);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(footerText, margin, pageHeight - margin);

    doc.setTextColor(0, 0, 0);
}

export function generatePdfBlob(text, title, footer = '') {
    const doc = new jsPDF();

    const margin = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const maxWidth = doc.internal.pageSize.width - (margin * 2);
    const bottomBoundary = pageHeight - margin - (footer ? 12 : 0);
    let y = margin + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title || "Transcript", margin, margin);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const paragraphs = text.split('\n\n');

    paragraphs.forEach(para => {
        const lines = doc.splitTextToSize(para, maxWidth);

        lines.forEach(line => {
            if (y + lineHeight > bottomBoundary) {
                if (footer) addPageFooter(doc, footer);
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin, y);
            y += lineHeight;
        });
        y += lineHeight;
    });

    if (footer) addPageFooter(doc, footer);

    return doc.output('blob');
}

export async function processFile(file, footer = '') {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const srtContent = e.target.result;
                const vttContent = convertSrtToVtt(srtContent);
                const txtContent = convertSrtToSmartTxt(srtContent);

                const baseName = file.name.replace(/\.[^/.]+$/, "");
                const pdfBlob = generatePdfBlob(txtContent, baseName, footer);

                resolve({
                    originalName: file.name,
                    baseName: baseName,
                    srtContent: srtContent,
                    vttContent: vttContent,
                    txtContent: txtContent,
                    pdfBlob: pdfBlob
                });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}
