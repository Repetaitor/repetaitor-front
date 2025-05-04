import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useCallback, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks';
import { useEssaysContext } from '@/store';

interface AddAssignmentButtonProps {
  addAssignment: (essayId: number, dueDate: Date, instructions?: string) => Promise<void>;
}

const assignmentFormSchema = z.object({
  essayId: z.string({ required_error: 'აირჩიეთ ესე' }),
  instructions: z.string().optional(),
  dueDate: z.date({ required_error: 'აირჩიეთ ჩაბარების თარიღი' }).refine((date) => date > new Date(), {
    message: 'ჩაბარების თარიღი უნდა იყოს მომავალი',
  }),
});

const AddAssignmentButton = ({ addAssignment }: AddAssignmentButtonProps) => {
  const { toast } = useToast();
  const { essays } = useEssaysContext();

  const [openNewAssignmentDialog, setOpenNewAssignmentDialog] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);

  const form = useForm<z.infer<typeof assignmentFormSchema>>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      instructions: '',
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof assignmentFormSchema>) => {
      setIsCreatingAssignment(true);
      try {
        await addAssignment(Number(values.essayId), values.dueDate, values.instructions);

        toast({
          title: 'დავალება შექმნილია',
          description: `ჯგუფისთვის ახალი დავალება წარმატებით შეიქმნა.`,
        });

        setOpenNewAssignmentDialog(false);
        form.reset();
      } catch (error) {
        console.error('Error creating assignment:', error);
        toast({
          title: 'დავალება ვერ შეიქმნა',
          description: 'დავალების შექმნისას მოხდა შეცდომა. გთხოვთ, სცადოთ კიდევ ერთხელ.',
          variant: 'danger',
        });
      } finally {
        setIsCreatingAssignment(false);
      }
    },
    [addAssignment, form, setOpenNewAssignmentDialog, toast],
  );

  return (
    <Dialog open={openNewAssignmentDialog} onOpenChange={setOpenNewAssignmentDialog}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          ახალი დავალება
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>შექმენი ახალი დავალება</DialogTitle>
          <DialogDescription>დაამატე ახალი დავალება მოსწავლეთა ჯგუფისთვის</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="essayId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ესე *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="აირჩიე ესე" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {essays.length > 0 ? (
                        essays.map((essay) => (
                          <SelectItem key={essay.id} value={String(essay.id)}>
                            {essay.essayTitle}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="py-2 text-center text-muted-foreground">ესეები მიუწვდომელია</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>ჩაბარების თარიღი *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>აირჩიე თარიღი</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="pointer-events-auto w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ინსტრუქციები</FormLabel>
                  <FormControl>
                    <Textarea placeholder="მიეცით სტუდენტებს კონკრეტული ინსტრუქციები" className="min-h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isCreatingAssignment}>
                {isCreatingAssignment ? 'იქმნება დავალება...' : 'შექმენი დავალება'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentButton;
