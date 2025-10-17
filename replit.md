# Offer Letter Automation System

## Overview
A professional React + Vite frontend application for automating offer letter generation. Users can sign up, log in, upload candidate resumes, fill out comprehensive offer letter forms, and submit everything to an n8n webhook for processing.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS with custom design system
- **Routing**: Wouter (React Router alternative)
- **Validation**: Zod schemas
- **State Management**: React hooks + TanStack Query
- **Backend**: Express.js (minimal, proxy to n8n webhook)
- **Authentication**: localStorage-based (no database required)

## Features
- ✅ User authentication (signup/login) with localStorage
- ✅ Protected routing
- ✅ Resume upload with drag & drop support
- ✅ PDF/DOC to Base64 conversion
- ✅ Comprehensive offer letter form with validation
- ✅ Real-time form validation
- ✅ Success/error alerts with animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Professional Material Design UI

## Design System
- **Primary Color**: Professional Blue (220 90% 56%)
- **Typography**: Inter (UI), JetBrains Mono (technical data)
- **Spacing**: Consistent padding/margins (p-6, p-8, mb-6)
- **Components**: Custom-designed following Material Design principles
- **Animations**: Smooth transitions (200-300ms)

## Project Structure
```
client/
  ├── src/
  │   ├── components/        # Reusable components
  │   │   ├── Alert.tsx      # Success/error alerts
  │   │   ├── ProtectedRoute.tsx
  │   │   └── ResumeUpload.tsx
  │   ├── pages/             # Route pages
  │   │   ├── Login.tsx
  │   │   ├── Signup.tsx
  │   │   ├── Home.tsx       # Main dashboard with form
  │   │   └── not-found.tsx
  │   ├── utils/             # Utility functions
  │   │   ├── auth.ts        # LocalStorage auth
  │   │   └── fileUtils.ts   # Base64 conversion
  │   └── App.tsx            # Main app with routing
server/
  └── routes.ts              # API endpoint for n8n webhook
shared/
  └── schema.ts              # Zod schemas for validation
```

## Form Fields
The offer letter form includes:
1. **Personal Information**
   - Candidate Name
   - Student Signature

2. **Job Details**
   - Designation
   - Department
   - Reporting Manager
   - Working Hours (Timings)
   - Probation Period
   - Core Role & Responsibilities

3. **Compensation**
   - CTC (Cost to Company)
   - Salary Sheet

4. **Additional Information**
   - Date of Offer Letter
   - Resume Upload (PDF/DOC)

## Environment Variables
- `N8N_WEBHOOK_URL`: The n8n webhook endpoint URL (default: https://your-n8n-url/webhook/offer-letter)

## API Endpoints
- `POST /api/submit-offer-letter`: Submit offer letter data to n8n webhook
- `GET /api/health`: Health check endpoint

## Webhook Payload Format
```json
{
  "resume_base64": "base64_encoded_string",
  "fields": {
    "candidate_name": "string",
    "designation": "string",
    "reporting_manager": "string",
    "timings": "string",
    "department": "string",
    "probation_period": "string",
    "role_responsibilities": "string",
    "ctc": "string",
    "salary_sheet": "string",
    "date_of_offer_letter": "string",
    "student_signature": "string"
  }
}
```

## User Flow
1. User visits the app (redirected to login if not authenticated)
2. Sign up with username and password (stored in localStorage)
3. Log in and redirect to /home
4. Upload candidate resume (PDF/DOC, max 10MB)
5. Fill out all offer letter form fields
6. Submit → Data sent to n8n webhook
7. Success/error alert displayed
8. Form can be reset or filled again

## Development
- Run: `npm run dev`
- The app runs on port 5000
- Frontend and backend are served together via Vite

## Authentication
- Simple localStorage-based authentication (as per requirements)
- Passwords are hashed using SHA-256 before storage
- No backend database required
- Users are stored in browser localStorage
- Session persists across page refreshes
- Logout clears the session

**Security Note**: This implementation uses client-side localStorage authentication as explicitly requested. This approach has inherent security limitations:
- All authentication logic runs in the browser
- localStorage can be manipulated via browser console
- Suitable for prototypes/demos, not production systems
- For production, implement server-side authentication with secure session management

## Recent Changes
- 2025-10-16: Initial implementation with complete frontend and backend
- Design follows Material Design principles with professional blue theme
- All components include proper data-testid attributes for testing
- Form validation using Zod schemas
- Responsive design for all screen sizes
