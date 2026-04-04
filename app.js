"use strict";

/**
 * @fileoverview Google Cloud / Firebase Mock Application Logic
 * @description Handles client-side interactivity, security sanitization, and backend simulation.
 */

const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');

/**
 * Sanitizes and injects a new chat message into the DOM securely.
 * @param {string} text - The raw text input from the user or system.
 * @param {string} sender - The sender identity ('You' or 'System').
 * @param {string} cssClass - The CSS class for the message bubble ('sent' or 'received').
 */
function appendMessage(text, sender, cssClass) {
    if (!chatBox) return; // Guard clause for testing environments

    const newMsgDiv = document.createElement('div');
    newMsgDiv.className = `message ${cssClass}`;

    const paragraph = document.createElement('p');
    const boldSender = document.createElement('strong');
    
    // SECURITY UPGRADE: Using textContent strictly prevents Cross-Site Scripting (XSS)
    boldSender.textContent = `${sender}: `;
    paragraph.appendChild(boldSender);
    paragraph.appendChild(document.createTextNode(text));
    
    newMsgDiv.appendChild(paragraph);
    chatBox.appendChild(newMsgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

if (sendBtn && messageInput) {
    sendBtn.addEventListener('click', () => {
        const messageText = messageInput.value.trim();

        if (messageText !== "") {
            appendMessage(messageText, "You", "sent");
            messageInput.value = "";

            setTimeout(() => {
                const lowerMsg = messageText.toLowerCase();
                let botResponse = "Your message has been securely logged. A provider will review it shortly. ✅";
                
                // Simple Chatbot Decision Logic
                if (lowerMsg.includes("appointment") || lowerMsg.includes("schedule")) {
                    botResponse = "I see you're asking about scheduling. Would you like to see available times for Dr. Smith this week? 📅";
                } else if (lowerMsg.includes("prescription") || lowerMsg.includes("refill") || lowerMsg.includes("medication")) {
                    botResponse = "I have flagged your refill request. Your provider will authorize it with your pharmacy within 24 hours. 💊";
                } else if (lowerMsg.includes("pain") || lowerMsg.includes("hurt") || lowerMsg.includes("emergency")) {
                    botResponse = "If you are experiencing a medical emergency, please call 911 immediately or go to the nearest emergency room. 🚨";
                } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
                    botResponse = "Hello! I am the HealthConnect virtual assistant. How can I help coordinate your care today? 🏥";
                }

                appendMessage(botResponse, "HealthConnect Assistant", "received");
            }, 1200);
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendBtn.click();
        }
    });
}

console.log("HealthConnect Web App Initialized. Security policies enforced.");

// Export context for the Unit Testing framework
if (typeof module !== 'undefined') {
    module.exports = { appendMessage };
}
