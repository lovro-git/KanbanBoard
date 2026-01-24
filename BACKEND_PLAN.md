# Backend Implementation Plan (Future)

This document outlines the backend architecture for when you're ready to add server-side persistence, user authentication, and multi-user support.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File Upload | Multer |
| Validation | express-validator |
| Deployment | Docker + Docker Compose |

---

## Project Structure

```
kanban-board/
├── client/                    # Frontend (current src/)
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── index.js           # Express entry point
│   │   ├── config/
│   │   │   └── database.js    # PostgreSQL connection pool
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   └── upload.js      # Multer configuration
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── board.js
│   │   │   ├── tasks.js
│   │   │   ├── subtasks.js
│   │   │   ├── comments.js
│   │   │   └── attachments.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── boardController.js
│   │   │   ├── taskController.js
│   │   │   ├── subtaskController.js
│   │   │   ├── commentController.js
│   │   │   └── attachmentController.js
│   │   └── utils/
│   │       └── validators.js
│   ├── package.json
│   └── .env.example
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_columns.sql
│   ├── 003_create_tasks.sql
│   ├── 004_create_subtasks.sql
│   ├── 005_create_subtask_reports.sql
│   ├── 006_create_comments.sql
│   └── 007_create_attachments.sql
├── uploads/                   # File storage directory
├── docker-compose.yml
├── Dockerfile
├── package.json               # Root workspace config
└── .env.example
```

---

## Database Schema

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### columns
```sql
CREATE TABLE columns (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default columns
INSERT INTO columns (id, title, position) VALUES
  ('todo', 'To Do', 0),
  ('in-progress', 'In Progress', 1),
  ('done', 'Done', 2);
```

### tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  column_id VARCHAR(50) REFERENCES columns(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_column ON tasks(column_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_position ON tasks(column_id, position);
```

### subtasks
```sql
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subtasks_task ON subtasks(task_id);
```

### subtask_reports
```sql
CREATE TABLE subtask_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subtask_id UUID REFERENCES subtasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subtask_reports_subtask ON subtask_reports(subtask_id);
```

### comments (task-level reviews)
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_task ON comments(task_id);
```

### attachments
```sql
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  file_size INTEGER,
  url VARCHAR(500) NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_task ON attachments(task_id);
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user profile |
| PATCH | `/api/auth/me` | Update profile (name, avatar) |

### Board
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/board` | Get full board (columns + tasks with all nested data) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (with query filters) |
| GET | `/api/tasks/:id` | Get task with subtasks, comments, attachments |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task (title, description) |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/move` | Move task (column_id, position) |
| PATCH | `/api/tasks/:id/assign` | Assign user to task |

### Subtasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/:taskId/subtasks` | Create subtask |
| PATCH | `/api/subtasks/:id` | Update subtask (title, completed) |
| DELETE | `/api/subtasks/:id` | Delete subtask |
| POST | `/api/subtasks/:id/reports` | Add report to subtask |
| DELETE | `/api/subtask-reports/:id` | Delete subtask report |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/:taskId/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment |

### Attachments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/:taskId/attachments` | Upload file (multipart) |
| DELETE | `/api/attachments/:id` | Delete attachment |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (for assignment dropdown) |

---

## Backend Dependencies

```json
{
  "name": "kanban-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "migrate": "node scripts/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express-validator": "^7.0.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://kanban:password@localhost:5432/kanban

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# File uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

---

## Frontend Integration

### API Service Layer

Create `client/src/services/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  login = (email, password) =>
    this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

  register = (email, password, name) =>
    this.request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) });

  getMe = () => this.request('/auth/me');

  // Board
  getBoard = () => this.request('/board');

  // Tasks
  createTask = (columnId, title, description) =>
    this.request('/tasks', { method: 'POST', body: JSON.stringify({ columnId, title, description }) });

  updateTask = (taskId, data) =>
    this.request(`/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(data) });

  deleteTask = (taskId) =>
    this.request(`/tasks/${taskId}`, { method: 'DELETE' });

  moveTask = (taskId, columnId, position) =>
    this.request(`/tasks/${taskId}/move`, { method: 'PATCH', body: JSON.stringify({ columnId, position }) });

  // Subtasks
  createSubtask = (taskId, title) =>
    this.request(`/tasks/${taskId}/subtasks`, { method: 'POST', body: JSON.stringify({ title }) });

  updateSubtask = (subtaskId, data) =>
    this.request(`/subtasks/${subtaskId}`, { method: 'PATCH', body: JSON.stringify(data) });

  deleteSubtask = (subtaskId) =>
    this.request(`/subtasks/${subtaskId}`, { method: 'DELETE' });

  addSubtaskReport = (subtaskId, content) =>
    this.request(`/subtasks/${subtaskId}/reports`, { method: 'POST', body: JSON.stringify({ content }) });

  // Attachments (special handling for file upload)
  uploadAttachment = async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/tasks/${taskId}/attachments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}` },
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  };

  deleteAttachment = (attachmentId) =>
    this.request(`/attachments/${attachmentId}`, { method: 'DELETE' });
}

export const api = new ApiService();
```

### BoardContext Migration

When ready for backend, modify `BoardContext.jsx`:

1. Replace localStorage load with `api.getBoard()`
2. Replace localStorage save with individual API calls
3. Use optimistic updates (update UI immediately, rollback on error)

```javascript
// Example: addTask with optimistic update
const addTask = async (columnId, title, description) => {
  const tempId = `temp-${Date.now()}`;

  // Optimistic update
  dispatch({ type: ACTIONS.ADD_TASK, payload: { columnId, title, description, tempId } });

  try {
    const task = await api.createTask(columnId, title, description);
    dispatch({ type: ACTIONS.REPLACE_TEMP_TASK, payload: { tempId, task } });
  } catch (error) {
    // Rollback
    dispatch({ type: ACTIONS.DELETE_TASK, payload: { taskId: tempId } });
    throw error;
  }
};
```

---

## Docker Setup

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies for both client and server
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm install

# Copy source
COPY . .

# Build frontend
RUN npm run build --workspace=client

# Expose port
EXPOSE 3001

# Start server (serves API + static frontend)
CMD ["npm", "start", "--workspace=server"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://kanban:password@db:5432/kanban
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=kanban
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=kanban
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

volumes:
  postgres_data:
  uploads:
```

---

## Migration from localStorage

When users first log in after backend is deployed:

1. Check for existing localStorage data
2. Prompt: "Import your existing tasks?"
3. POST to `/api/import` endpoint
4. Clear localStorage after successful import

---

## Implementation Order

1. **Phase 1**: Express setup, PostgreSQL connection, migrations
2. **Phase 2**: Auth routes (register, login, JWT)
3. **Phase 3**: Board & Task CRUD routes
4. **Phase 4**: Subtask routes with reports
5. **Phase 5**: File upload routes
6. **Phase 6**: Frontend API service + AuthContext
7. **Phase 7**: Replace localStorage with API calls
8. **Phase 8**: Docker setup
9. **Phase 9**: Data migration tool

---

## Security Considerations

- Hash passwords with bcrypt (cost factor 12)
- Use httpOnly cookies for refresh tokens (optional)
- Validate and sanitize all inputs
- Rate limit auth endpoints
- Validate file types and sizes on upload
- Use parameterized queries (pg handles this)
- Set proper CORS origins in production
- Use HTTPS in production
