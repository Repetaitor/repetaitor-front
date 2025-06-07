import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';

const Lending = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />

        {/* How It Works Section */}
        <section id="how-it-works" className="px-6 py-20">
          <div className="container mx-auto">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-4 animate-fade-in text-3xl font-bold sm:text-4xl">როგორ მუშაობს RepetAitor</h2>
              <p className="animate-fade-in text-lg text-muted-foreground" style={{ animationDelay: '0.2s' }}>
                გამარტივებული პროცესი როგორც სტუდენტებისთვის, ისე მასწავლებლებისთვის, წერითი და შეფასების გამოცდილების
                გასაუმჯობესებლად.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'დავალების შექმნა',
                  description: 'მასწავლებლები ქმნიან დავალებებს დეტალური ინსტრუქციებითა და შეფასების კრიტერიუმებით.',
                  delay: 0.1,
                },
                {
                  step: '2',
                  title: 'სტუდენტები წერენ ესეს',
                  description: 'სტუდენტები წერენ ტექსტს მათზე მორგებულ ედიტორში, ხელისშემშლელი ფაქტორების გარეშე.',
                  delay: 0.3,
                },
                {
                  step: '3',
                  title: 'მასწავლებლები აფასებენ',
                  description:
                    'მასწავლებლები განიხილავენ, აწვდიან უკუკავშირს და აფასებენ 16-ქულიანი შკალის გამოყენებით.',
                  delay: 0.5,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="glass relative animate-fade-in overflow-hidden rounded-xl p-8"
                  style={{ animationDelay: `${item.delay}s` }}
                >
                  <div className="absolute -left-6 -top-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <span className="relative left-6 top-6 text-4xl font-bold text-primary">{item.step}</span>
                  </div>
                  <div className="pt-10">
                    <h3 className="mb-2 text-xl font-medium">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="container mx-auto">
            <div className="glass relative overflow-hidden rounded-2xl p-12">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-50"></div>
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl"> მზად ხარ შეცვალო ესეების შეფასების პროცესი?</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                შემოგვიერთდი, დაზოგე დრო და მიიღე შეფასების მაღალი ხარისხი RepetAitor-ის დახმარებით.
              </p>
              <a
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 font-medium text-foreground transition-colors hover:bg-primary/90"
              >
                დაწყება
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Lending;
