"use strict";

/**
 * Supabase Client Integration
 * Handles fetching synthetic patient data from PostgreSQL via Supabase client SDK.
 */

// Read environment variables or window config if set
const SUPABASE_URL = (typeof window !== 'undefined' && window.ENV && window.ENV.SUPABASE_URL)
    ? window.ENV.SUPABASE_URL
    : "";

const SUPABASE_ANON_KEY = (typeof window !== 'undefined' && window.ENV && window.ENV.SUPABASE_ANON_KEY)
    ? window.ENV.SUPABASE_ANON_KEY
    : "";

// Synthetic fallback data used when Supabase credentials are not yet configured locally
const DEMO_PATIENTS = [
    {
        id: "P-001",
        name: "Jane Doe",
        age: 32,
        gender: "Female",
        heart_rate: 72,
        blood_pressure: "120/80",
        status: "Normal",
        avatar: "https://ui-avatars.com/api/?name=Jane+Doe&background=4caf50&color=fff"
    },
    {
        id: "P-002",
        name: "Michael Smith",
        age: 45,
        gender: "Male",
        heart_rate: 88,
        blood_pressure: "135/90",
        status: "Elevated",
        avatar: "https://ui-avatars.com/api/?name=Michael+Smith&background=ff9800&color=fff"
    },
    {
        id: "P-003",
        name: "Sarah Jenkins",
        age: 28,
        gender: "Female",
        heart_rate: 65,
        blood_pressure: "110/70",
        status: "Excellent",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=4caf50&color=fff"
    },
    {
        id: "P-004",
        name: "Robert Chen",
        age: 61,
        gender: "Male",
        heart_rate: 98,
        blood_pressure: "155/95",
        status: "Critical",
        avatar: "https://ui-avatars.com/api/?name=Robert+Chen&background=ff4d4d&color=fff"
    },
    {
        id: "P-005",
        name: "Emily Davis",
        age: 39,
        gender: "Female",
        heart_rate: 76,
        blood_pressure: "118/76",
        status: "Normal",
        avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=4caf50&color=fff"
    }
];

let supabaseClient = null;

if (typeof window !== 'undefined' && window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
        console.warn("Supabase client initialization warning:", err.message);
    }
}

/**
 * Fetch patient records from Supabase PostgreSQL table or fallback synthetic dataset
 * @returns {Promise<Array>} Array of patient records
 */
async function fetchPatients() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('patients')
                .select('*')
                .order('id', { ascending: true });

            if (!error && data && data.length > 0) {
                return data;
            }
            if (error) {
                console.warn("Supabase query notice (using demo fallback):", error.message);
            }
        } catch (err) {
            console.warn("Supabase fetch exception (using demo fallback):", err.message);
        }
    }
    return DEMO_PATIENTS;
}

/**
 * Fetch a single patient record by ID
 * @param {string} patientId 
 * @returns {Promise<Object>} Patient object
 */
async function fetchPatientById(patientId) {
    const patients = await fetchPatients();
    return patients.find(p => p.id === patientId) || patients[0];
}
