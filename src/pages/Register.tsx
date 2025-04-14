import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { NavigationRoute, UserRole } from '@/types';
import { registerUser } from '@/lib/serverCalls';

const formSchema = z
  .object({
    firstName: z.string().min(2, { message: 'სახელი უნდა შეიცავდეს მინიმუმ ორ სიმბოლოს' }),
    lastName: z.string().min(2, { message: 'გვარი უნდა შეიცავდეს მინიმუმ ორ სიმბოლოს' }),
    email: z.string().email({ message: 'შეიყვანე ვალიდური ელფოსტა' }),
    password: z.string().min(6, { message: 'პაროლი უნდა შეიიცავდეს მინიმუმ 6 სიმბოლოს' }),
    confirmPassword: z.string().min(6, { message: 'გაიმეორე პაროლი' }),
    role: z.enum([UserRole.STUDENT, UserRole.TEACHER], { message: 'აირჩიე შენი როლი' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'პაროლი არ ემთხვევა',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.STUDENT,
    },
  });

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setIsLoading(true);

      try {
        const { guid } = await registerUser({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          role: values.role,
        });
        console.log(guid);
        navigate(NavigationRoute.VERIFY_EMAIL, { state: { email: values.email, guid } });
        toast({
          title: 'თქვენ წარმატებით დარეგისტრირდით',
          description: 'კეთილი იყოს თქვენი მობრძანება.',
        });
      } catch {
        toast({
          title: 'რეგისტრაცია ვერ მოხერხდა',
          description: 'გთხოით სცადეთ თავიდან.',
          variant: 'danger',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to={NavigationRoute.LANDING}
            className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-3xl font-bold text-transparent"
          >
            RepetAItor
          </Link>
        </div>

        <Card className="glass border-muted/30">
          <CardHeader>
            <CardTitle>რეგისტრაცია</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>სახელი</FormLabel>
                      <FormControl>
                        <Input placeholder="გიორგი" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>გვარი</FormLabel>
                      <FormControl>
                        <Input placeholder="ნიკოლეიშვილი" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>გაიმეორე პაროლი</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>აირჩიე როლი</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={UserRole.STUDENT} />
                            </FormControl>
                            <FormLabel className="cursor-pointer">სტუდენტი</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={UserRole.TEACHER} />
                            </FormControl>
                            <FormLabel className="cursor-pointer">მასწავლებელი</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'იქმნება ანგარიში...' : 'რეგისტრაცია'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm">
              უკვე გაქვს ანგარიში?{' '}
              <Link to={NavigationRoute.LOGIN} className="text-primary hover:underline">
                შესვლა
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
