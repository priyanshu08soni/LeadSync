# Lead Management System

A full-stack web application for managing sales leads with authentication, CRUD operations, server-side pagination, and advanced filtering capabilities.

## 🚀 Features

- **Authentication System**: Secure JWT-based authentication with httpOnly cookies
- **Lead Management**: Complete CRUD operations for managing leads
- **Advanced Filtering**: Server-side filtering with multiple operators
- **Pagination**: Efficient server-side pagination
- **Responsive UI**: Modern React interface with AG Grid
- **Data Validation**: Comprehensive input validation and error handling

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **AG Grid** - High-performance data grid for displaying leads
- **Axios** - HTTP client for API requests
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cookie Parser** - HTTP cookie parsing middleware

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/priyanshu08soni/LeadSync.git
cd LeadSync
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead-manageme
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📊 Database Schema

### Lead Model

```javascript
{
  id: ObjectId,
  first_name: String (required),
  last_name: String (required),
  email: String (required, unique),
  phone: String,
  company: String,
  city: String,
  state: String,
  source: Enum ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'],
  status: Enum ['new', 'contacted', 'qualified', 'lost', 'won'],
  score: Number (0-100),
  lead_value: Number,
  last_activity_at: Date (nullable),
  is_qualified: Boolean (default: false),
  created_at: Date,
  updated_at: Date
}
```

### User Model

```javascript
{
  id: ObjectId,
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  created_at: Date,
  updated_at: Date
}
```

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Lead Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leads` | Create a new lead |
| GET | `/api/leads` | Get leads with pagination & filters |
| GET | `/api/leads/:id` | Get a specific lead |
| PUT | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |

## 🔍 Filtering System

The application supports advanced server-side filtering with the following operators:

### String Fields (email, company, city)
- `equals` - Exact match
- `contains` - Partial match (case-insensitive)

### Enum Fields (status, source)
- `equals` - Exact match
- `in` - Match any of the provided values

### Number Fields (score, lead_value)
- `equals` - Exact match
- `gt` - Greater than
- `lt` - Less than
- `between` - Between two values

### Date Fields (created_at, last_activity_at)
- `on` - Specific date
- `before` - Before date
- `after` - After date
- `between` - Between two dates

### Boolean Fields (is_qualified)
- `equals` - True/False

## 📄 Pagination

Server-side pagination is implemented with the following parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "data": [/* leads array */],
  "page": 2,
  "limit": 20,
  "total": 146,
  "totalPages": 8
}
```

## 🎨 Frontend Pages

1. **Authentication Pages**
   - Login page with form validation
   - Register page with user creation

2. **Leads Management**
   - Leads list with AG Grid table
   - Server-side pagination and filtering
   - Lead creation form
   - Lead editing form

3. **Protected Routes**
   - All lead pages require authentication
   - Automatic redirect to login if unauthenticated

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **httpOnly Cookies**: Tokens stored in secure cookies
- **Password Hashing**: bcrypt for secure password storage
- **Route Protection**: Middleware to protect API routes
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🚀 Deployment

### Frontend (Vercel)

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Backend (Render/Railway/Heroku)

1. Set environment variables in your hosting platform:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

2. Deploy using your preferred platform's deployment method

## 📱 Usage

1. **Registration**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **View Leads**: Browse leads in the data grid with sorting and filtering
4. **Create Lead**: Add new leads using the creation form
5. **Edit Lead**: Update existing lead information
6. **Filter & Search**: Use advanced filters to find specific leads
7. **Pagination**: Navigate through large datasets efficiently

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- None at the moment

## 📞 Support

If you encounter any issues or have questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using React and Node.js**
