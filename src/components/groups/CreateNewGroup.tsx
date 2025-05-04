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
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGroupsContext } from '@/store';
import { useCallback, useState } from 'react';
import { useToast } from '@/hooks';

const groupFormSchema = z.object({
  name: z.string().min(3, { message: 'ჯგუფის სახელი უნდა შედგებოდეს მინიმუმ  3 ასოსგან.' }),
});

interface CreateNewGroupProps {
  openNewGroupDialog: boolean;
  setOpenNewGroupDialog: (open: boolean) => void;
}

const CreateNewGroup = ({ openNewGroupDialog, setOpenNewGroupDialog }: CreateNewGroupProps) => {
  const { createNewGroup } = useGroupsContext();
  const { toast } = useToast();

  const [isGroupCreating, setIsGroupCreating] = useState(false);

  const form = useForm<z.infer<typeof groupFormSchema>>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof groupFormSchema>) => {
      setIsGroupCreating(true);
      try {
        const groupName = values.name.trim();
        await createNewGroup(groupName);

        toast({
          title: 'ჯგუფი შეიქმნა',
          description: `${values.name} ჯგუფი წარმატებით შეიქმნა.`,
        });

        setOpenNewGroupDialog(false);
        form.reset();
      } catch (error) {
        console.error('Error creating group:', error);
        toast({
          title: 'ჯგუფის შექმნის შეცდომა',
          description: 'გთხოვთ, სცადოთ თავიდან.',
          variant: 'danger',
        });
      } finally {
        setIsGroupCreating(false);
      }
    },
    [createNewGroup, form, setOpenNewGroupDialog, toast],
  );

  return (
    <Dialog open={openNewGroupDialog} onOpenChange={setOpenNewGroupDialog}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          ახალი ჯგუფი
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>შექმენი ახალი ჯგუფი</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ჯგუფის სახელი</FormLabel>
                  <FormControl>
                    <Input placeholder="შეიყვანე ჯგუფის სახელი..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isGroupCreating}>
                {isGroupCreating ? 'იქმნება ჯგუფი...' : 'შექმენი ჯგუფი'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewGroup;
