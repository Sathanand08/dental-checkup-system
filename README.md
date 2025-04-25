Dental Checkup System
A full-stack MERN application for managing dental checkups between patients and dentists. This platform enables patients to request virtual dental checkups from dentists, who can then upload images and provide feedback.

Features
User Authentication: Secure login/register for patients and dentists
Role-Based Access: Different interfaces for patients and dentists
Checkup Requests: Patients can browse dentists and request checkups
Image Management: Dentists can upload dental images with descriptions
PDF Export: Patients can export checkup details as PDF files
Responsive Design: Mobile-friendly interface with hamburger menu
Technology Stack
MongoDB: Database for storing user and checkup data
Express.js: Backend API framework
React.js: Frontend library with Vite for faster development
Node.js: JavaScript runtime for the backend
Material UI: Component library for responsive design
JWT: Secure authentication using JSON Web Tokens
Multer: File upload handling for dental images
html2pdf.js: PDF generation functionality
Setup and Installation
Prerequisites
Node.js (v14+ recommended)
MongoDB (local instance or MongoDB Atlas)
Git
Backend Setup
Clone the repository

BASH

git clone https://github.com/yourusername/dental-checkup-system.git
cd dental-checkup-system
Install dependencies and setup server

BASH

cd server
npm install
Create environment variables
Create a .env file in the server directory with:


MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
Create uploads directory

BASH

mkdir uploads
Start the server

BASH

npm run dev
The server will run on http://localhost:5000

Frontend Setup
Navigate to client directory and install dependencies

BASH

cd ../client
npm install
Start the development server

BASH

npm run dev
The client will run on http://localhost:5173

Application Workflow
Patient Journey
Register/Login as a patient
Browse available dentists on the dashboard
Request a checkup from a preferred dentist
View checkup status and results when completed
Export checkup reports as PDF files for records
Dentist Journey
Register/Login as a dentist
View checkup requests from patients
Process checkups by uploading dental images
Add descriptions to images and provide notes
Complete checkups for patient review
