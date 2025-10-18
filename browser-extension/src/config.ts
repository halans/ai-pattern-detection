const FALLBACK_API_URL = 'https://api.slopdetector.me';

export const API_BASE_URL: string =
  (import.meta.env?.VITE_EXTENSION_API_URL as string | undefined) || FALLBACK_API_URL;
