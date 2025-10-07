// --- Final UI Logic for Gemini Code Helper Side Panel ---

document.addEventListener('DOMContentLoaded', () => {
    // Tab Elements
    const tabResult = document.getElementById('tab-result');
    const tabHelp = document.getElementById('tab-help');
    const contentResult = document.getElementById('content-result');
    const contentHelp = document.getElementById('content-help');

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
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        // Ignore messages not intended for this tab
        if (message.tabId && sender.id === chrome.runtime.id) {
            // When a message is received, automatically switch to the result tab
            tabResult.click(); 
        
            if (message.action === 'loading') {
                displayLoadingState(message.title);
            } else if (message.action === 'displayResult') {
                if (message.isRefactor) {
                    // Use the special comparison view for refactoring
                    displayRefactorOutput(message.title, message.content);
                } else {
                    displayAIOutput(message.title, message.content);
                }
            } else if (message.action === 'displayError') {
                displayErrorState(message.error);
            }
        }
    });

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
        const formattedContent = marked.parse(sanitizedContent);

        const outputBlock = document.createElement('div');
        outputBlock.className = 'fade-in';
        outputBlock.innerHTML = `
            <h2 class="text-lg font-semibold text-teal-400 mb-3">${title}</h2>
            <div class="prose prose-invert max-w-none prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 p-4 rounded-lg bg-gray-800 border border-gray-700">${formattedContent}</div>
        `;
        
        outputContainer.innerHTML = '';
        outputContainer.appendChild(outputBlock);
        addCopyButtons(outputBlock);
    }
    
    // Special Comparison View for "Refactor"
    function displayRefactorOutput(title, content) {
        welcomeScreen.classList.add('hidden');
        outputContainer.classList.remove('hidden');

        const { explanation, originalCode, optimizedCode } = content;
        
        const explanationHtml = marked.parse(explanation.replace(/</g, "&lt;").replace(/>/g, "&gt;"));

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
});