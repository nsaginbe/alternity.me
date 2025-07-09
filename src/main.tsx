import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast';

// You need to add your Clerk publishable key to your .env file
// VITE_CLERK_PUBLISHABLE_KEY="your_publishable_key"
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
      <Toaster position="bottom-right" />
    </ClerkProvider>
  </React.StrictMode>,
)
