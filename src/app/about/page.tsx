import Link from "next/link";
import TopBar from "@/components/TopBar";
import PageShell from "@/components/PageShell";

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-6 lg:pb-12">
      <TopBar title="About" />

      <PageShell narrow className="space-y-5 pt-16 lg:pt-24">
        <section className="surface-card rounded-2xl p-5 lg:p-8">
          <p className="text-[11px] lg:text-xs font-bold uppercase tracking-[0.2em] label-accent">
            AURAGAZE
          </p>
          <h1 className="mt-2 font-heading text-3xl lg:text-5xl font-black tracking-tight">
            Dress With Intention
          </h1>
          <p className="mt-4 text-sm lg:text-base leading-7 text-muted">
            AURAGAZE is a destination for oversized tees, graphic drops, and everyday
            streetwear essentials — built for phone and desktop. We focus on premium cotton,
            relaxed fits, and limited runs you can actually wear.
          </p>
        </section>

        <section className="surface-card rounded-2xl p-5 lg:p-8">
          <h2 className="font-bold lg:text-xl">What we stand for</h2>
          <ul className="mt-3 space-y-2 text-sm lg:text-base text-muted-strong">
            <li>Oversized silhouettes built for comfort and statement.</li>
            <li>Curated graphics, basics, and full-sleeve drops.</li>
            <li>Transparent sizing, live stock, and secure online checkout.</li>
          </ul>
        </section>

        <Link href="/shop" className="btn-gradient flex h-12 lg:h-14 items-center justify-center rounded-2xl text-sm lg:text-base font-bold">
          Shop the collection
        </Link>
      </PageShell>
    </div>
  );
}
