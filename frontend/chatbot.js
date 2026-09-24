/**
 * SmartCivic AI - CivicBot Assistant Widget
 */

const CivicBot = {
    isOpen: false,
    backendUrl: "http://localhost:5000",

    init: function () {
        this.injectWidgetHTML();
        this.bindEvents();
        this.sendInitialGreeting();
    },

    injectWidgetHTML: function () {
        if (document.getElementById("civicBotWidget")) return;

        const widgetDiv = document.createElement("div");
        widgetDiv.id = "civicBotWidget";
        widgetDiv.innerHTML = `
            <!-- Floating Trigger Button -->
            <button id="civicChatToggle" class="civic-chat-toggle" title="Chat with CivicBot Assistant">
                🤖
                <span class="civic-chat-badge"></span>
            </button>

            <!-- Chat Modal Window -->
            <div id="civicChatWindow" class="civic-chat-window">
                <!-- Header -->
                <div class="civic-chat-header">
                    <div class="civic-chat-header-info">
                        <div class="civic-chat-avatar">🤖</div>
                        <div class="civic-chat-title">
                            <h3 data-i18n="chat_title">CivicBot Assistant</h3>
                            <p data-i18n="chat_subtitle">AI Municipal Help & Tracking</p>
                        </div>
                    </div>
                    <button id="civicChatClose" class="civic-chat-close-btn">&times;</button>
                </div>

                <!-- Quick Action Chips -->
                <div class="civic-chat-chips">
                    <button class="civic-chip" data-chip="track" data-i18n="chat_quick_track">🔍 Track Complaint</button>
                    <button class="civic-chip" data-chip="emergency" data-i18n="chat_quick_emergency">🚨 Emergency</button>
                    <button class="civic-chip" data-chip="how" data-i18n="chat_quick_how">✍️ How to Report?</button>
                    <button class="civic-chip" data-chip="pothole">🛣️ Potholes</button>
                    <button class="civic-chip" data-chip="garbage">🗑️ Garbage</button>
                </div>

                <!-- Chat Body -->
                <div id="civicChatBody" class="civic-chat-body"></div>

                <!-- Footer Input -->
                <form id="civicChatForm" class="civic-chat-footer">
                    <input 
                        type="text" 
                        id="civicChatInput" 
                        class="civic-chat-input" 
                        placeholder="Ask question or enter Complaint ID (SC-...)" 
                        data-i18n-ph="chat_input_ph"
                        autocomplete="off" 
                        required
                    />
                    <button type="submit" class="civic-chat-send" title="Send">➤</button>
                </form>
            </div>
        `;

        document.body.appendChild(widgetDiv);
    },

    bindEvents: function () {
        const toggleBtn = document.getElementById("civicChatToggle");
        const closeBtn = document.getElementById("civicChatClose");
        const windowEl = document.getElementById("civicChatWindow");
        const formEl = document.getElementById("civicChatForm");
        const chipsContainer = document.querySelector(".civic-chat-chips");

        toggleBtn.addEventListener("click", () => {
            this.isOpen = !this.isOpen;
            windowEl.classList.toggle("active", this.isOpen);
            if (this.isOpen) {
                document.getElementById("civicChatInput").focus();
            }
        });

        closeBtn.addEventListener("click", () => {
            this.isOpen = false;
            windowEl.classList.remove("active");
        });

        formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = document.getElementById("civicChatInput");
            const text = input.value.trim();
            if (!text) return;

            input.value = "";
            this.handleUserMessage(text);
        });

        chipsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("civic-chip")) {
                const chipType = e.target.getAttribute("data-chip");
                let msg = "";
                if (chipType === "track") msg = "How can I track my complaint?";
                else if (chipType === "emergency") msg = "Show me emergency helpline numbers";
                else if (chipType === "how") msg = "How do I report a new civic issue?";
                else if (chipType === "pothole") msg = "How are pothole complaints handled?";
                else if (chipType === "garbage") msg = "Who handles garbage collection issues?";
                else msg = e.target.textContent;

                this.handleUserMessage(msg);
            }
        });
    },

    sendInitialGreeting: function () {
        const lang = localStorage.getItem("smartcivic_lang") || "en";
        let greeting = "👋 Hello! I am **CivicBot**, your AI municipal assistant.\n\nYou can ask me to track your complaint (e.g. `SC-2026-...`), get emergency contacts, or learn how to report civic issues!";
        if (lang === "hi") {
            greeting = "👋 नमस्ते! मैं **सिविकबॉट** हूँ, आपका एआई नगर निगम सहायक।\n\nआप अपनी शिकायत ट्रैक करने के लिए उसकी आईडी (जैसे `SC-2026-...`) लिख सकते हैं, आपातकालीन नंबर मांग सकते हैं, या समस्या दर्ज करने का तरीका जान सकते हैं!";
        } else if (lang === "ta") {
            greeting = "👋 வணக்கம்! நான் **சிவிக்பாட்** AI நகராட்சி உதவியாளர்.\n\nஉங்கள் புகார் எண்ணை (எ.கா: `SC-2026-...`) உள்ளிட்டு நிலையை அறியலாம் அல்லது அவசர எண்களை பெறலாம்!";
        }
        this.addMessage(greeting, "bot");
    },

    handleUserMessage: async function (text) {
        this.addMessage(text, "user");
        this.showTypingIndicator();

        try {
            // Check if user entered a complaint ID pattern directly
            const idPattern = /SC-\d{4}-\d{6}/i;
            const match = text.match(idPattern);

            let res;
            if (match) {
                // Direct fast lookup
                res = await fetch(`${this.backendUrl}/api/complaints/track/${match[0]}`);
                const data = await res.json();
                this.removeTypingIndicator();

                if (res.ok) {
                    const reply = `📋 **Complaint #${data.complaintId}**\n\n- **Title:** ${data.title}\n- **Category:** ${data.category}\n- **Department:** ${data.department}\n- **Status:** 🟢 **${data.status}**\n- **Priority:** ${data.priority}\n- **Location:** ${data.address || data.location}\n- **Submitted:** ${new Date(data.createdAt).toLocaleDateString()}${data.resolutionNote ? `\n- **Resolution Note:** ${data.resolutionNote}` : ""}`;
                    this.addMessage(reply, "bot");
                } else {
                    this.addMessage(data.message || `No complaint found for ID \`${match[0]}\`.`, "bot");
                }
                return;
            }

            // General chat query
            const response = await fetch(`${this.backendUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            this.removeTypingIndicator();

            if (response.ok && data.reply) {
                this.addMessage(data.reply, "bot");
            } else {
                this.addMessage("I am having trouble answering right now. Please try again or check backend server.", "bot");
            }
        } catch (err) {
            console.error("Chatbot error:", err);
            this.removeTypingIndicator();
            this.addMessage("Unable to reach the SmartCivic AI server. Please verify backend is running.", "bot");
        }
    },

    addMessage: function (content, sender = "bot") {
        const chatBody = document.getElementById("civicChatBody");
        if (!chatBody) return;

        const msgDiv = document.createElement("div");
        msgDiv.className = `civic-msg ${sender}`;

        // Basic Markdown parser for bold and linebreaks
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/`(.*?)`/g, "<code style='background:rgba(0,0,0,0.06);padding:2px 4px;border-radius:4px;font-family:monospace;'>$1</code>")
            .replace(/\n/g, "<br>");

        msgDiv.innerHTML = formatted;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    },

    showTypingIndicator: function () {
        const chatBody = document.getElementById("civicChatBody");
        if (!chatBody || document.getElementById("civicTyping")) return;

        const typing = document.createElement("div");
        typing.id = "civicTyping";
        typing.className = "civic-typing-indicator";
        typing.innerHTML = `
            <div class="civic-typing-dot"></div>
            <div class="civic-typing-dot"></div>
            <div class="civic-typing-dot"></div>
        `;
        chatBody.appendChild(typing);
        chatBody.scrollTop = chatBody.scrollHeight;
    },

    removeTypingIndicator: function () {
        const indicator = document.getElementById("civicTyping");
        if (indicator) indicator.remove();
    }
};

// Auto initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    CivicBot.init();
});
