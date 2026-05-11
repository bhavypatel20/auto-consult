import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="container" style={{ paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', fontWeight: 800 }}>
          Shakti <span style={{ color: 'var(--primary)' }}>Auto Consult</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Run your dealership-style consultancy with clarity, speed, and control.
        </p>
      </div>

      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ marginBottom: '24px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Sign in to access your dashboard, inventory, and customer lists.
        </p>
        {!userId ? (
          <div style={{ width: '100%', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <div className="btn-primary" style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}>Sign In</div>
            </SignInButton>
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <div className="btn-primary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--primary)', boxShadow: 'none', textAlign: 'center', cursor: 'pointer' }}>Sign Up</div>
            </SignUpButton>
          </div>
        ) : (
          <Link href="/dashboard/inventory" className="btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
            Go to Dashboard
          </Link>
        )}
      </div>

    </main>
  );
}
