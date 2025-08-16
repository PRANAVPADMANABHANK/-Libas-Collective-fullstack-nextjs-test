# Libas Collective - E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15, Firebase, and TypeScript.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript
- **Firebase Integration**: Authentication, Firestore database, real-time updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Favorites**: Live updates for user favorites
- **Product Management**: Categories, search, filtering, and pagination
- **Shopping Cart**: Persistent cart with local storage
- **SEO Optimized**: Meta tags, structured data, and sitemap generation

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Database**: Firestore (NoSQL)
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
├── contexts/             # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and Firebase config
├── public/               # Static assets
└── scripts/              # Database seeding scripts
```

## 🌟 Key Features

### Real-time Favorites System
- Users can add/remove products to favorites
- Real-time updates across all components
- Persistent storage in Firestore

### Product Management
- Product categories and filtering
- Advanced search functionality
- Product detail pages with related products

### Shopping Cart
- Add/remove products
- Persistent cart data
- Quantity management

### Authentication
- Email/password authentication
- User profile management
- Protected routes

### SEO & Performance
- Server-side rendering (SSR) for product pages
- Static generation (SSG) for homepage
- JSON-LD structured data
- Dynamic sitemap generation
- Lazy-loaded images
- Open Graph and Twitter meta tags

### Firebase Functions
- User welcome emails
- Product recommendations
- Analytics data
- User data cleanup
- Product view tracking

## 📱 Responsive Design

The platform is built with a mobile-first approach and includes:
- Responsive navigation
- Mobile-optimized product grids
- Touch-friendly interactions
- Adaptive layouts for all screen sizes

## 🔒 Security

- Firebase security rules
- Protected API routes
- User authentication
- Data validation

## 🚀 Deployment

The project is configured for easy deployment on Vercel:

1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic builds

**Current Status**: ✅ Successfully deployed to Vercel

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │    │   Firebase      │    │   Vercel        │
│                 │    │                 │    │                 │
│ • App Router   │◄──►│ • Authentication│    │ • Hosting       │
│ • SSR/SSG      │    │ • Firestore     │    │ • CI/CD         │
│ • API Routes   │    │ • Functions     │    │ • Edge Network  │
│ • Image Opt    │    │ • Security      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed Firestore with sample data

## 📊 Performance Features

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: WebP/AVIF formats with responsive sizing
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Static generation with ISR for optimal performance

## 🎯 SEO Features

- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Structured Data**: JSON-LD schemas for rich snippets
- **Sitemap**: Dynamic XML sitemap generation
- **Robots.txt**: Search engine optimization
- **Canonical URLs**: Proper URL canonicalization
- **Schema Markup**: Product, Organization, and Website schemas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js 15, Firebase, and TypeScript**