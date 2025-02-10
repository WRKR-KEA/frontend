import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: {
          1: "var(--main-1)",
          2: "var(--main-2)",
          3: "var(--main-3)",
        },
        sub: {
          1: "var(--sub-1)",
          2: "var(--sub-2)",
          3: "var(--sub-3)",
        },
        accent: {
          1: "var(--accent-1)",
          2: "var(--accent-2)",
        },
        gray: {
          1: "var(--gray-1)",
          2: "var(--gray-2)",
          3: "var(--gray-3)",
          4: "var(--gray-4)",
          5: "var(--gray-5)",
          6: "var(--gray-6)",
        },
        component: "var(--component)",
      },
      backgroundColor: {
        request: "var(--request-bg)",
        cancel: "var(--cancel-bg)",
        inProgress: "var(--in-progress-bg)",
        reject: "var(--reject-bg)",
        complete: "var(--complete-bg)",
      },
      textColor: {
        request: "var(--request)",
        cancel: "var(--cancel)",
        inProgress: "var(--in-progress)",
        reject: "var(--reject)",
        complete: "var(--complete)",
      },
    },
  },
  plugins: [],
} satisfies Config;
