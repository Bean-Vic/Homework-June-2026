import { redirect } from "next/navigation";
import { auth, isGoogleAuthConfigured } from "@/auth";
import { GoogleSignInButton } from "@/app/components/GoogleSignInButton";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="muse-logo login-logo">MUSE</div>
        <GoogleSignInButton disabled={!canAttemptGoogleSignIn()} />
        {!canAttemptGoogleSignIn() ? (
          <p className="login-env-hint">Missing Google OAuth client id or secret in `.env`.</p>
        ) : null}
      </section>
    </main>
  );
}

function canAttemptGoogleSignIn() {
  return isGoogleAuthConfigured() || process.env.MOCK_AUTH_ENABLED === "true";
}
