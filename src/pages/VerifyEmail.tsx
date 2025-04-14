import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { verifyAuthCode } from '@/lib/serverCalls';

const formSchema = z.object({
  code: z.string().length(6, { message: 'კოდი უნდა შეიცავდეს 6 სიმბოლოს' }),
});

type FormValues = z.infer<typeof formSchema>;

const VerifyEmail = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, guid } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isValidString = (val: unknown) => typeof val === 'string' && val.trim() !== '';

    if (!isValidString(email) || !isValidString(guid)) {
      navigate('/register');
    }
  }, [email, guid, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleVerify = useCallback(
    async (values: FormValues) => {
      setIsSubmitting(true);

      try {
        const { verified } = await verifyAuthCode(guid, email, values.code);
        if (verified) {
          toast({
            title: 'წარმატებით გაიარეთ მეილის ვერიფიკაცია',
            description: 'თქვენი ანგარიში გააქტიურებულია.',
          });

          navigate('/login');
        } else {
          throw new Error('Invalid verification code');
        }
      } catch {
        toast({
          title: 'ვერიფიკაცია ვერ მოხერხდა',
          description: 'გთხოვთ კიდევ ერთხელ შეამოწმოთ კოდი და სცადოთ თავიდან.',
          variant: 'danger',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, guid, navigate, toast],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-3xl font-bold text-transparent"
          >
            RepetAItor
          </Link>
          <p className="mt-2 text-muted-foreground">გაიარეთ ვერიფიკაცია საიტზე შესასვლელად</p>
        </div>

        <Card className="glass border-muted/30">
          <CardHeader className="space-y-1">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-center text-xl">ელფოსტის ვერიფიკაცია</CardTitle>
            <CardDescription className="text-center">
              ჩვენ გამოვგზავნეთ კოდი ელფოსტაზე: <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleVerify)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ვერიფიკაციის კოდი</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="mt-2 w-full" type="submit" disabled={isSubmitting || !form.formState.isValid}>
                  {isSubmitting ? 'მიმდინარეობს ვერიფიკაცია...' : 'გაიარე ვერიფიკაცია'}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="w-full text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">
                შესვლის გვერძე დაბრუნება
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
