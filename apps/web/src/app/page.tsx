import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-white">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full bg-white/5 px-4 py-2 text-sm text-primary ring-1 ring-primary/20">
              Dark Blade marketplace • Bitcoin-only commerce</div>
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Build your elite multi-vendor Bitcoin store in one secure platform.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-400">
                Dark Blade powers modern sellers with subscription shops, encrypted chat, admin controls, and Bitcoin-native checkout for buyers who want privacy and speed.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500">
                Start selling today
              </Link>
              <Link href="/login" className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500">
                Buyer login
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-900/80 p-6 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">Featured launch</p>
                <p className="mt-2 leading-7">Accept Bitcoin payments with enterprise-grade order workflows, real-time invoice generation, and encrypted conversations between buyers and sellers.</p>
              </div>
              <div className="grid gap-4">
                {[
                  'Seller subscriptions with automatic renewal alerts',
                  'Bitcoin invoice generation and transaction confirmation',
                  'Encrypted buyer-seller chat and support ticket routing',
                  'Dark UI optimized for brand-forward storefronts',
                ].map((feature) => (
                  <div key={feature} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4"> 
                    <p className="text-sm text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
