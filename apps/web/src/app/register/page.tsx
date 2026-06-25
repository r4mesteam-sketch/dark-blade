'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-primary">Create account</p>
              <h1 className="mt-4 text-3xl font-semibold">Join Dark Blade</h1>
            </div>
            <form className="space-y-5">
              <label className="block space-y-2 text-sm text-slate-300">
                <span>Display name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-2 text-sm text-slate-300">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-primary"
                />
              </label>
              <label className="block space-y-2 text-sm text-slate-300">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-primary"
                />
              </label>
              <button
                type="button"
                className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500"
              >
                Create account
              </button>
            </form>
            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
