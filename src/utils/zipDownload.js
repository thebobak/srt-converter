import JSZip from 'jszip';

export async function downloadZip(files) {
    const zip = new JSZip();

    files.forEach(file => {
        zip.file(file.originalName, file.srtContent);
        zip.file(`${file.baseName}.vtt`, file.vttContent);
        zip.file(`${file.baseName}.txt`, file.txtContent);
        zip.file(`${file.baseName}.pdf`, file.pdfBlob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);

    const link = document.createElement('a');
    link.href = url;
    link.download = "converted_subtitles.zip";
    link.click();
    URL.revokeObjectURL(url);
}
