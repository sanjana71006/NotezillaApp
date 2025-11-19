# Notezilla Frontend

React + Vite frontend for the Notezilla collaborative resource platform.

## 🎨 Features

- **Responsive UI** — Mobile-first design with CSS Grid and Flexbox
- **User Authentication** — Sign up, login, role-based access
- **Resource Discovery** — Browse and search educational materials
- **File Upload** — Upload documents with metadata tracking
- **Admin Dashboard** — System analytics and user management
- **Study Groups** — Organize collaborative sessions
- **Dark/Light Theme** — Toggle between themes
- **Context-based State** — Auth and theme state via React Context

## 🏗️ Architecture

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router 7
- **Styling**: CSS modules and inline styles
- **State**: React Context (Auth, Theme)
- **API Client**: Fetch API with helper functions

## 📦 Project Structure

```
src/
├── main.jsx                    # React entry point
├── App.jsx                     # Root component with routing
├── index.css                   # Global styles
├── components/
│   ├── ErrorBoundary.jsx       # Error boundary wrapper
│   ├── Button/                 # Reusable button component
│   ├── Header/                 # Navigation header
│   ├── Footer/                 # Footer with links
│   ├── Features/               # Feature cards
│   ├── FeatureCard/            # Feature card component
│   ├── Hero/                   # Landing hero section
│   ├── PopularResources/       # Featured resources display
│   ├── ResourceCard/           # Resource item card
│   ├── ThemeToggle/            # Dark/light theme toggle
│   └── ProtectedRoute/         # Auth-protected wrapper
├── Pages/
│   ├── Home/                   # Landing page
│   ├── Login/                  # Login form
│   ├── Signup/                 # Registration form
│   ├── Browse/                 # Resource browsing
│   ├── Upload/                 # File upload form
│   ├── Contact/                # Contact form
│   ├── About/                  # About page
│   ├── AdminDashboard/         # Admin overview
│   ├── AdminAnalytics/         # System analytics
│   ├── AdminUsers/             # User management
│   ├── AdminResources/         # Resource management
│   ├── AdminSettings/          # System settings
│   ├── AdminReports/           # Reports view
│   ├── FacultyDashboard/       # Faculty home
│   └── StudentDashboard/       # Student home
├── context/
│   ├── AuthContext.jsx         # User auth context
│   └── ThemeContext.jsx        # Dark/light theme context
└── services/
    └── api.js                  # API client and helpers
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ (npm v7+)
- Backend API running (see `/backend` README)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file (or `.env`) in the `frontend/` directory:

**For Development**:
```bash
VITE_API_URL=http://localhost:5000/api
```

**For Production** (in `.env.production`):
```bash
VITE_API_URL=https://notezilla-backend-xxxxx.onrender.com/api
```

⚠️ **Important**: The `VITE_API_URL` is baked into the build at compile time. Ensure it's set correctly before building.

### 3. Run Development Server

```bash
npm run dev
```

Vite dev server starts on http://localhost:5173 with hot module reloading.

### 4. Build for Production

```bash
npm run build
```

Generates optimized production bundle in `dist/` directory.

### 5. Preview Production Build Locally

```bash
npm run preview
```

Serves the `dist/` folder locally for testing.

## 🔗 API Integration

The frontend communicates with the backend via `src/services/api.js`:

### Authentication

```javascript
import { authAPI } from './services/api.js';

// Sign up
const { token, user } = await authAPI.signup({
  email: 'user@example.com',
  password: 'pass123',
  name: 'John Doe',
  role: 'Student'
});

// Login
const { token, user } = await authAPI.login({
  email: 'user@example.com',
  password: 'pass123'
});

// Get current user
const { user } = await authAPI.getCurrentUser();
```

### Resources

```javascript
import { resourcesAPI } from './services/api.js';

// Fetch all resources
const resources = await resourcesAPI.getAll();

// Fetch single resource
const resource = await resourcesAPI.getById(id);

// Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
const { resource } = await resourcesAPI.upload(formData);

// Delete resource
await resourcesAPI.delete(id);
```

### Contacts

```javascript
import { contactsAPI } from './services/api.js';

// Submit contact form
const { contactMessage } = await contactsAPI.create({
  name: 'John',
  email: 'john@example.com',
  category: 'Support',
  message: 'I have a question...'
});
```

## 🔐 Authentication & Security

### Token Storage

- JWT token is stored in `localStorage` after login
- Token is automatically included in API requests via `Authorization: Bearer <token>` header
- Token is cleared on logout

### Protected Routes

Use the `ProtectedRoute` component to restrict pages to authenticated users:

```jsx
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './Pages/AdminDashboard';

