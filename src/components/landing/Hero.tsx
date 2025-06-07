import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const Hero = () => {
  return (
    <section className="overflow-hidden px-6 pb-20 pt-32">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="max-w-2xl flex-1 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
            <div
              className="mb-6 inline-flex animate-fade-in items-center rounded-full border border-muted px-3 py-1 text-sm"
              style={{ animationDelay: '0.3s' }}
            >
              <span className="mr-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                სიახლე
              </span>
              <span className="text-muted-foreground">შეცვალეთ თქვენი ესეების შეფასების პროცესი</span>
            </div>

            <h1 className="leading-100000 mb-6 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold sm:text-5xl lg:text-6xl">
              გარდაქმენით თქვენი ესეების შეფასების პროცესი
            </h1>

            <p
              className="mb-8 max-w-xl animate-fade-in text-lg text-muted-foreground"
              style={{ animationDelay: '0.5s' }}
            >
              RepetAitor არის პლატფორმა, რომელიც შექმნილია ესეების შეფასების გასამარტივებლად, რაც პროცესს უფრო ეფექტურს
              და თანმიმდევრულს ხდის განათლების სფეროში მომუშავეთათვის.
            </p>

            <div className="mb-8 animate-fade-in space-y-4" style={{ animationDelay: '0.7s' }}>
              {['16 ქულიანი შეფასების სისტემა', 'შეფასების პროცესში დაზოგილი დრო', 'მაღალი ხარისხის შეფასებები'].map(
                (feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </div>
                ),
              )}
            </div>

            <div className="flex animate-fade-in flex-col gap-4 sm:flex-row" style={{ animationDelay: '0.9s' }}>
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  დაწყება
                </Button>
              </Link>
              <Link to="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => scrollToSection('how-it-works')}
                >
                  გაიგე როგორ მუშაობს
                </Button>
              </Link>
            </div>
          </div>

          <div
            className="order-first w-full max-w-xl flex-1 animate-slide-in-right lg:order-last"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 animate-pulse-slow rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-70 blur-xl"></div>
              <div className="glass relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                <div className="border-b border-white/10 bg-card p-4">
                  <div className="flex items-center">
                    <div className="flex space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-xs text-muted-foreground">ესეს შეფასების მაგალითები</div>
                  </div>
                </div>
                <div className="bg-card p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">დეტალური ანალიზი</h3>
                      <p className="text-sm text-muted-foreground">სტუდენტი: ჯონ დო</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">შეფასება: 14/16</div>
                      <div className="text-xs text-muted-foreground">ანალიზი: 7/8 • გრამატიკა: 7/8</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-md border border-white/5 bg-secondary/30 p-3">
                      <p className="text-sm">
                        The author effectively uses imagery to convey the protagonist's emotional state throughout the
                        narrative...
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <p className="text-xs text-muted-foreground">ლოგიკური ანალიზი დადასტურებული მტკიცებულებებით</p>
                      </div>
                    </div>

                    <div className="rounded-md border border-white/5 bg-secondary/30 p-3">
                      <p className="text-sm">
                        The theme of isolation is explored through both setting and characterization, demonstrating
                        how...
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <p className="text-xs text-muted-foreground">არ არის კავშირი არგუმენტირებულად ნაჩვენები</p>
                      </div>
                    </div>

                    <div className="rounded-md border border-white/5 bg-secondary/30 p-3">
                      <p className="text-sm">
                        In conclusion, the novel's exploration of identity through multiple perspectives reveals...
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <p className="text-xs text-muted-foreground">
                          მისაღები დასკვნა, რომელიც აერთიანებს ძირითად მოსაზრებებს
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
