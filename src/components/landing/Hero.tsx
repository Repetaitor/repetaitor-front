import { useCallback, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  const animationDelays = useMemo(
    () => ({
      leftSlide: '0.1s',
      badge: '0.3s',
      rightSlide: '0.3s',
      description: '0.5s',
      features: '0.7s',
      buttons: '0.9s',
    }),
    [],
  );

  const animations = useMemo(
    () => ({
      slideInLeft: {
        animation: 'slideInLeft 0.7s ease-out forwards',
      },
      slideInRight: {
        animation: 'slideInRight 0.7s ease-out forwards',
      },
      fadeIn: {
        animation: 'fadeIn 0.5s ease-out forwards',
      },
      slideInUp: {
        animation: 'slideInUp 0.3s ease-out forwards',
      },
    }),
    [],
  );

  const features = useMemo(
    () => ['16 ქულიანი შეფასების სისტემა', 'შეფასების პროცესში დაზოგილი დრო', 'მაღალი ხარისხის შეფასებები'],
    [],
  );

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  useEffect(() => {
    const styleId = 'hero-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      },
    );

    const elementsToObserve = heroRef.current?.querySelectorAll('[data-animate]');
    elementsToObserve?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="overflow-hidden px-6 pb-20 pt-32">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div
            className="max-w-2xl flex-1 translate-x-[-50px] opacity-0 transition-all duration-700 ease-out"
            style={{
              animationDelay: animationDelays.leftSlide,
              ...animations.slideInLeft,
            }}
          >
            <div
              className="mb-6 inline-flex items-center rounded-full border border-muted px-3 py-1 text-sm opacity-0 transition-opacity duration-500"
              style={{
                animationDelay: animationDelays.badge,
                ...animations.fadeIn,
              }}
            >
              <span className="mr-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                სიახლე
              </span>
              <span className="text-muted-foreground">შეცვალეთ თქვენი ესეების შეფასების პროცესი</span>
            </div>

            <h1 className="mb-6 text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold leading-snug sm:text-5xl sm:leading-snug lg:text-6xl lg:leading-snug">
              გარდაქმენით თქვენი ესეების შეფასების პროცესი
            </h1>

            <p
              className="mb-8 max-w-xl text-lg text-muted-foreground opacity-0 transition-opacity duration-500"
              style={{
                animationDelay: animationDelays.description,
                ...animations.fadeIn,
              }}
            >
              RepetAitor არის პლატფორმა, რომელიც შექმნილია ესეების შეფასების გასამარტივებლად, რაც პროცესს უფრო ეფექტურს
              და თანმიმდევრულს ხდის განათლების სფეროში მომუშავეთათვის.
            </p>

            <div
              className="mb-8 space-y-4 opacity-0 transition-opacity duration-500"
              style={{
                animationDelay: animationDelays.features,
                ...animations.fadeIn,
              }}
            >
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex translate-y-2 items-start gap-2 opacity-0 transition-all duration-300"
                  style={{
                    animationDelay: `${0.7 + index * 0.1}s`,
                    ...animations.slideInUp,
                  }}
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div
              className="flex flex-col gap-4 opacity-0 transition-opacity duration-500 sm:flex-row"
              style={{
                animationDelay: animationDelays.buttons,
                ...animations.fadeIn,
              }}
            >
              <Link to="/register">
                <Button
                  size="lg"
                  className="w-full transform transition-transform duration-200 hover:scale-105 sm:w-auto"
                >
                  დაწყება
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full transform transition-transform duration-200 hover:scale-105 sm:w-auto"
                onClick={() => scrollToSection('how-it-works')}
              >
                გაიგე როგორ მუშაობს
              </Button>
            </div>
          </div>

          <div
            className="order-first w-full max-w-xl flex-1 translate-x-[50px] opacity-0 transition-all duration-700 ease-out lg:order-last"
            style={{
              animationDelay: animationDelays.rightSlide,
              ...animations.slideInRight,
            }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 animate-pulse rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-70 blur-xl"></div>
              <div className="glass relative overflow-hidden rounded-xl border border-white/10 bg-card/30 shadow-2xl backdrop-blur-sm">
                <div className="border-b border-white/10 bg-card/50 p-4">
                  <div className="flex items-center">
                    <div className="flex space-x-2">
                      <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
                      <div
                        className="h-3 w-3 animate-pulse rounded-full bg-yellow-500"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="h-3 w-3 animate-pulse rounded-full bg-green-500"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                    <div className="mx-auto text-xs text-muted-foreground">ესეს შეფასების მაგალითები</div>
                  </div>
                </div>
                <div className="bg-card/50 p-6">
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
                    {[
                      {
                        text: "The author effectively uses imagery to convey the protagonist's emotional state throughout the narrative...",
                        status: 'green',
                        feedback: 'ლოგიკური ანალიზი დადასტურებული მტკიცებულებებით',
                      },
                      {
                        text: 'The theme of isolation is explored through both setting and characterization, demonstrating how...',
                        status: 'yellow',
                        feedback: 'არ არის კავშირი არგუმენტირებულად ნაჩვენები',
                      },
                      {
                        text: "In conclusion, the novel's exploration of identity through multiple perspectives reveals...",
                        status: 'primary',
                        feedback: 'მისაღები დასკვნა, რომელიც აერთიანებს ძირითად მოსაზრებებს',
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="rounded-md border border-white/5 bg-secondary/30 p-3 transition-colors duration-200 hover:bg-secondary/40"
                      >
                        <p className="text-sm">{item.text}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              item.status === 'green'
                                ? 'bg-green-500'
                                : item.status === 'yellow'
                                  ? 'bg-yellow-500'
                                  : 'bg-primary'
                            }`}
                          ></div>
                          <p className="text-xs text-muted-foreground">{item.feedback}</p>
                        </div>
                      </div>
                    ))}
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
