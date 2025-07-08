# Project Documentation: social-d0o-fun

## Overview
This project is a web application for social platform administration, built with React, TypeScript, Vite, and Tailwind CSS. It provides features for user management, order management, transaction management (including refunds), and service management. The backend uses Supabase for authentication and database operations.

---

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend/DB:** Supabase
- **State Management:** React Context API, React Hooks

---

## Folder Structure
- `src/`
  - `api/` — API functions for interacting with Supabase (e.g., `transactionApi.ts`, `userApi.ts`)
  - `assets/` — Static assets (images, SVGs)
  - `components/`
    - `shared/` — Shared UI components (e.g., `NavBar`, `AdminSidebar`, `LoadingSpinner`)
    - `ui/` — Basic UI elements (e.g., `Button`, `Input`)
  - `contexts/` — React Context providers (e.g., `AuthProvider`)
  - `hooks/` — Custom React hooks (e.g., `useAuth`, `useDebounce`)
  - `layouts/` — Layout components for different page types
  - `lib/` — Utility libraries (e.g., `supabaseClient.ts`, `utils.ts`)
  - `pages/` — Page components, organized by route and role
    - `admin/` — Admin pages (e.g., `TransactionManager`, `UserManagement`)
    - `auth/` — Auth pages (`LoginPage`, `RegisterPage`)
    - `user/` — User pages (`HomePage`, `WalletPage`)
    - `NotFoundPage.tsx` — 404 page
  - `types/` — TypeScript type definitions

---

## Key Features
### 1. Authentication
- Uses Supabase for user authentication.
- `AuthProvider` context manages auth state and provides hooks for login/logout.

### 2. Admin Panel
- **Transaction Management:**
  - View all transactions, including refunds.
  - Search by user or description.
  - Sort by time or amount, ascending/descending.
- **User Management:**
  - View, search, and manage users.
- **Order Management:**
  - View and manage orders.
- **Service Management:**
  - Manage available services.

### 3. User Panel
- **Wallet:**
  - View balance and transaction history.
- **Order Services:**
  - Place and manage orders.

---

## API Layer
- Located in `src/api/`
- Example: `getTransactions` fetches all transactions from Supabase, ordered by creation date.
- All API functions return typed data and handle errors.

---

## Styling
- Uses Tailwind CSS for utility-first styling.
- Custom color themes and responsive layouts.

---

## How to Run
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start development server:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   ```

---

## Environment Variables
- Configure Supabase credentials in `.env` file:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

---

## Notable Files
- `src/api/transactionApi.ts` — Transaction API functions
- `src/pages/admin/TransactionManager.tsx` — Admin transaction management UI
- `src/contexts/AuthProvider.tsx` — Auth context
- `src/components/shared/AdminSidebar.tsx` — Admin navigation

---

## Extending the Project
- Add new pages in `src/pages/`
- Add new API endpoints in `src/api/`
- Add new UI components in `src/components/ui/`

---

## License
This project is for internal use. License details TBD.

---

## File Structure Details

### src/api/
- `addFundApi.ts`: API functions for adding funds to user wallets.
- `authApi.ts`: Handles authentication-related API calls (login, register, logout, session).
- `orderApi.ts`: API for creating, fetching, and managing user orders.
- `serviceApi.ts`: API for listing and managing available services.
- `transactionApi.ts`: Fetches all transactions (including refunds), sorts by date, and handles errors.
- `userApi.ts`: API for user management (fetch, update, list users).

### src/components/shared/
- `AdminSidebar.tsx`: Sidebar navigation for admin pages.
- `LoadingSpinner.tsx`: Loading indicator component.
- `NavBar.tsx`: Main navigation bar for the app.
- `ProtectedRoute.tsx`: Route guard for authenticated access.

### src/components/ui/
- `Button.tsx`: Reusable button component.
- `Input.tsx`: Reusable input field component.

### src/contexts/
- `AuthProvider.tsx`: Provides authentication context and state to the app.

### src/hooks/
- `useAuth.ts`: Custom hook for accessing authentication state and actions.
- `useDebounce.ts`: Custom hook for debouncing input values.

### src/layouts/
- `AdminLayout.tsx`: Layout wrapper for admin pages.
- `MainLayout.tsx`: Layout wrapper for main user pages.

### src/lib/
- `supabaseClient.ts`: Initializes and exports the Supabase client instance.
- `utils.ts`: Utility functions used throughout the app.

### src/pages/
- `NotFoundPage.tsx`: 404 Not Found page.
- `admin/`
  - `ControlCenter.tsx`: Admin dashboard overview.
  - `OrderManager.tsx`: Admin order management UI.
  - `ServiceManager.tsx`: Admin service management UI.
  - `TransactionManager.tsx`: Admin transaction management (view/search/sort all transactions, including refunds).
  - `UserManagement.tsx`: Admin user management UI.
- `auth/`
  - `LoginPage.tsx`: User login page.
  - `RegisterPage.tsx`: User registration page.
- `user/`
  - `HomePage.tsx`: User dashboard/home.
  - `MyOrdersPage.tsx`: User's order history and management.
  - `OrderServicePage.tsx`: Place a new service order.
  - `TransactionPage.tsx`: User's transaction history.
  - `WalletPage.tsx`: User wallet and balance view.

### src/types/
- `index.ts`: TypeScript type definitions for entities (User, Transaction, Order, etc).
