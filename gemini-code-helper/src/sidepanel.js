// --- Final UI Logic for Gemini Code Helper Side Panel ---

document.addEventListener('DOMContentLoaded', () => {
    // Tab Elements
    const tabResult = document.getElementById('tab-result');
    const tabHelp = document.getElementById('tab-help');
    const contentResult = document.getElementById('content-result');
    const contentHelp = document.getElementById('content-help');
    const btnVoice = document.getElementById('btn-voice');
    const btnOcr = document.getElementById('btn-ocr');
    const btnTheme = document.getElementById('btn-theme');
    const btnSettings = document.getElementById('btn-settings');
    const tabExplain = document.getElementById('tab-explain');
    const tabOptimize = document.getElementById('tab-optimize');
    const tabConvert = document.getElementById('tab-convert');
    const tabReview = document.getElementById('tab-review');
    const tabSummarize = document.getElementById('tab-summarize');
    const tabTranslate = document.getElementById('tab-translate');
    const tabDocs = document.getElementById('tab-docs');
    const tabProofread = document.getElementById('tab-proofread');
    const tabSecurity = document.getElementById('tab-security');
    const tabPerformance = document.getElementById('tab-performance');
    const tabAccessibility = document.getElementById('tab-accessibility');
    const dropZone = document.getElementById('drop-zone');

    // Content Elements
    const welcomeScreen = document.getElementById('welcome');
    const outputContainer = document.getElementById('output');

    // --- Tab Switching Logic ---
    tabResult.addEventListener('click', () => {
        contentResult.classList.remove('hidden');
        contentHelp.classList.add('hidden');
        tabResult.classList.add('tab-active');
        tabHelp.classList.remove('tab-active');
    });

    tabHelp.addEventListener('click', () => {
        contentHelp.classList.remove('hidden');
        contentResult.classList.add('hidden');
        tabHelp.classList.add('tab-active');
        tabResult.classList.remove('tab-active');
    });

    // --- Message Listener from background.js ---
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        // Ignore messages not intended for this tab
        if (message.tabId && sender.id === chrome.runtime.id) {
            // When a message is received, automatically switch to the result tab
            tabResult.click(); 
        
            if (message.type === 'EXPLAIN_SELECTION') {
                runExplain(message.text);
            } else if (message.type === 'CONVERT_SELECTION') {
                runConvert(message.text, message.lang);
            } else if (message.type === 'REFACTOR_SELECTION') {
                runRefactor(message.text);
            } else if (message.type === 'ANALYZE_IMAGE') {
                analyzeImage(message.srcUrl);
            } else if (message.action === 'loading') {
                displayLoadingState(message.title);
            } else if (message.action === 'displayResult') {
                if (message.isRefactor) {
                    displayRefactorOutput(message.title, message.content);
                } else {
                    displayAIOutput(message.title, message.content);
                }
            } else if (message.action === 'displayError') {
                displayErrorState(message.error);
            }
        }
    });
    }

    // --- Display Functions ---
    function displayLoadingState(title) {
        welcomeScreen.classList.add('hidden');
        outputContainer.classList.remove('hidden');
        outputContainer.innerHTML = `
            <div class="p-4 rounded-lg bg-gray-800 border border-gray-700 fade-in">
                <h2 class="text-lg font-semibold text-teal-400 mb-3">${title}</h2>
                <div class="flex items-center space-x-2 text-gray-400">
                    <div class="w-4 h-4 border-2 border-t-teal-400 border-r-teal-400 border-b-teal-400 border-l-gray-600 rounded-full animate-spin"></div>
                    <span>Generating response...</span>
                </div>
            </div>
        `;
    }

    function displayErrorState(error) {
        welcomeScreen.classList.add('hidden');
        outputContainer.classList.remove('hidden');
        outputContainer.innerHTML = `
            <div class="p-4 rounded-lg bg-red-900/50 border border-red-700 fade-in">
                <h2 class="text-lg font-semibold text-red-400 mb-2">An Error Occurred</h2>
                <p class="text-red-300">${error}</p>
            </div>
        `;
    }

    // Standard display for "Explain" and "Convert"
    function displayAIOutput(title, content) {
        welcomeScreen.classList.add('hidden');
        outputContainer.classList.remove('hidden');
        
        const sanitizedContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let formattedContent = sanitizedContent;
        try {
            if (typeof marked !== 'undefined' && marked?.parse) {
                formattedContent = marked.parse(sanitizedContent);
            } else {
                formattedContent = `<pre><code class="language-markdown">${sanitizedContent}</code></pre>`;
            }
        } catch {
            formattedContent = `<pre><code class="language-markdown">${sanitizedContent}</code></pre>`;
        }

        const outputBlock = document.createElement('div');
        outputBlock.className = 'fade-in';
        outputBlock.innerHTML = `
            <h2 class="text-lg font-semibold text-teal-400 mb-3">${title}</h2>
            <div class="prose prose-invert max-w-none prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 p-4 rounded-lg bg-gray-800 border border-gray-700">${formattedContent}</div>
        `;
        
        outputContainer.innerHTML = '';
        outputContainer.appendChild(outputBlock);
        try { Prism.highlightAllUnder(outputBlock); } catch {}
        addCopyButtons(outputBlock);
    }
    
    // Special Comparison View for "Refactor"
    function displayRefactorOutput(title, content) {
        welcomeScreen.classList.add('hidden');
        outputContainer.classList.remove('hidden');

        const { explanation, originalCode, optimizedCode } = content;
        
        let explanationHtml = explanation.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        try {
            if (typeof marked !== 'undefined' && marked?.parse) {
                explanationHtml = marked.parse(explanationHtml);
            } else {
                explanationHtml = `<pre><code class="language-markdown">${explanationHtml}</code></pre>`;
            }
        } catch {
            explanationHtml = `<pre><code class="language-markdown">${explanationHtml}</code></pre>`;
        }

        const outputBlock = document.createElement('div');
        outputBlock.className = 'fade-in space-y-4';
        outputBlock.innerHTML = `
            <h2 class="text-lg font-semibold text-teal-400">${title}</h2>
            
            <div class="prose prose-invert max-w-none p-4 rounded-lg bg-gray-800 border border-gray-700">${explanationHtml}</div>

            <div>
                <h3 class="text-md font-semibold text-red-400 mb-2">Original Code</h3>
                <div class="relative p-4 rounded-lg bg-gray-800 border border-gray-700">
                    <pre><code class="language-js">${originalCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
                </div>
            </div>

            <div>
                <h3 class="text-md font-semibold text-green-400 mb-2">Optimized Code</h3>
                <div class="relative p-4 rounded-lg bg-gray-800 border border-green-700/50">
                    <pre><code class="language-js">${optimizedCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
                </div>
            </div>
        `;

        outputContainer.innerHTML = '';
        outputContainer.appendChild(outputBlock);
        addCopyButtons(outputBlock);
    }

    // Helper function to add "Copy" buttons to all code blocks
    function addCopyButtons(container) {
        const codeBlocks = container.querySelectorAll('pre code');
        codeBlocks.forEach(codeBlock => {
            const wrapper = codeBlock.parentElement;
            wrapper.classList.add('relative');

            const copyButton = document.createElement('button');
            copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
                <span class="copy-text">Copy</span>`;
            copyButton.className = 'absolute top-2 right-2 flex items-center space-x-1 bg-gray-700 hover:bg-teal-500 text-gray-300 hover:text-white font-bold py-1 px-2 rounded text-xs transition duration-200 ease-in-out';
            
            wrapper.insertBefore(copyButton, codeBlock);

            copyButton.addEventListener('click', () => {
                const code = codeBlock.innerText;
                navigator.clipboard.writeText(code).then(() => {
                    const textSpan = copyButton.querySelector('.copy-text');
                    if (textSpan) textSpan.textContent = 'Copied!';
                    setTimeout(() => {
                       if (textSpan) textSpan.textContent = 'Copy';
                    }, 2000);
                });
            });
        });
    }

    // --- AI Session and Feature Wrappers ---
    async function getTextSession() {
        if (!window.ai || !window.ai.createTextSession) {
            displayErrorState('Chrome AI Prompt API is unavailable. Please enable chrome://settings/ai');
            throw new Error('AI unavailable');
        }
        return window.ai.createTextSession({
            systemPrompt: 'You are a helpful code assistant focused on clarity and precision.',
            temperature: 0.2,
        });
    }

    async function callFeature(kind, input, opts = {}) {
        const session = await getTextSession();
        const templates = {
            prompt: '{content}',
            proofreader: 'Polish grammar, spelling, and tone of the following comments/documentation. Keep code unchanged.\n\n---\n{content}\n---',
            summarizer: 'Summarize the code/file concisely. Highlight responsibilities, inputs/outputs, and caveats.\n\n---\n{content}\n---',
            translator: 'Translate comments/documentation to {lang}. Keep code and identifiers unless instructed.\n\n---\n{content}\n---',
            writer: 'Generate clear README/commit messages/tests based on this description or code.\n\n---\n{content}\n---',
            rewriter: 'Rewrite comments for clarity and professionalism. Keep technical accuracy.\n\n---\n{content}\n---',
            convert: 'Convert the following code to {lang}. Preserve behavior and add comments for differences.\n\n---\n{content}\n---',
            refactor: 'Analyze and refactor the following code. Provide an explanation, original code, and optimized code. Return JSON with keys: explanation, originalCode, optimizedCode.\n\n---\n{content}\n---'
        };
        const tpl = templates[kind] || templates.prompt;
        const prompt = tpl.replace('{content}', input || '').replace('{lang}', opts.lang || 'English');
        return session.prompt(prompt);
    }

    // --- Actions ---
    async function runExplain(text) {
        displayLoadingState('Explaining selection...');
        try {
            const out = await callFeature('summarizer', text);
            displayAIOutput('Explanation', out);
            speakSafe('Explanation ready');
        } catch (e) {
            displayErrorState(String(e));
        }
    }

    async function runConvert(text, lang) {
        displayLoadingState(`Converting to ${lang}...`);
        try {
            const out = await callFeature('convert', text, { lang });
            displayAIOutput(`Converted to ${lang}`, out);
            speakSafe(`Converted to ${lang}`);
        } catch (e) {
            displayErrorState(String(e));
        }
    }

    async function runRefactor(text) {
        displayLoadingState('Suggesting optimization/refactor...');
        try {
            const raw = await callFeature('refactor', text);
            let content;
            try { content = JSON.parse(raw); } catch { content = { explanation: raw, originalCode: text, optimizedCode: raw }; }
            displayRefactorOutput('Refactor Suggestions', content);
            speakSafe('Refactor suggestions ready');
        } catch (e) {
            displayErrorState(String(e));
        }
    }

    // --- OCR for Image Analysis ---
    async function ocrImage(srcUrl) {
        try {
            const mod = await import('https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js');
            const { createWorker } = mod;
            const worker = await createWorker({ logger: m => console.log(m) });
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(srcUrl);
            await worker.terminate();
            return text;
        } catch (e) {
            console.error('OCR error', e);
            throw e;
        }
    }

    async function analyzeImage(srcUrl) {
        displayLoadingState('Analyzing image...');
        try {
            const text = await ocrImage(srcUrl);
            const result = await callFeature('summarizer', `Extracted text:\n${text}\n\nAnalyze as code or diagram. Explain intent and produce pseudocode or component map.`);
            displayAIOutput('Image Analysis', result);
            speakSafe('Image analysis ready');
        } catch (e) {
            displayErrorState(String(e));
        }
    }

    // --- Voice Commands and Speech ---
    function startVoiceCommands() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Voice recognition not supported.'); return; }
        const rec = new SR();
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.continuous = false;
        rec.onresult = async (e) => {
            const text = e.results[0][0].transcript;
            routeVoiceCommand(text);
        };
        rec.start();
    }

    async function routeVoiceCommand(text) {
        if (/explain/i.test(text)) {
            runExplain(await getCurrentSelectionText());
        } else if (/convert.*python/i.test(text)) {
            runConvert(await getCurrentSelectionText(), 'Python');
        } else if (/refactor|optimi(z|s)e/i.test(text)) {
            runRefactor(await getCurrentSelectionText());
        } else {
            const out = await callFeature('writer', text);
            displayAIOutput('Generated Content', out);
        }
    }

    function speakSafe(text) {
        try {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US';
            speechSynthesis.speak(u);
        } catch {}
    }

    // --- Selection Helpers ---
    async function getCurrentSelectionText() {
        try {
            if (!(typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting)) {
                return window.getSelection?.().toString() || '';
            }
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab?.id) return '';
            const [{ result }] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => window.getSelection()?.toString() || ''
            });
            return result || '';
        } catch {
            return '';
        }
    }

    // --- Caching Helpers ---
    async function cacheGet(key) { return (await chrome.storage.local.get(key))[key]; }
    async function cacheSet(key, value) { await chrome.storage.local.set({ [key]: value }); }
    async function hashInput(input) {
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(input));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Example: Use cache in explain
    const originalRunExplain = runExplain;
    runExplain = async (text) => {
        const key = 'explain:' + await hashInput(text);
        const cached = await cacheGet(key);
        if (cached) { displayAIOutput('Explanation (cached)', cached); return; }
        await originalRunExplain(text);
        // The displayAIOutput call above prints fresh output; also store it
        try {
            const out = await callFeature('summarizer', text);
            await cacheSet(key, out);
        } catch {}
    };

    // --- UI Buttons and Theme Toggle ---
    btnVoice?.addEventListener('click', startVoiceCommands);
    btnOcr?.addEventListener('click', async () => {
        const url = prompt('Enter image URL to analyze');
        if (url) analyzeImage(url);
    });
    btnTheme?.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });
    btnSettings?.addEventListener('click', async () => {
        const enableCloud = confirm('Enable optional cloud processing for complex tasks?');
        await chrome.storage.local.set({ enableCloud });
    });

    tabExplain?.addEventListener('click', async () => {
        runExplain(await getCurrentSelectionText());
    });
    tabOptimize?.addEventListener('click', async () => {
        runRefactor(await getCurrentSelectionText());
    });
    tabConvert?.addEventListener('click', async () => {
        const lang = prompt('Target language (e.g., Python, JavaScript)') || 'Python';
        runConvert(await getCurrentSelectionText(), lang);
    });
    tabReview?.addEventListener('click', async () => {
        const text = await getCurrentSelectionText();
        const out = await callFeature('rewriter', text);
        displayAIOutput('Review', out);
    });
    tabSummarize?.addEventListener('click', async () => {
        const text = await getCurrentSelectionText();
        const out = await callFeature('summarizer', text);
        displayAIOutput('Summary', out);
    });
    tabTranslate?.addEventListener('click', async () => {
        const text = await getCurrentSelectionText();
        const lang = prompt('Translate comments to language') || 'English';
        const out = await callFeature('translator', text, { lang });
        displayAIOutput('Translated Comments', out);
    });
    tabDocs?.addEventListener('click', async () => {
        const text = await getCurrentSelectionText();
        const out = await callFeature('writer', text);
        displayAIOutput('Generated Docs', out);
    });
    tabProofread?.addEventListener('click', async () => {
        const text = await getCurrentSelectionText();
        const out = await callFeature('proofreader', text);
        displayAIOutput('Proofread', out);
    });
    tabSecurity?.addEventListener('click', async () => {
        const text = await getCurrentSelectionText();
        const out = await callFeature('writer', `Act as a security auditor. Identify vulnerabilities, injection risks, unsafe patterns in:\n\n${text}`);
        displayAIOutput('Security Audit', out);
    });
    tabPerformance?.addEventListener('click', async () => {
        const text = await getCurrentSelectionText();
        const out = await callFeature('writer', `Analyze performance bottlenecks, loops, DOM ops, memory hotspots in:\n\n${text}`);
        displayAIOutput('Performance Analysis', out);
    });
    tabAccessibility?.addEventListener('click', async () => {
        const text = await getCurrentSelectionText();
        const out = await callFeature('writer', `Check accessibility: ARIA roles, contrast, keyboard navigation issues in:\n\n${text}`);
        displayAIOutput('Accessibility Check', out);
    });

    // Drag-and-drop summarization
    dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('bg-gray-800'); });
    dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('bg-gray-800'));
    dropZone?.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('bg-gray-800');
        const file = e.dataTransfer?.files?.[0];
        if (!file) return;
        const text = await file.text();
        const out = await callFeature('summarizer', text);
        displayAIOutput(`Summary: ${file.name}`, out);
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', async (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
            runExplain(await getCurrentSelectionText());
        } else if (e.ctrlKey && e.shiftKey && e.code === 'KeyO') {
            runRefactor(await getCurrentSelectionText());
        } else if (e.ctrlKey && e.shiftKey && e.code === 'KeyV') {
            startVoiceCommands();
        }
    });
});