
# Inventra AI - Smart Warehouse Inventory Management System

A complete full-stack production-style inventory application with AI Stock Predictions, Real-time WebSockets, and Advanced Role-Based Security.

## Features Added for Hackathon Strategy
- **AI Stock Prediction**: Calculates average daily usage and recommends auto-ordering.
- **Fraud Detection Logic**: Admin logs and validation safeguards against massive discrepancies.
- **Real-Time WebSockets**: Live stock updates across all clients.
- **Transactions & Validation**: Guaranteed DB consistency (ACID) on warehouse transfers.
- **Google OAuth**: Fast login with email/password support via Passport.js.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally on port 5432.

### 1. Database Setup
🎉 **Zero Configuration Required!** 
The project has been upgraded to use **SQLite**. The database (`inventra.sqlite`) will automatically initialize and seed itself with demo data the first time you run the backend server and make an API request!

### 2. Backend Configuration
1. Navigate to the \`backend\` directory:
   \`\`\`bash
   cd backend
   npm install
   \`\`\`
2. Configure environment variables in \`backend/.env\` (already created). Update \`DATABASE_URL\` if your postgres password differs from \`postgres\`.
3. Add your actual Google credentials to \`.env\` if testing OAuth flow:
   \`\`\`env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   \`\`\`
4. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`

### 3. Frontend Configuration
1. Open a new terminal and navigate to the \`frontend\` directory:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`
2. Start the Vite React app:
   \`\`\`bash
   npm run dev
   \`\`\`

Go to \`http://localhost:5173\` and start exploring Inventra AI!

---

*Note: The first user to sign up will automatically be assigned the "admin" role providing access to Admin routes.*
