// app/layout.tsx
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "ToDo App",
  description: "Next.js + Supabase ToDo App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: 12, background: "#f3f4f6" }}>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
