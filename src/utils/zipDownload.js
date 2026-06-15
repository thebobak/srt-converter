import JSZip from 'jszip';

export async function downloadZip(files) {
    const zip = new JSZip();

    files.forEach(file => {
        const name = file.exportName || file.baseName;
        zip.file(`${name}.srt`, file.srtContent);
        zip.file(`${name}.vtt`, file.vttContent);
        zip.file(`${name}.txt`, file.txtContent);
        zip.file(`${name}.pdf`, file.pdfBlob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);

    const link = document.createElement('a');
    link.href = url;
    link.download = "converted_subtitles.zip";
    link.click();
    URL.revokeObjectURL(url);
}
