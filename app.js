/**
 * Google Cloud / Firebase Mock Application Logic
 * 
 * Perfect for School Projects!
 * This simple JavaScript file handles user interaction on the webpage.
 * In a real-world scenario, the data shown here would be fetched from 
 * a Google Cloud service like Firestore (Firebase).
 */

// 1. We grab references to elements in our HTML file so we can interact with them.
const sendBtn = document.getElementById('send-btn');
const messageInput = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');

// 2. We add an "Event Listener" to our Send button. 
// When the button is clicked, it runs the arrow function below.
sendBtn.addEventListener('click', () => {
    
    // Get the text the user typed
    const messageText = messageInput.value.trim();

    // Only proceed if the box isn't empty!
    if (messageText !== "") {
        
        // --- 1. DISPLAY THE PATIENT MESSAGE ---
        
        // Create a new HTML `div` element for our message
        const newMsgDiv = document.createElement('div');
        
        // Give it the classes needed for our CSS styling
        newMsgDiv.className = 'message sent';
        
        // Add the text inside the div
        newMsgDiv.innerHTML = `<p><strong>You:</strong> ${messageText}</p>`;
        
        // Inject this new div into our chat box
        chatBox.appendChild(newMsgDiv);
        
        // Clear the input field
        messageInput.value = "";
        
        // Scroll the chat box to the very bottom
        chatBox.scrollTop = chatBox.scrollHeight;


        // --- 2. GOOGLE FIREBASE MOCK RESPONSE ---
        // (This simulates waiting for a response from the Cloud database)
        
        setTimeout(() => {
            // Create a doctor response div
            const replyMsgDiv = document.createElement('div');
            replyMsgDiv.className = 'message received';
            replyMsgDiv.innerHTML = `<p><strong>System (Google Cloud Mock):</strong> Message safely logged to database. Your provider will review it shortly. ✅</p>`;
            
            chatBox.appendChild(replyMsgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;

            // In actual Google Firebase, you would use code like:
            // db.collection('messages').add({
            //     text: messageText,
            //     sender: 'Jane Doe',
            //     timestamp: firebase.firestore.FieldValue.serverTimestamp()
            // });

        }, 1200); // Wait 1.2 seconds to simulate network lag
    }
});

// 3. Let the user press the "Enter" key to send messages too!
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendBtn.click(); // Programmatically click the button
    }
});

console.log("HealthConnect Web App Initialized. Google Cloud Mock Backend Ready.");
