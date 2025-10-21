# Task Management Application

A modern, responsive task management application built with React, TypeScript, and Node.js. This application provides a clean, compact interface for organizing and managing your daily tasks efficiently.

## Features

### Task Management
- **Create Tasks**: Add new tasks with title, description, priority, category, and due date
- **Edit Tasks**: Inline editing capability for updating existing tasks
- **Delete Tasks**: Remove completed or unwanted tasks
- **Toggle Completion**: Mark tasks as complete or incomplete with a simple checkbox
- **Real-time Updates**: All changes are instantly reflected in the UI
- **Search Functionality**: Quickly find tasks by title or description using the search bar

### Task Organization
- **Priority Levels**: Organize tasks by priority (High, Medium, Low)
- **Categories**: Classify tasks into categories:
  - Work
  - Personal
  - Shopping
  - Health
  - Study
- **Due Dates**: Set and track task deadlines with visual date badges
- **Task Statistics**: View remaining and completed task counts at a glance

### User Interface
- **Compact Design**: Clean, space-efficient layout optimized for productivity
- **Color-Coded Badges**: Visual indicators for priority, category, and due dates
-
Technology Stack

Frontend
- **React 18.3.1**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Vite 5.4.21**: Fast build tool and development server
- **Plain CSS**: Custom responsive styling (no framework dependencies)

Backend
- **Node.js v22.16.0**: JavaScript runtime
- **Express 4.19.2**: Web application framework
- **CORS**: Cross-origin resource sharing enabled
- **In-Memory Storage**: Tasks stored in server memory

   cd To-do-Management-Application
   ```



Server runs on `http://localhost:5174`

**Terminal 2 - Start the Frontend Client:**
cd client
npm run dev
Client runs on `http://localhost:5173`

### Option 2: Access the Application
Open your browser and navigate to: `http://localhost:5173`

## Application Structure

```
To-do-Management-Application/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── App.tsx        # Main application component with all logic
│   │   ├── App.css        # Application styles (compact & responsive)
│   │   ├── main.tsx       # Application entry point
│   │   └── vite-env.d.ts  # TypeScript definitions
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   └── vite.config.ts     # Vite configuration
│
├── server/                # Backend Express server
│   ├── src/
│   │   └── index.js       # Server entry point & API routes
│   └── package.json       # Backend dependencies
│
└── README.md              # This file
```

## API Endpoints

### Base URL: `http://localhost:5174/api`


### Port Configuration
- **Client**: 5173 (Vite default)
- **Server**: 5174
- Ensure both ports are available before starting

