import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          default: "var(--bg-default)",
          subtle: "var(--bg-subtle)",
          muted: "var(--bg-muted)",
          hover: "var(--bg-hover)",
          active: "var(--bg-active)"
        },
        text: {
          default: "var(--text-default)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
          placeholder: "var(--text-placeholder)",
          inverse: "var(--text-inverse)"
        },
        border: {
          default: "var(--border-default)",
          hover: "var(--border-hover)",
          strong: "var(--border-strong)",
          focus: "var(--border-focus)"
        },
        accent: {
          DEFAULT: "var(--accent-default)",
          hover: "var(--accent-hover)",
          active: "var(--accent-active)",
          subtle: "var(--accent-subtle-bg)"
        }
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px"
      },
      fontFamily: {
        sans: ["Inter", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
