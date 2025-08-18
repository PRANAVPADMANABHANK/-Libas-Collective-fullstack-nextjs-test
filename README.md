# Libas Collective - E-commerce Platform

A modern e-commerce platform built with Next.js, featuring secure user authentication with OTP verification, product management, shopping cart functionality, and email notifications.

## Features

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure user registration and login
- **OTP Verification**: Email-based one-time password verification for enhanced security
- **Protected Routes**: Secure access to user-specific features
- **User Management**: Profile management and account settings

### 🛒 Shopping Features
- **Product Catalog**: Browse products with search and filtering
- **Shopping Cart**: Add, remove, and manage cart items
- **Favorites**: Save and manage favorite products
- **User Dashboard**: Personal account management

### 📧 Email System
- **OTP Emails**: Secure verification codes sent via email
- **Welcome Emails**: Automated welcome messages for new users
- **Resend Integration**: Professional email delivery service
- **Email Notifications**: User-friendly email communications

### 🎨 User Experience
- **Responsive Design**: Mobile-first responsive layout
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Real-time Updates**: Live cart and favorites updates
- **Search Functionality**: Advanced product search and filtering

### ⚡ Performance & SEO
- **Server-Side Rendering (SSR)**: Dynamic content rendering for optimal performance
- **Static Site Generation (SSG)**: Pre-built pages for faster loading
- **SEO Optimized**: Meta tags, structured data, and sitemap generation
- **Fast Loading**: Optimized images and code splitting

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Firebase Authentication with OTP verification
- **Email Service**: Resend
- **Database**: Firebase Firestore
- **Rendering**: SSR (Server-Side Rendering) & SSG (Static Site Generation)
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
│   │   ├── send-otp/      # OTP verification endpoints
│   │   └── send-welcome-email/ # Welcome email endpoint
│   ├── cart/              # Shopping cart page
│   ├── favorites/         # User favorites page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── products/          # Product pages
│   └── search/            # Search results page
├── components/            # React components
│   ├── auth/              # Authentication components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── otp-verification-form.tsx
│   ├── ui/                # Reusable UI components
│   └── ...                # Feature-specific components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
└── public/                # Static assets
```

## API Endpoints

### Authentication & OTP
- `POST /api/send-otp` - Send OTP verification code to user's email
- `PUT /api/send-otp` - Verify OTP code and complete registration

### Email System
- `POST /api/send-welcome-email` - Send welcome email to new users

## Key Features

### User Registration Flow with OTP
1. User fills registration form with name, email, and password
2. System sends 6-digit OTP code to user's email
3. User enters OTP code in verification form
4. OTP is verified (10-minute expiration)
5. User account is created in Firebase
6. Welcome email sent automatically
7. User redirected to home page

### OTP Security Features
- **6-digit codes**: Secure random number generation
- **10-minute expiration**: Time-limited verification codes
- **Resend functionality**: Users can request new codes
- **Email verification**: Ensures valid email addresses
- **Rate limiting**: Prevents abuse (implemented in production)

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

### Performance Optimization
- **SSR for Dynamic Content**: Product pages and search results rendered server-side
- **SSG for Static Content**: Home page, category pages, and static content pre-built
- **Image Optimization**: Next.js Image component for optimized loading
- **Code Splitting**: Automatic code splitting for better performance

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

### Production Considerations
- **OTP Storage**: In production, use Redis or database instead of in-memory storage
- **Rate Limiting**: Implement proper rate limiting for OTP endpoints
- **Email Templates**: Customize email templates for your brand
- **Security**: Consider additional security measures like IP-based restrictions

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
