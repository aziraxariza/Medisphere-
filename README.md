# MediSphere

<p> 
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/Blender-E87D0D?style=for-the-badge&logo=blender&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
</p>

<p>
  <b>AI-assisted health triage, built around the human body.</b>
</p>

<p align="center">
<img width="929" height="431" alt="Screenshot 2026-09-08 202058" src="https://github.com/user-attachments/assets/36a04588-30e6-46bd-a07e-82755aafa4f3" />
</p>


<p>
  MediSphere helps users understand their symptoms, assess urgency,<br/>
  and find appropriate next steps through an interactive health experience.
</p>

---

## Overview

MediSphere is a web-based health guidance platform that combines an interactive 3D human body interface with structured symptom assessment and AI-assisted triage.

Instead of beginning with a traditional medical form, users can interact with the human body, select the affected area, describe their symptoms, and receive structured guidance about what to do next.

> **MediSphere is designed for health guidance and triage — not medical diagnosis.**

---

## Features

### 🫀 Interactive 3D Body
Explore an interactive 3D representation of the human body and select the area associated with your symptoms.

### 🩺 Guided Symptom Assessment
Collect relevant information including:

- Symptoms
- Severity
- Duration
- Sudden or gradual onset
- Relevant medical context
- Medications and allergies
- Other contextual information

### ✨ AI-Assisted Triage
Uses Google's Gemini API to analyze the provided information and generate structured guidance.

The system can help identify:

- Potential warning signs
- Level of urgency
- Recommended next steps
- Appropriate healthcare specialty

### 💬 Health Assistant
A conversational interface for asking health-related questions and getting contextual guidance.

### 📍 Care Discovery
Helps users identify appropriate healthcare options based on their needs.

### 🛡️ Safety-Oriented Fallbacks
Provides conservative fallback guidance when AI-powered services are unavailable.



## How It Works

```text
        ┌─────────────────────┐
        │   Select Body Area  │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │  Describe Symptoms  │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Add Relevant Context│
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │   AI-Assisted       │
        │      Triage         │
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │ Urgency & Next Steps│
        └──────────┬──────────┘
                   ↓
        ┌─────────────────────┐
        │   Find Appropriate  │
        │        Care         │
        └─────────────────────┘
````

---

## Tech Stack

| Layer          | Technologies                |
| -------------- | --------------------------- |
| **Frontend**   | React, TypeScript, Vite     |
| **Styling**    | Tailwind CSS, Radix UI      |
| **3D**         | Three.js, React Three Fiber |
| **Animation**  | Framer Motion               |
| **Backend**    | Node.js, Express, tRPC      |
| **Validation** | Zod                         |
| **Database**   | MySQL, Drizzle ORM          |
| **AI**         | Google Gemini API           |
| **Storage**    | AWS S3-compatible storage   |

---

## Project Structure

```text
medisphere/
├── api/                 # API entry point
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── contexts/    # React contexts
│   │   └── lib/         # Client utilities
│   └── public/          # Static assets
├── server/              # Backend and tRPC procedures
├── shared/              # Shared types and logic
├── drizzle/             # Database schema and migrations
├── patches/             # Dependency patches
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js
* pnpm
* MySQL
* Google Gemini API key

## Safety Disclaimer

MediSphere is an **AI-assisted health information and triage tool** and is not a substitute for professional medical care.

The information generated by the system should not be treated as a medical diagnosis or definitive medical advice.

If symptoms are severe, sudden, rapidly worsening, or potentially life-threatening, seek immediate medical attention or contact your local emergency services.

---

## Project Status

🚧 **Active Development**

MediSphere is continuously evolving across its AI workflows, user experience, healthcare integrations, and accessibility.

---

## License

**Copyright © 2026 Ariza Wasim. All Rights Reserved.**

This repository and its contents are proprietary.

No permission is granted to copy, modify, distribute, reproduce, publish, sublicense, or use this project or any portion of its source code without explicit written permission from the author.

