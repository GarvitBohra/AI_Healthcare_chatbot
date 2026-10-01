"use strict";

/**
 * Healthcare AI Coordination System - Main Application Logic
 * Manages SPA navigation, rendering patient records, and chat assistant interface.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadPatientData();
    initChatAssistant();
});

// ==========================================
// 1. SINGLE PAGE APPLICATION (SPA) NAVIGATION
// ==========================================
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            views.forEach(v => {
                v.style.display = 'none';
                v.classList.remove('section-active');
            });

            const targetId = btn.id.replace('nav-', 'view-');
            const targetView = document.getElementById(targetId);

            if (targetView) {
                targetView.style.display = 'block';
                setTimeout(() => targetView.classList.add('section-active'), 10);
            }
        });
    });
}

// ==========================================
// 2. PATIENT RECORDS RENDERING (SUPABASE)
// ==========================================
async function loadPatientData() {
    const grid = document.getElementById('metrics-grid');
    if (!grid) return;

    let patients = [];
    if (typeof fetchPatients === 'function') {
        patients = await fetchPatients();
    }

    if (!patients || patients.length === 0) {
        grid.innerHTML = "<p style='color:#a0aec0;'>No patient records available.</p>";
        return;
    }

    // Update Dashboard Vitals for default patient Jane Doe (P-001)
    const defaultPatient = patients.find(p => p.id === 'P-001' || p.name === 'Jane Doe') || patients[0];
    const hrElem = document.getElementById('heart-rate-display');
    const bpElem = document.getElementById('bp-display');

    if (hrElem && defaultPatient.heart_rate) {
        hrElem.innerHTML = `${defaultPatient.heart_rate} <span class="unit">bpm</span>`;
    }
    if (bpElem && defaultPatient.blood_pressure) {
        bpElem.innerHTML = `${defaultPatient.blood_pressure} <span class="unit">mmHg</span>`;
    }

    // Render Patient Cohort Grid
    grid.innerHTML = "";
    const fragment = document.createDocumentFragment();

    patients.forEach(patient => {
        const card = document.createElement('div');
        card.className = 'metric-card hover-glow fade-in';
        card.style.position = 'relative';

        // Helper function for status badge color
        const getStatusColor = (status) => {
            switch ((status || '').toLowerCase()) {
                case 'normal':
                case 'excellent':
                    return '#4caf50';
                case 'elevated':
                    return '#ff9800';
                case 'critical':
                    return '#ff4d4d';
                default:
                    return '#00C9FF';
            }
        };

        const statusColor = getStatusColor(patient.status);

        // Header container
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'display: flex; align-items: center; gap: 15px; margin-bottom: 20px;';

        const img = document.createElement('img');
        img.src = patient.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(patient.name);
        img.alt = patient.name;
        img.style.cssText = 'width: 55px; height: 55px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);';

        const infoDiv = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.style.cssText = 'margin: 0; color: #fff; font-size: 1.2em;';
        h3.textContent = patient.name;

        const pSub = document.createElement('p');
        pSub.style.cssText = 'margin: 0; color: #a0aec0; font-size: 0.85em;';
        pSub.textContent = `ID: ${patient.id} • Age: ${patient.age} (${patient.gender})`;

        infoDiv.appendChild(h3);
        infoDiv.appendChild(pSub);
        headerDiv.appendChild(img);
        headerDiv.appendChild(infoDiv);

        // Vitals grid
        const vitalsDiv = document.createElement('div');
        vitalsDiv.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px;';

        const hrBox = document.createElement('div');
        hrBox.innerHTML = `<p style="margin: 0 0 5px 0; color: #a0aec0; font-size: 0.8em; text-transform: uppercase;">Heart Rate</p>
                           <p style="margin: 0; font-weight: 700; font-size: 1.4em; color: #fff;">${patient.heart_rate} <span style="font-size:0.5em; color: #a0aec0;">bpm</span></p>`;

        const bpBox = document.createElement('div');
        bpBox.innerHTML = `<p style="margin: 0 0 5px 0; color: #a0aec0; font-size: 0.8em; text-transform: uppercase;">Blood Press.</p>
                           <p style="margin: 0; font-weight: 700; font-size: 1.4em; color: #fff;">${patient.blood_pressure}</p>`;

        vitalsDiv.appendChild(hrBox);
        vitalsDiv.appendChild(bpBox);

        // Status footer
        const footerDiv = document.createElement('div');
        footerDiv.style.cssText = 'margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;';

        const statusLabel = document.createElement('span');
        statusLabel.style.cssText = 'font-size: 0.9em; color: #a0aec0;';
        statusLabel.textContent = 'Clinical Status:';

        const statusBadge = document.createElement('span');
        statusBadge.style.cssText = `background: ${statusColor}22; color: ${statusColor}; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 0.85em;`;
        statusBadge.textContent = patient.status;

        footerDiv.appendChild(statusLabel);
        footerDiv.appendChild(statusBadge);

        card.appendChild(headerDiv);
        card.appendChild(vitalsDiv);
        card.appendChild(footerDiv);

        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

// ==========================================
// 3. HEALTH ASSISTANT CHAT INTERFACE
// ==========================================
function initChatAssistant() {
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    const chatBox = document.getElementById('chat-box');

    if (!sendBtn || !messageInput || !chatBox) return;

    function appendMessage(text, sender, cssClass) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${cssClass}`;

        const paragraph = document.createElement('p');
        const boldSender = document.createElement('strong');

        boldSender.textContent = `${sender}: `;
        paragraph.appendChild(boldSender);
        paragraph.appendChild(document.createTextNode(text));

        msgDiv.appendChild(paragraph);
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        appendMessage(text, "You", "sent");
        messageInput.value = "";

        // Typing indicator
        const typingMsg = document.createElement('div');
        typingMsg.className = "message received";
        const typingP = document.createElement('p');
        const typingEm = document.createElement('em');
        typingEm.textContent = "Health Assistant is thinking...";
        typingP.appendChild(typingEm);
        typingMsg.appendChild(typingP);
        chatBox.appendChild(typingMsg);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    patientId: 'P-001'
                })
            });

            if (chatBox.contains(typingMsg)) {
                chatBox.removeChild(typingMsg);
            }

            const data = await response.json();

            if (!response.ok || data.error) {
                const errMsg = data.error || 'Sorry, unable to process your request right now.';
                appendMessage(errMsg, "Health Assistant", "received");
                return;
            }

            appendMessage(data.response || "No response received.", "Health Assistant", "received");

        } catch (err) {
            if (chatBox.contains(typingMsg)) {
                chatBox.removeChild(typingMsg);
            }
            appendMessage("Unable to connect to backend server. Please check your network connection.", "Health Assistant", "received");
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}
