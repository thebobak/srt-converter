import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultItem } from './components/ResultItem';
import { CodeAccordion } from './components/CodeAccordion';
import { processFile } from './utils/srtConverter';
import { downloadZip } from './utils/zipDownload';
import './App.css';

function App() {
    const [processedFiles, setProcessedFiles] = useState([]);
    const [status, setStatus] = useState('');
    const [showResults, setShowResults] = useState(false);

    const handleFilesSelected = async (files) => {
        setStatus('Processing files...');
        setShowResults(false);

        try {
            const promises = files.map(file => processFile(file));
            const results = await Promise.all(promises);
            results.sort((a, b) => a.originalName.localeCompare(b.originalName));

            setProcessedFiles(results);
            setShowResults(true);
            setStatus(`DONE. ${files.length} FILE${files.length !== 1 ? 'S' : ''} PROCESSED.`);
        } catch (error) {
            console.error(error);
            setStatus('ERROR IN PROCESSING.');
        }
    };

    const handleReset = () => {
        setProcessedFiles([]);
        setShowResults(false);
        setStatus('');
    };

    const handleDownloadZip = () => {
        downloadZip(processedFiles);
    };

    return (
        <>
            {/* Main Card */}
            <div className="bg-[var(--c-bg-card)] rounded-[var(--radius-main)] retro-shadow max-w-3xl w-full text-center transition-all duration-300 relative overflow-hidden flex flex-col">
                {/* Window Title Bar */}
                <div className="w-full h-10 bg-[var(--c-secondary)] border-b-2 border-[var(--c-border)] flex items-center justify-end px-4 gap-2 shrink-0">
                    <div className="w-3 h-3 rounded-full border-2 border-[var(--c-border)] bg-[var(--c-primary)] shadow-sm" />
                    <div className="w-3 h-3 rounded-full border-2 border-[var(--c-border)] bg-[var(--c-accent)] shadow-sm" />
                </div>

                {/* Content Area */}
                <div className="p-8">
                    <h1 className="text-4xl font-bold mb-3 text-[var(--c-text-main)] tracking-tight mt-2">
                        SRT CONVERTER
                    </h1>
                    <div className="inline-block bg-[var(--c-accent)] border-2 border-[var(--c-border)] px-2 py-0.5 rounded-full mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-text-main)] font-mono">
                            V.2.0 &bull; AUTO-FORMAT
                        </span>
                    </div>

                    <p className="text-[var(--c-text-muted)] mb-8 text-lg max-w-lg mx-auto leading-relaxed">
                        Upload your subtitles. We'll handle the timecodes, line breaks, and formatting.
                    </p>

                    {/* File Upload (hidden when showing results) */}
                    {!showResults && (
                        <FileUpload onFilesSelected={handleFilesSelected} />
                    )}

                    {/* Privacy Disclaimer */}
                    {!showResults && (
                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[var(--c-text-muted)] mb-6 uppercase tracking-tight">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Local Browser Processing Only</span>
                        </div>
                    )}

                    {/* Status message */}
                    <p className="text-sm font-bold text-[var(--c-primary)] mb-4 h-6 font-mono">
                        {status}
                    </p>

                    {/* Global Actions (Download All & Reset) */}
                    {showResults && (
                        <div className="mb-8 flex flex-wrap justify-center gap-4">
                            <button
                                onClick={handleDownloadZip}
                                className="bg-[var(--c-primary)] text-white font-bold py-3 px-6 rounded-[var(--radius-main)] flex items-center justify-center space-x-3 text-lg retro-press retro-press-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>DOWNLOAD ZIP</span>
                            </button>

                            <button
                                onClick={handleReset}
                                className="bg-white text-[var(--c-text-main)] border-2 border-[var(--c-border)] font-bold py-3 px-6 rounded-[var(--radius-main)] flex items-center justify-center space-x-3 text-lg retro-press retro-press-lg hover:bg-gray-50"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>RESET</span>
                            </button>
                        </div>
                    )}

                    {/* Results List */}
                    {showResults && (
                        <div className="text-left max-h-80 overflow-y-auto overflow-x-hidden border-t-2 border-[var(--c-border)] pt-6 space-y-3">
                            {processedFiles.map((fileData, index) => (
                                <ResultItem key={index} fileData={fileData} />
                            ))}
                        </div>
                    )}

                    {/* Code Accordion */}
                    <CodeAccordion />
                </div>
            </div>

            {/* Attribution Footer */}
            <footer className="mt-8 text-center animate-pulse">
                <p className="text-[var(--c-text-muted)] text-xs font-mono uppercase tracking-widest">
                    Vibe coded by Bobak with <span className="text-[var(--c-primary)] font-bold">GEMINI</span> and <span className="text-[var(--c-primary)] font-bold">CLAUDE CODE</span>
                </p>
            </footer>
        </>
    );
}

export default App;
