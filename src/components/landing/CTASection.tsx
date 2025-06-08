import { NavigationRoute } from '@/types';

const CTASection = () => (
  <section className="px-6 py-20">
    <div className="container mx-auto">
      <div className="glass relative overflow-hidden rounded-2xl p-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-50" />
        <div className="relative z-10">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">მზად ხარ შეცვალო ესეების შეფასების პროცესი?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            შემოგვიერთდი, დაზოგე დრო და მიიღე შეფასების მაღალი ხარისხი RepetAitor-ის დახმარებით.
          </p>
          <a
            href={NavigationRoute.REGISTER}
            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-primary px-8 font-medium text-foreground transition-colors hover:bg-primary/90"
          >
            დაწყება
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
