/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        VITE_COVALENT_API_KEY: process.env.VITE_COVALENT_API_KEY,
        VITE_ETHPLORER_API_KEY: process.env.VITE_ETHPLORER_API_KEY,
        VITE_BLOCKCHAIR_API_KEY: process.env.VITE_BLOCKCHAIR_API_KEY,
    },
    // Include any other Next.js config options you need
};

export default nextConfig;
