# Online Exam Portal API


## Introduction

The Online Exam Portal API is a backend service that enables examiners to create and manage online exams while allowing students to participate in these exams via a shared link. This API facilitates the registration and authentication of examiners, the creation of exams with questions, and the submission of student answers, including scoring and results management.

## Features

- **Examiner Authentication**: Sign up and sign in for examiners, with secure password hashing and token-based authentication.
- **Exam Creation**: Examiners can create new exams, fetching questions from an external trivia API.
- **Link Generation**: Once an exam is created, a unique link is generated for sharing with students.
- **Answer Submission**: Students can submit their answers along with their name and email.
- **Results Viewing**: Examiners can view the results of their exams, including individual student scores.


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later) 
- [PostgreSQL](https://www.postgresql.org/) (v12 or later)
- [Prisma](https://www.prisma.io/) (v3 or later)

### Setup Instructions

**1. Clone the Repository**

```
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

**2. Copy the Environment File**
```
cp .env.example .env
```
Modify the environment variables in the `.env` file according to your local setup (e.g., database URL, JWT secret).
Example `.env` file:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
JWT_SECRET="your_secret_key"
NODE_ENV="development"
```
**3. Install Dependencies**
```
npm install
```
**4. Set up Prisma and the Database**

- Apply migrations to create the necessary database schema:
```
npx prisma migrate dev --name init
```
***Generate the Prisma Client:***
```
npx prisma generate
```
**5. Build the TypeScript Code**
```
npm run build
```
 **6. Start the Application**

- Start the server in development mode:
```
npm run dev
```
**7. Running in Production**

To run the application in production mode:
```
npm run build npm start
```

## Routes Overview

### Examiner Routes (`/examiner`)

-   **POST** `/signup`: Examiner signup.
-   **POST** `/signin`: Examiner signin.
-   **POST** `/create-exam`: Create a new exam (authenticated).
-   **GET** `/dashboard`: View all exams by an examiner (authenticated).
-   **GET** `/exam-results/:examId`: View exam results for a specific exam (authenticated).

### Student Routes (`/student`)

-   **POST** `/submit-answers/:examId`: Submit student answers for an exam.

## Controllers Overview

The logic for handling the routes is in the controllers:

### Examiner Controller (`controllers/examinerController.ts`)

- **`signup`**: Allows an examiner to register by providing their name, email, and password. Passwords are hashed before being stored.
- **`signin`**: Allows an examiner to log in using their email and password. A JWT token is issued on successful login.
- **`createExam`**: Examiners can create exams with questions fetched from the Open Trivia Database ([https://opentdb.com/](https://opentdb.com/)). An exam link is generated for sharing with students.
- **`viewExams`**: Lists all exams created by the logged-in examiner.
- **`viewExamResults`**: Displays the results of a specific exam, including the scores of students.

### Student Controller (`controllers/studentController.ts`)

- **`submitHandler`**: Allows students to submit their answers for a particular exam. Their answers, name, and email are stored, and the score is calculated based on the correct answers.

## Middleware

### Authentication Middleware (`middlewares/authMiddleware.ts`)

The middleware checks if the user is authenticated by verifying the JWT token stored in cookies. If the token is valid, the `examinerId` is attached to the request object.


## Database Schema (Prisma)

- **Examiner**: Stores the examiner's information (name, email, password).
- **Exam**: Stores details about each exam, including its category, difficulty, number of questions, time limit, and associated examiner.
- **Question**: Contains questions related to each exam, including the question text, correct answer, and incorrect answers.
- **StudentScore**: Records student scores and answers for each exam, including student name, email, total score, and number of correct answers.
