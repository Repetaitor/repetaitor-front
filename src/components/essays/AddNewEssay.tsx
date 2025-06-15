import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { PlusCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import * as z from 'zod';
import { useEssaysContext } from '@/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Essay } from '@/types';
import { useToast } from '@/hooks';

const essayFormSchema = z.object({
  essayTitle: z.string().min(5, { message: 'სათაური უნდა იყოს მინიმუმ 5 სიმბოლოიანი' }),
  essayDescription: z.string().min(10, { message: 'აღწერა უნდა იყოს მინიმუმ 10 სიმბოლოიანი' }),
  expectedWordCount: z.coerce.number().min(50, { message: 'სიტყვების რაოდენობა უნდა იყოს მინიმუმ 50' }),
});

type EssayFormValues = z.infer<typeof essayFormSchema>;

interface AddNewEssayProps {
  editingEssay: Essay | null;
  setEditingEssay: Dispatch<SetStateAction<Essay | null>>;
  openNewEssayDialog: boolean;
  setOpenNewEssayDialog: Dispatch<SetStateAction<boolean>>;
}

const AddNewEssay = ({
  editingEssay,
  setEditingEssay,
  openNewEssayDialog,
  setOpenNewEssayDialog,
}: AddNewEssayProps) => {
  const { createNewEssay, editEssay } = useEssaysContext();
  const { toast } = useToast();

  const [isUpdatingEssay, setIsUpdatingEssay] = useState(false);

  const form = useForm<EssayFormValues>({
    resolver: zodResolver(essayFormSchema),
    defaultValues: {
      essayTitle: editingEssay?.essayTitle || '',
      essayDescription: editingEssay?.essayDescription || '',
      expectedWordCount: editingEssay?.expectedWordCount || 150,
    },
  });

  useEffect(() => {
    if (editingEssay) {
      form.reset({
        essayTitle: editingEssay.essayTitle,
        essayDescription: editingEssay.essayDescription,
        expectedWordCount: editingEssay.expectedWordCount,
      });
    } else {
      form.reset({
        essayTitle: '',
        essayDescription: '',
        expectedWordCount: 150,
      });
    }
  }, [editingEssay, form]);

  const onSubmit = useCallback(
    async (values: EssayFormValues) => {
      setIsUpdatingEssay(true);
      try {
        if (editingEssay) {
          await editEssay(editingEssay.id, values.essayTitle, values.essayDescription, values.expectedWordCount);

          toast({
            title: 'ესე განახლდა',
            description: `ესე წარმატებით განახლდა.`,
          });
        } else {
          await createNewEssay(values.essayTitle, values.essayDescription, values.expectedWordCount);

          toast({
            title: 'ესე შეიქმნა',
            description: `ახალი ესე წარმატებით შეიქმნა.`,
          });
        }

        setOpenNewEssayDialog(false);
        setEditingEssay(null);
        form.reset();
      } catch (e) {
        console.log('Error creating/updating essay:', e);
        toast({
          title: 'დაფიქსირდა შეცდომა',
          description: 'გთხოვთ, სცადეთ კიდევ ერთხელ.',
          variant: 'danger',
        });
      } finally {
        setIsUpdatingEssay(false);
      }
    },
    [editingEssay, setOpenNewEssayDialog, setEditingEssay, form, editEssay, toast, createNewEssay],
  );

  return (
    <Dialog
      open={openNewEssayDialog}
      onOpenChange={(open) => {
        setOpenNewEssayDialog(open);
        if (!open) setEditingEssay(null);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          ახალი ესე
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingEssay ? 'ჩაასწორე ესე' : 'შექმენი ახალი ესე'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="essayTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ესეს სათაური</FormLabel>
                  <FormControl>
                    <Input placeholder="შეიყვანე ესეს სათაური..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="essayDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>აღწერა</FormLabel>
                  <FormControl>
                    <Textarea placeholder="შეიყვანე მოკლედ ესეს აღწერა..." className="min-h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedWordCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>მოსალოდნელი სიტყვების რაოდენობა</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isUpdatingEssay}>
                {editingEssay
                  ? isUpdatingEssay
                    ? 'ნახლდება ესე...'
                    : 'განაახლე ესე'
                  : isUpdatingEssay
                    ? 'იქმნება ესე...'
                    : 'შექმენი ესე'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewEssay;
