const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

// Fallback synthetic patient data if server environment lacks DB credentials
const DEFAULT_PATIENT = {
    name: "Jane Doe",
    age: 32,
    heart_rate: 72,
    blood_pressure: "120/80",
    status: "Normal"
};

module.exports = async function handler(req, res) {
    // Enable basic CORS headers for cross-origin local testing if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
    }

    try {
        const { message, patientId } = req.body || {};

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'Message content cannot be empty.' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                error: 'Server configuration error: GEMINI_API_KEY is missing. Please set it in your environment variables.'
            });
        }

        // Retrieve specific patient vitals context from Supabase PostgreSQL if configured
        let patient = DEFAULT_PATIENT;
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
            try {
                const supabase = createClient(supabaseUrl, supabaseKey);
                const targetId = patientId || 'P-001';
                const { data, error } = await supabase
                    .from('patients')
                    .select('name, age, heart_rate, blood_pressure, status')
                    .eq('id', targetId)
                    .single();

                if (!error && data) {
                    patient = data;
                }
            } catch (dbErr) {
                console.warn('Supabase DB lookup notice:', dbErr.message);
            }
        }

        // Initialize Gemini model
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are HealthConnect, a healthcare information and care-coordination assistant. Provide general health information and help users understand their recorded health metrics. Do not diagnose medical conditions, prescribe medication, or replace a healthcare professional. If a situation may require urgent medical attention, advise the user to contact an appropriate healthcare professional or emergency service. Keep responses concise and easy to understand."
        });

        const prompt = `Current Recorded Synthetic Patient Data:
Name: ${patient.name}
Age: ${patient.age}
Heart Rate: ${patient.heart_rate} bpm
Blood Pressure: ${patient.blood_pressure} mmHg
Clinical Status: ${patient.status}

User Request: ${message.trim()}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response ? result.response.text() : "No response generated.";

        return res.status(200).json({ response: responseText });

    } catch (err) {
        console.error('Error in /api/chat:', err);
        return res.status(500).json({
            error: 'An error occurred while processing your request. Please ensure GEMINI_API_KEY is valid.'
        });
    }
};
