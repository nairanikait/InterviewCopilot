# InterviewCopilot

Goal

User uploads resume

AI generates interview questions

User submits answers

AI evaluates answers

Results are saved

--------------------------------

Frontend

React
Vite
Tailwind

Pages:

Login

Dashboard

Interview

Results

--------------------------------

Backend

Node

Express

MongoDB Atlas

JWT

--------------------------------

Endpoints

POST /auth/register

POST /auth/login

POST /resume/upload

POST /interview/start

POST /interview/evaluate

GET /sessions

--------------------------------

Database

User

Resume

InterviewSession

--------------------------------

Rules

Frontend never calls AI.

Backend owns AI.

Resume PDFs temporary.

Store extracted text only.

JSON responses only.

No TypeScript.

No websocket.

No OAuth.

No payments.