# To-do-Management-Application
To-Do Management Application

Overview
- Full-stack to-do web application
- Frontend: React (Vite)
- Backend: Node.js (Express)
- Persistence: JSON file on disk (no external DB needed)

Features
- Create, list, update, delete tasks
- Persist tasks between restarts
- Filter: all, active, completed
- Search by title or description
- Optional due date per task

npm run install:all


- API runs on http://localhost:5174
- Web runs on http://localhost:5173 
Build and Preview UI only


- Data is stored in `server/data/tasks.json`. You can delete the file to reset.
- For production, swap JSON store with a DB or cloud service.
