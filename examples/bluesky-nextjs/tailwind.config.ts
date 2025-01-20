import type { Config } from "tailwindcss"


const twg = "var(--tw-gradient-stops)"

const config: Config = {
  darkMode: [ "class" ],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./common/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        104: "26rem", // 416px
        112: "28rem", // 448px
        120: "30rem", // 480px
        128: "32rem", // 512px
        144: "36rem", // 576px
        160: "40rem", // 640px
        176: "44rem", // 704px
        192: "48rem", // 768px
        208: "52rem", // 832px
        224: "56rem", // 896px
        240: "60rem", // 960px
        256: "64rem", // 1024px
      },
      backgroundImage: {
        "gradient-radial": `radial-gradient(${twg})`,
        "gradient-conic": `conic-gradient(from 180deg at 50% 50%, ${twg})`,
      },
      animation: {
        "word1": "fadeInOut 10s linear infinite 0s",  // Starts immediately
        "word2": "fadeInOut 10s linear infinite 2s",  // Starts after 2 seconds
        "word3": "fadeInOut 10s linear infinite 4s",  // Starts after 4 seconds
        "word4": "fadeInOut 10s linear infinite 6s",  // Starts after 6 seconds
        "word5": "fadeInOut 10s linear infinite 8s",  // Starts after 8 seconds
      },
      keyframes: {
        fadeInOut: {
          "0%, 20%": { 
            opacity: "1", 
            transform: "translateY(0)" 
          },   // Word is visible
          "90%, 100%": { 
            opacity: "0", 
            transform: "translateY(-1em)" 
          },  // Word fades and moves up
        },
      },
      colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
  ],
}

export default config
