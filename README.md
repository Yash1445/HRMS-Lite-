# HRMS Lite

HRMS Lite is a production-ready full-stack Human Resource Management System for managing employees and tracking attendance. It includes a Flask REST API, SQLite persistence with PostgreSQL-ready configuration, and a responsive React dashboard built with Vite and Tailwind CSS.

## Features

- Employee management: add, list, and delete employees
- Attendance management: mark and list attendance records
- Dashboard summary: total employees, present today, absent today, and total attendance records
- Attendance filtering by date
- Present count per employee
- JSON API error handling with meaningful messages and HTTP status codes
- Responsive admin UI with loading, empty, error, and toast states
- Deployment-ready configuration for Vercel and Render

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Lucide React
- Backend: Flask, Flask-CORS, Flask-SQLAlchemy, SQLAlchemy
- Database: SQLite by default, PostgreSQL through `DATABASE_URL`
- Deployment: Vercel for frontend, Render for backend

## Project Structure

```text
hrms-lite/
|-- backend/
|   |-- models/
|   |-- routes/
|   |-- app.py
|   |-- config.py
|   |-- extensions.py
|   |-- requirements.txt
|   |-- render.yaml
|   `-- .env.example
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   `-- App.jsx
|   |-- package.json
|   |-- tailwind.config.js
|   |-- vercel.json
|   `-- .env.example
|-- render.yaml
`-- README.md
```

## Installation

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python app.py
```

The API runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Environment Variables

### Backend

| Variable | Description | Example |
| --- | --- | --- |
| `SECRET_KEY` | Flask secret key | `replace-with-a-secure-secret` |
| `DATABASE_URL` | SQLAlchemy database URL | `sqlite:///instance/hrms_lite.db` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:5173` |

For PostgreSQL, set `DATABASE_URL` to a PostgreSQL connection string. The app uses the `psycopg` binary driver and normalizes Render-style `postgres://` URLs automatically, so local installs do not require PostgreSQL build tools or `pg_config`.

### Frontend

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

## API Endpoints

### Employees

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/employees` | Create an employee |
| `GET` | `/api/employees` | List employees with present counts |
| `DELETE` | `/api/employees/<id>` | Delete employee by internal numeric ID |

Create employee payload:

```json
{
  "employee_id": "EMP001",
  "full_name": "Alex Morgan",
  "email": "alex@example.com",
  "department": "People Operations"
}
```

### Attendance

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/attendance` | Mark attendance |
| `GET` | `/api/attendance` | List attendance records |
| `GET` | `/api/attendance?date=2026-06-14` | Filter attendance by date |
| `GET` | `/api/attendance/<employee_id>` | List records and present count for an employee code |

Mark attendance payload:

```json
{
  "employee_id": "EMP001",
  "date": "2026-06-14",
  "status": "Present"
}
```

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/dashboard` | Summary metrics |

Example response:

```json
{
  "totalEmployees": 10,
  "presentToday": 8,
  "absentToday": 2,
  "attendanceRecords": 100
}
```

## Deployment

### Backend on Render

1. Push the repository to GitHub.
2. Create a new Render web service or use the root `render.yaml` blueprint.
3. Set `CORS_ORIGINS` to the deployed Vercel frontend URL.
4. Set `DATABASE_URL` if using PostgreSQL. If omitted, SQLite is used.
5. Render build command: `pip install -r requirements.txt`.
6. Render start command: `gunicorn app:app`.

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set the frontend root directory to `frontend`.
3. Set `VITE_API_BASE_URL` to the Render API URL ending in `/api`.
4. Build command: `npm run build`.
5. Output directory: `dist`.

## Assumptions

- This application is an admin-only HRMS Lite workflow and does not include authentication.
- Employee deletion cascades to that employee's attendance records.
- Attendance can be recorded multiple times for the same employee and date unless the business later requires a one-record-per-day rule.
- SQLite is the local default; PostgreSQL can be enabled by setting `DATABASE_URL`.

## Screenshots

Add screenshots of the Dashboard, Employee Management, and Attendance Management pages after local setup or deployment.

