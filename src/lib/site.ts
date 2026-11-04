/** Public origin of the site (custom domain). Override with NEXT_PUBLIC_SITE_URL if it ever changes. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mannatframing.ca").replace(/\/$/, "");
