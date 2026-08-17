"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email address and password."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        console.error("Supabase login error:", loginError);
        setError(loginError.message);
        return;
      }

      if (!data.session) {
        setError(
          "Login was not completed. No active session was created."
        );
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to the authentication service."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 px-4">

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="p-12">

          <h1 className="text-center text-5xl font-bold text-blue-700">
            Welcome Back
          </h1>

          <p className="mt-4 text-center text-2xl text-slate-500">
            Sign in to SAIP
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-12 space-y-6"
          >

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                placeholder="name@company.co.za"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 text-lg outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-200 px-4 py-4 text-lg outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>

          <div className="mt-8 flex justify-between">

            <button
              type="button"
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              Forgot Password
            </button>

            <button
              type="button"
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              Register
            </button>

          </div>

        </div>

        <div className="border-t bg-slate-50 p-4 text-center text-sm text-slate-500">
          <p>SAIP • Version 0.1.0</p>
          <p>© ServiceKit Technologies</p>
        </div>

      </div>

    </main>
  );
}