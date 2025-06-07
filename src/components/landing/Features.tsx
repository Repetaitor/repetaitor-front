import { BookOpen, Edit3, MessageSquare, BarChart4, Users, ClipboardCheck, Lightbulb, Clock } from 'lucide-react';

const featuresList = [
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: 'დავალებების მენეჯმენტი',
    description: 'შექმენით სავარჯიშოები თქვენი სტუდენტებისთვის მარტივი ინსტრუქციით.',
  },
  {
    icon: <Edit3 className="h-10 w-10 text-primary" />,
    title: 'მარტივი დიზაინის ედიტორი',
    description: 'სტუდენტების ინტერესებზე შექმნილი ედიტორი, რომელიც ტექსტის წერას მარტივს და ეფექტურს ხდის.',
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: 'მარტივი უკუკავშირი',
    description: 'ტექსტის კონკრეტულ მონაკვეთზე კომენტარის დატოვება მარტივად.',
  },
  {
    icon: <BarChart4 className="h-10 w-10 text-primary" />,
    title: 'შედეგების ანალიზი',
    description: 'სტუდენტის პროგრესზე დაკვირვება მისი შედეგების მიხედვით.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'ჯგუფის მართვა',
    description: 'მარტივი ორგანიზება ახალი დავალებისა და საერთო სავარჯიშოების ჯგუფისთვის.',
  },
  {
    icon: <ClipboardCheck className="h-10 w-10 text-primary" />,
    title: '16 ქულიანი შეფასების სისტება',
    description: 'გრამატიკის და ანალიზის შეფასება 8-8 ქულად.',
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary" />,
    title: 'AI-ს ანალიზი',
    description: 'მოსწავლეების შედეგების ანალიზის საფუძველზე რჩევები სასწავლო პროცესის გასაუმჯობესებლად.',
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: 'დროის დაზოგვა',
    description: 'მაღალი ხარისხის, მარტივი ფუნქციონალი დროის დაზოგვის მიზნით.',
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-gradient-to-b from-background to-card px-6 py-20">
      <div className="container mx-auto">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 animate-fade-in text-3xl font-bold sm:text-4xl">ძლიერი ხელსაწყო განათლებისთვის</h2>
          <p className="animate-fade-in text-lg text-muted-foreground" style={{ animationDelay: '0.2s' }}>
            შექმნილია მასწავლებლებისა და სტუდენტების გათვალისწინებით, RepetAitor გთავაზობთ ყოვლისმომცველ კომპლექტს
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="glass animate-fade-in rounded-xl p-6 transition-all duration-300 hover:shadow-xl"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
