"use strict";

/**
 * @fileoverview Simulated Google Cloud JSON Database
 * @description Provides a mock NoSQL document structure containing 5 patient records.
 */

const patientsDatabase = [
    {
        id: "P-001",
        name: "Jane Doe",
        age: 32,
        gender: "Female",
        heartRate: 72,
        bloodPressure: "120/80",
        status: "Normal",
        statusColor: "#4caf50",
        avatar: "https://ui-avatars.com/api/?name=Jane+Doe&background=4caf50&color=fff"
    },
    {
        id: "P-002",
        name: "Michael Smith",
        age: 45,
        gender: "Male",
        heartRate: 88,
        bloodPressure: "135/90",
        status: "Elevated",
        statusColor: "#ff9800",
        avatar: "https://ui-avatars.com/api/?name=Michael+Smith&background=ff9800&color=fff"
    },
    {
        id: "P-003",
        name: "Sarah Jenkins",
        age: 28,
        gender: "Female",
        heartRate: 65,
        bloodPressure: "110/70",
        status: "Excellent",
        statusColor: "#4caf50",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=4caf50&color=fff"
    },
    {
        id: "P-004",
        name: "Robert Chen",
        age: 61,
        gender: "Male",
        heartRate: 98,
        bloodPressure: "155/95",
        status: "Critical",
        statusColor: "#ff4d4d",
        avatar: "https://ui-avatars.com/api/?name=Robert+Chen&background=ff4d4d&color=fff"
    },
    {
        id: "P-005",
        name: "Emily Davis",
        age: 39,
        gender: "Female",
        heartRate: 76,
        bloodPressure: "118/76",
        status: "Normal",
        statusColor: "#4caf50",
        avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=4caf50&color=fff"
    }
];

// Export for Unit Testing if needed
if (typeof module !== 'undefined') {
    module.exports = { patientsDatabase };
}
