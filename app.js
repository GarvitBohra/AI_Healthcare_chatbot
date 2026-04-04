"use strict";

/**
 * @fileoverview Google Cloud / Firebase Mock Application Logic
 * @description Handles SPA Routing, JSON rendering, client-side interactivity, and security sanitization.
 */

// ==========================================
// 1. SINGLE PAGE APPLICATION (SPA) ROUTING
// ==========================================
const navButtons = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active styling from all buttons
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Hide all views
        views.forEach(v => {
            v.style.display = 'none';
            v.classList.remove('section-active');
        });
        
        // Show target view
        const targetId = btn.id.replace('nav-', 'view-');
        const targetView = document.getElementById(targetId);
        
        if (targetView) {
            targetView.style.display = 'block';
            // Slight delay allows CSS opacity transition to trigger
            setTimeout(() => targetView.classList.add('section-active'), 10);
        }
    });
});

// ==========================================
// 2. MOCK JSON DATABASE RENDERING
// ==========================================
function renderPatientDatabase() {
    const grid = document.getElementById('metrics-grid');
    
    // Ensure we are in a valid browser runtime and the DB loaded
    if (!grid || typeof patientsDatabase === 'undefined') return;

    // Loop through our 5 JSON patients
    patientsDatabase.forEach(patient => {
        const card = document.createElement('div');
        card.className = 'metric-card hover-glow fade-in';
        card.style.position = 'relative';
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                <img src="${patient.avatar}" alt="${patient.name}" style="width: 55px; height: 55px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);">
                <div>
                    <h3 style="margin: 0; color: #fff; font-size: 1.2em;">${patient.name}</h3>
                    <p style="margin: 0; color: #a0aec0; font-size: 0.85em;">ID: ${patient.id} &bull; ${patient.gender}, ${patient.age}</p>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px;">
                <div>
                    <p style="margin: 0 0 5px 0; color: #a0aec0; font-size: 0.8em; text-transform: uppercase; letter-spacing: 1px;">Heart Rate</p>
                    <p style="margin: 0; font-weight: 700; font-size: 1.4em; color: #fff;">${patient.heartRate} <span style="font-size:0.5em; color: #a0aec0;">bpm</span></p>
                </div>
                <div>
                    <p style="margin: 0 0 5px 0; color: #a0aec0; font-size: 0.8em; text-transform: uppercase; letter-spacing: 1px;">Blood Press.</p>
                    <p style="margin: 0; font-weight: 700; font-size: 1.4em; color: #fff;">${patient.bloodPressure}</p>
                </div>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.9em; color: #a0aec0;">Clinical Status:</span>
                <span style="background: ${patient.statusColor}22; color: ${patient.statusColor}; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 0.85em; display: inline-block;">
                    ${patient.status}
                </span>
            </div>
        `;
        grid.appendChild(card);
    });
}
// Trigger the initial database generation loop
renderPatientDatabase();


// ==========================================
// 3. HEALTH ASSISTANT CHATBOT LOGIC
// ==========================================
const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');

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

console.log("HealthConnect SPA Initialized. Database rendered. Router active.");

// Export context for the Unit Testing framework
if (typeof module !== 'undefined') {
    module.exports = { appendMessage };
}
