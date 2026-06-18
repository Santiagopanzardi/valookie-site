# Valookie — E-commerce & Bakery Platform

Full-stack e-commerce application for [Valookie](https://valookie.com), a New York-style cookie bakery & café in Mataró, Barcelona.

Built from scratch as a production-ready platform handling real orders and payments.

## Live

- **Website:** [valookie.com](https://valookie.com)
- **Backend:** Hosted on [Fly.dev](https://fly.io)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7 |
| Styling | Tailwind CSS, Radix UI, Lucide Icons |
| Backend/DB | PocketBase (SQLite, REST API, auth, file storage) |
| Payments | Stripe (Checkout Sessions, Webhooks) |
| Hosting | Vercel (frontend), Fly.dev (PocketBase) |
| AI-assisted | Development workflow powered by Claude AI |

## Features

- Product catalog with categories and detail pages
- Shopping cart with real-time updates
- Stripe checkout integration with webhook order confirmation
- User authentication (signup, login, password reset)
- User dashboard with order history
- Wishlist
- Product reviews
- Admin order management panel
- Contact form with email notifications
- Newsletter signup
- Responsive design (mobile-first)
- SEO optimized (meta tags, sitemap, robots.txt)
- Image optimization (WebP format)

## Architecture

```
cookie_bakery_site/
├── apps/
│   ├── web/              # React SPA (Vite)
│   │   ├── src/
│   │   │   ├── pages/        # Route pages
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── contexts/     # Auth context
│   │   │   └── lib/          # PocketBase client, utilities
│   │   └── api/              # Serverless functions (Stripe webhook)
│   └── pocketbase/       # Backend
│       ├── pb_hooks/         # Server-side hooks (email notifications)
│       └── pb_migrations/    # Database schema migrations
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PocketBase instance (local or remote)
- Stripe account (for payments)

### Installation

```bash
git clone https://github.com/Santiagopanzardi/valookie-site.git
cd valookie-site
npm install
```

### Environment Variables

Create `apps/web/.env`:

```env
VITE_POCKETBASE_URL=http://localhost:8090
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Development

```bash
# Start PocketBase
cd apps/pocketbase && ./pocketbase serve

# Start frontend (in another terminal)
cd apps/web && npm run dev
```

The app will be available at `http://localhost:3000`.

## Deployment

- **Frontend:** Deployed to Vercel with `vercel --prod`
- **Backend:** Deployed to Fly.dev with `fly deploy` from `apps/pocketbase/`

## Author

**Santiago Panzardi** — Full Stack Developer
- [LinkedIn](https://linkedin.com/in/santiago-panzardi)
- [Email](mailto:santiago.panzardi@gmail.com)