<Routes>
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
</Routes>
```

### Token Expiry

If a token expires:
- Backend returns 401 Unauthorized
- Frontend should prompt user to re-login

## 🎨 Styling & Theming

### Global Styles

- `src/index.css` — Global CSS variables and defaults

### Theme System

- `src/context/ThemeContext.jsx` — Manages dark/light mode
- `src/components/ThemeToggle/` — Toggle button
- Theme preference is stored in localStorage

### Component Styles

Each component has a corresponding `.css` file:

```
src/components/Button/
├── Button.jsx
└── Button.css
```

Use CSS modules or BEM naming convention for scoped styles.

## 📤 File Upload

### Upload Form (`src/Pages/Upload/Upload.jsx`)

1. User selects a file
2. Form creates `FormData` with the file
3. Calls `resourcesAPI.upload(formData)`
4. Backend saves file and metadata to MongoDB
5. Frontend displays success/error message

### Upload Endpoint

- **Method**: POST
- **URL**: `/api/resources`
- **Body**: multipart/form-data with `file` field
- **Headers**: `Authorization: Bearer <token>`

## 🚀 Deployment

### Render Static Site

1. Fork the repo and connect to Render
2. Create a **Static Site** from your GitHub repo
3. **Settings**:
   - Root Directory: `frontend`
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://notezilla-backend-xxxxx.onrender.com/api
   ```
   *(Replace with your actual backend URL)*
5. **Deploy** and monitor build logs

### Local Testing Before Deploy

```bash
# Set production API URL for this build
$env:VITE_API_URL = "https://notezilla-backend-xxxxx.onrender.com/api"
npm ci
npm run build

# Serve the built site locally
npx serve dist -p 5006

# Open http://localhost:5006 and test
```

### Vercel

1. Connect your GitHub repo to Vercel
2. Set Root Directory to `frontend`
3. Set Build Command to `npm run build`
4. Add environment variable: `VITE_API_URL=https://your-backend-url/api`
5. Deploy

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sign up and create a new account
- [ ] Log in with valid credentials
- [ ] Attempt login with invalid credentials (should show error)
- [ ] Upload a file and verify it appears in Browse
- [ ] Submit a contact form
- [ ] Toggle dark/light theme
- [ ] Verify all navigation links work
- [ ] Check responsive design on mobile

### DevTools Network Debugging

1. Open browser DevTools → Network tab
2. Perform an action (e.g., login)
3. Verify the request targets the correct backend URL
4. Check response status (200, 401, 500, etc.)
5. Inspect response body for error messages

## 📝 Page Guide

| Page | Route | Protected | Purpose |
|------|-------|-----------|---------|
| Home | `/` | No | Landing page with features |
| Login | `/login` | No | User authentication |
| Signup | `/signup` | No | User registration |
| Browse | `/browse` | No | Resource discovery |
| Upload | `/upload` | **Yes** | File upload form |
| Contact | `/contact` | No | Contact/feedback form |
| About | `/about` | No | About the platform |
| Student Dashboard | `/student` | **Yes** | Student home |
| Faculty Dashboard | `/faculty` | **Yes** | Faculty home |
| Admin Dashboard | `/admin` | **Yes** (Admin) | Admin overview |
| Admin Analytics | `/admin/analytics` | **Yes** (Admin) | Analytics dashboard |
| Admin Users | `/admin/users` | **Yes** (Admin) | User management |
| Admin Resources | `/admin/resources` | **Yes** (Admin) | Resource management |

## 🔧 Development Commands

```bash
# Start dev server with hot reloading
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Vercel build (if needed)
npm run vercel-build
```

## 🐛 Troubleshooting

### CORS Errors

```
Access to XMLHttpRequest from origin '...' has been blocked by CORS policy
```

**Solution**: Ensure backend has `cors()` middleware enabled. If frontend and backend are on different domains, verify CORS settings on the backend.

### 404 Not Found on API

```
Fetch Error: Failed to fetch
```

**Solution**: Verify `VITE_API_URL` is set correctly. Check that the backend is running and accessible.

### Token Expires Immediately

**Solution**: Verify JWT_SECRET matches on backend and frontend. Clear localStorage and re-login.

### Build Succeeds but Site Shows Blank Page

**Solution**: Check browser console for errors. Verify `VITE_API_URL` was set during build (it's baked into the bundle).

### Uploaded Files Not Visible

**Solution**: Ensure backend is serving uploads from `/uploads`. Verify file upload succeeded on the backend.

## 📚 Component Examples

### Using AuthContext

```jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user, token } = useContext(AuthContext);

  return <div>Welcome, {user?.name}</div>;
}
```

### Using ThemeContext

```jsx
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make changes and test locally
4. Commit with clear messages (`git commit -am 'Add feature'`)
5. Push to branch (`git push origin feature/my-feature`)
6. Open a Pull Request

## 📄 License

MIT License

## 📞 Support

For issues or questions, open an issue on [GitHub](https://github.com/sanjana71006/NotezillaApp/issues).

---

**Last Updated**: November 2025  
**Repository**: [sanjana71006/NotezillaApp](https://github.com/sanjana71006/NotezillaApp)  
**Live Demo**: [Notezilla Frontend](https://notezilla-frontend-xxxxx.onrender.com)
