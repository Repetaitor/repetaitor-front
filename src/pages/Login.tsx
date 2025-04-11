import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  email: z.string().email({ message: 'შეიყვანე ვალიდური ელფოსტა' }),
  password: z.string().min(6, { message: 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს' }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsLoading(true);

      try {
        toast({
          title: 'წარმატებით შეხვედით',
          description: 'კეთილი იყოს თქვენი დაბრუნება!',
        });
      } catch {
        toast({
          title: 'შესვლა ვერ მოხერხდა',
          description: 'ელფოსტა ან პაროლი არასწორია, სცადეთ თავიდან!',
          variant: 'danger',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-3xl font-bold text-transparent"
          >
            RepetAItor
          </Link>
        </div>

        <Card className="glass border-muted/30">
          <CardHeader>
            <CardTitle>შესვლა</CardTitle>
            <CardDescription>შეიყვანეთ თქვენი ავტორიზაციის მონაცემები</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ელფოსტა</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>პაროლი</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'მიმდინარეობს შესვლა' : 'შესვლა'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="w-full text-center text-sm">
              არ გაქვს ანგარიში?{' '}
              <Link to="/register" className="text-primary hover:underline">
                დარეგისტრირდი
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
