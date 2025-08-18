# Libas Collective - E-commerce Platform

A modern e-commerce platform built with Next.js, featuring user authentication, product management, shopping cart functionality, and email notifications.

## Features

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure user registration and login
- **Protected Routes**: Secure access to user-specific features
- **User Management**: Profile management and account settings

### 🛒 Shopping Features
- **Product Catalog**: Browse products with search and filtering
- **Shopping Cart**: Add, remove, and manage cart items
- **Favorites**: Save and manage favorite products
- **User Dashboard**: Personal account management

### 📧 Email System
- **Welcome Emails**: Automated welcome messages for new users
- **Resend Integration**: Professional email delivery service
- **Email Notifications**: User-friendly email communications

### 🎨 User Experience
- **Responsive Design**: Mobile-first responsive layout
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Real-time Updates**: Live cart and favorites updates
- **Search Functionality**: Advanced product search and filtering

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Firebase Authentication
- **Email Service**: Resend
- **Database**: Firebase Firestore
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Resend account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd libas-collective
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin (for server-side operations)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY=your_private_key

   # Email Service
   RESEND_API_KEY=your_resend_api_key
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── send-welcome-email/ # Welcome email endpoint
│   ├── cart/              # Shopping cart page
│   ├── favorites/         # User favorites page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── products/          # Product pages
│   └── search/            # Search results page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── ui/                # Reusable UI components
│   └── ...                # Feature-specific components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
└── public/                # Static assets
```

## API Endpoints

### Email System
- `POST /api/send-welcome-email` - Send welcome email to new users

## Key Features

### User Registration Flow
1. User fills registration form
2. Account created in Firebase
3. Welcome email sent automatically
4. User redirected to home page

### Shopping Cart
- Persistent cart storage
- Real-time updates
- Quantity management
- Cart total calculation

### Product Management
- Product catalog with categories
- Search and filtering
- Product details with images
- Related products suggestions

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- Firebase configuration
- Resend API key
- Firebase Admin credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions:
- Check the Firebase documentation
- Review Resend email service docs
- Open an issue in the repository

---

**Libas Collective** - Your modern e-commerce solution 🛍️
