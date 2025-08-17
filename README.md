# ShopSizzle

ShopSizzle is a modern e-commerce web application built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS. It features authentication, product browsing, cart management, admin dashboard, and more.

## Features

- **Authentication**: Sign in/up with Clerk, including social login (Google, GitHub, etc.)
- **Product Catalog**: Browse, search, filter, and sort products
- **Cart & Wishlist**: Add products to cart and wishlist
- **Admin Dashboard**: View store stats, recent orders, and manage users/orders
- **Responsive UI**: Mobile-friendly design using shadcn-ui and Tailwind CSS
- **Order Management**: Track order status (delivered, shipped, processing, etc.)
- **Profile Management**: Users can manage their profiles via Clerk
- **Security**: Session management and protection against common attacks

## Technologies Used

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn-ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Supabase](https://supabase.com/) (integration)
- [Clerk](https://clerk.com/) (authentication)
- [Radix UI](https://www.radix-ui.com/) (UI primitives)
- [Zod](https://zod.dev/) (validation)

## Getting Started

### Prerequisites

- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd ShopSizzle

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Authentication Setup (Clerk)

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application and get your API keys
3. Add your keys to `.env.local`:

   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

4. (Optional) Enable social providers in Clerk Dashboard
5. Restart the development server

See `CLERK_SETUP.md` for detailed instructions.

## Project Structure

```
src/
  components/      # UI and feature components
  data/            # Static data (e.g., products)
  hooks/           # Custom React hooks
  integrations/    # External service integrations (e.g., Supabase)
  lib/             # Utility functions and auth logic
  pages/           # Application pages (Home, Products, Admin, etc.)
  store/           # Redux store and slices
  types/           # TypeScript types
public/            # Static assets
supabase/          # Supabase functions and config
```

## Deployment

- Deploy via [Lovable](https://lovable.dev/projects/77a92c81-27bb-4dd0-aa17-ea6fcdf068d4) (Share → Publish)
- To connect a custom domain, go to Project > Settings > Domains in Lovable

## Support

- Clerk Documentation: https://clerk.com/docs
- Clerk React Guide: https://clerk.com/docs/quickstarts/react
- Lovable Docs: https://docs.lovable.dev/
