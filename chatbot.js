// Chatbot UI Controller
class ChatbotUI {
    constructor() {
        this.chatArea = document.getElementById('chatArea');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.charCount = document.getElementById('charCount');
        
        this.initializeEventListeners();
        this.messageHistory = [];
    }

    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Character count
        this.messageInput.addEventListener('input', () => {
            const length = this.messageInput.value.length;
            this.charCount.textContent = length;
            
            if (length > 450) {
                this.charCount.style.color = '#ef4444';
            } else if (length > 400) {
                this.charCount.style.color = '#f59e0b';
            } else {
                this.charCount.style.color = '#6b7280';
            }
        });

        // Auto-resize input
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Disable input while processing
        this.setInputState(false);
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.charCount.textContent = '0';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate thinking time
        await this.delay(1000 + Math.random() * 1000);
        
        // Get response from TF-IDF chatbot
        const response = window.chatbot.findBestAnswer(message);
        
        // Hide typing indicator
        this.hideTypingIndicator();
        
        // Add bot response
        this.addMessage(response.answer, 'bot', response.confidence);
        
        // Re-enable input
        this.setInputState(true);
        
        // Store in history
        this.messageHistory.push({
            user: message,
            bot: response.answer,
            confidence: response.confidence,
            timestamp: new Date()
        });
    }

    addMessage(text, sender, confidence = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start space-x-3 animate-slide-up`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <div class="chat-bubble bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-4 shadow-sm ml-auto">
                    <p>${this.escapeHtml(text)}</p>
                </div>
            `;
            messageDiv.classList.add('flex-row-reverse');
        } else {
            const confidenceBar = confidence ? this.getConfidenceIndicator(confidence) : '';
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="chat-bubble bg-white rounded-lg p-4 shadow-sm border">
                    <p class="text-gray-800">${this.formatBotResponse(text)}</p>
                    ${confidenceBar}
                </div>
            `;
        }
        
        this.chatArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatBotResponse(text) {
        // Add some basic formatting for better readability
        return text
            .replace(/(\d+\))/g, '<br><strong>$1</strong>')
            .replace(/([A-Z][^.!?]*[.!?])/g, '$1<br>')
            .replace(/<br><br>/g, '<br>')
            .replace(/^<br>/, '');
    }

    getConfidenceIndicator(confidence) {
        const percentage = Math.round(confidence * 100);
        let color = 'bg-red-500';
        let label = 'Rendah';
        
        if (confidence > 0.7) {
            color = 'bg-green-500';
            label = 'Tinggi';
        } else if (confidence > 0.4) {
            color = 'bg-yellow-500';
            label = 'Sedang';
        }
        
        return `
            <div class="mt-2 text-xs text-gray-500">
                <div class="flex items-center space-x-2">
                    <span>Confidence:</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div class="${color} h-1.5 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                    </div>
                    <span>${label} (${percentage}%)</span>
                </div>
            </div>
        `;
    }

    showTypingIndicator() {
        this.typingIndicator.classList.add('show');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.classList.remove('show');
    }

    setInputState(enabled) {
        this.messageInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.messageInput.focus();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatArea.scrollTop = this.chatArea.scrollHeight;
        }, 100);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Export chat history
    exportHistory() {
        const data = {
            chatHistory: this.messageHistory,
            exportDate: new Date().toISOString(),
            totalMessages: this.messageHistory.length
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Clear chat history
    clearChat() {
        if (confirm('Apakah Anda yakin ingin menghapus semua riwayat chat?')) {
            this.chatArea.innerHTML = `
                <div class="flex items-start space-x-3 animate-fade-in">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="chat-bubble bg-white rounded-lg p-4 shadow-sm border">
                        <p class="text-gray-800">Halo! Saya adalah AI Chatbot yang menggunakan teknologi TF-IDF untuk memahami pertanyaan Anda. Silakan tanya apa saja!</p>
                    </div>
                </div>
                <div id="typingIndicator" class="typing-indicator items-start space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="chat-bubble bg-white rounded-lg p-4 shadow-sm border">
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                    </div>
                </div>
            `;
            this.typingIndicator = document.getElementById('typingIndicator');
            this.messageHistory = [];
        }
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('messageInput').focus();
    }
    
    // Ctrl/Cmd + L to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        chatUI.clearChat();
    }
});

// Initialize chatbot UI when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chatUI = new ChatbotUI();
    
    // Add some sample suggestions
    setTimeout(() => {
        const suggestions = [
            "Apa itu artificial intelligence?",
            "Bagaimana cara belajar programming?",
            "Apa itu web development?",
            "Bagaimana cara membuat website?"
        ];
        
        // You could add suggestion buttons here if needed
        console.log('Chatbot ready! Try asking:', suggestions);
    }, 1000);
});

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

