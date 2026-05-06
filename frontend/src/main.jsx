import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log("PUBLISHABLE_KEY:", PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  console.error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    ) : (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Missing Clerk Publishable Key</h1>
      </div>
    )}
  </React.StrictMode>,
)
