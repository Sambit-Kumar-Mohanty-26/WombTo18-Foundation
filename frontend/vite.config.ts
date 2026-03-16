import { defineConfig, loadEnv } from 'vite'
// @ts-ignore
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // @ts-ignore
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      // @ts-ignore
      'process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID': JSON.stringify(env.NEXT_PUBLIC_RAZORPAY_KEY_ID || env.VITE_RAZORPAY_KEY)
    },
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used - do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        // @ts-ignore
        '@': path.resolve(__dirname, './src'),
      },
    },
    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
