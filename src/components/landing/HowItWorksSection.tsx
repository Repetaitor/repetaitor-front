interface Step {
  step: string;
  title: string;
  description: string;
  delay: number;
}

const HOW_IT_WORKS_STEPS: Step[] = [
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
    description: 'მასწავლებლები განიხილავენ, აწვდიან უკუკავშირს და აფასებენ 16-ქულიანი შკალის გამოყენებით.',
    delay: 0.5,
  },
];

const StepCard = ({ step, title, description, delay }: Step) => (
  <div
    className="glass relative animate-fade-in overflow-hidden rounded-xl p-8"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="absolute -left-6 -top-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
      <span className="relative left-6 top-6 text-4xl font-bold text-primary">{step}</span>
    </div>
    <div className="pt-10">
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const HowItWorksSection = () => (
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
        {HOW_IT_WORKS_STEPS.map((item) => (
          <StepCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
