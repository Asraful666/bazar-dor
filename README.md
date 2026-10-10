# 🛒 বাজার দর | BazarDor

A responsive Bengali market-price application for viewing daily
essential-product prices, price changes, and market-based comparisons.


## 🛠️ Technologies

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- BetterAuth
- MongoDB
- React Hot Toast

## ✨ Key Features

1. **Daily Market Prices**  
   View product names, units, prices in Bengali numerals, and price-change badges.

2. **Top Price Changes**  
   Separate sections display the top six price risers and fallers.

3. **Category Browsing and Sorting**  
   Browse products by category and sort prices numerically in ascending
   or descending order.

4. **Protected Product Details**  
   Signed-in users can view minimum, maximum, average, and market-specific prices.

5. **Authentication**  
   Email/password authentication with Google and GitHub OAuth integration.

6. **Profile Updates**  
   Users can update their names from a dedicated profile update route.

7. **Responsive Interface**  
   Responsive grids, category navigation, and scrollable market-price tables.

8. **Loading and Error States**  
   Skeleton loaders, toast notifications, and friendly 404 pages.

## 📄 Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Home and product lists | Public |
| `/category/[slug]` | Category products and sorting | Public |
| `/product/[slug]` | Product and market-price details | Protected |
| `/signin` | Sign in | Public |
| `/signup` | Create an account | Public |
| `/profile` | User profile | Protected |
| `/profile/update` | Update user name | Protected |

## 🚀 Local Setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and configure:

```dotenv
MONGODB_URI=
MONGODB_DB_NAME=bazar-dor
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Configure the OAuth callback URLs:

```text
Google: http://localhost:3000/api/auth/callback/google
GitHub: http://localhost:3000/api/auth/callback/github
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## 📦 Production Build

```bash
npm run build
npm start
```

For deployment, configure the environment variables and update
`BETTER_AUTH_URL` and OAuth callback URLs to the production domain.

Never commit `.env.local` or actual credentials.

## 🌐 Product API

Primary:
https://api.api-store.workers.dev/api/bazardor

Alternative:
https://api.abcz.workers.dev/api/bazardor

The application tries the alternative API if the primary request fails.

## 📝 Price Information

Prices are indicative and may vary by market.

Average price is calculated from the midpoint of each market's
minimum and maximum prices.

## 👨‍💻 Author

**Md Asraful Islam**

GitHub: https://github.com/Asraful666