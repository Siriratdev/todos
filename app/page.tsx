// app/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/auth/login");
  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to ToDo App</h1>
        <p>
          <Link href="/auth/login">Go to Login</Link> or <Link href="/auth/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
