
# She Can Foundation Internship Portal

## Overview

She Can Foundation Internship Portal is a full-stack web application designed to streamline internship applications and management. Applicants can submit their details, upload resumes, and track their application status, while administrators can review applications, manage candidates, and view analytics through a dedicated dashboard.

## Features

* Internship application form
* Resume upload functionality
* Secure admin authentication
* Application status tracking
* Applicant management dashboard
* Analytics and reporting
* AI-based applicant categorization
* Responsive user interface

## Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JWT (JSON Web Tokens)

### File Upload

* Multer

### Deployment

* Frontend: Vercel
* Backend: Render

## Database

The application uses **MongoDB Atlas**, a cloud-hosted NoSQL database service. Data such as applicant details, application status, admin accounts, and analytics information are stored in MongoDB collections using Mongoose ODM.

## Installation

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm start
```

## Environment Variables

Create a `.env` file in the server directory:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

## Project Structure

```text
client/
server/
 ├── config/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 └── uploads/
```

## Author

Jigyasa Rathi
