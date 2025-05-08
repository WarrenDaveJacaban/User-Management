// Dynamic environment configuration based on hostname
const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
const isVercel = hostname.includes('vercel.app');
const isRender = hostname.includes('render.com');
const isNetlify = hostname.includes('netlify.app');

// Define the backend endpoints
const LOCAL_API = 'http://localhost:4000/accounts';
const RENDER_API = 'https://user-management-q29q.onrender.com/accounts';
const VERCEL_API = 'https://user-management-eight-kappa.vercel.app/accounts';
const DEFAULT_REMOTE_API = RENDER_API; // Default for other hosting platforms

// This will automatically choose the correct API endpoint based on where the frontend is running
export const environment = {
    production: false,
    // Local development uses localhost API, otherwise use the appropriate deployed API
    apiUrl: isLocalhost 
        ? LOCAL_API 
        : isRender 
            ? RENDER_API
            : isVercel
                ? VERCEL_API
                : DEFAULT_REMOTE_API,
    // For debugging - shows which environment was detected
    detectedEnvironment: isLocalhost 
        ? 'Local' 
        : isRender 
            ? 'Render' 
            : isVercel 
                ? 'Vercel' 
                : 'Other'
};

