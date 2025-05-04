import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Edit, FileText, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useAuthContext, useEssaysContext } from '@/store';
import { Essay, UserRole } from '@/types';
import { useToast } from '@/hooks';
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import AddNewEssay from '@/components/essays/AddNewEssay.tsx';

const Essays = () => {
  const { activeUser } = useAuthContext();
  const { essays, essaysLoading, removeEssay } = useEssaysContext();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [openNewEssayDialog, setOpenNewEssayDialog] = useState(false);
  const [editingEssay, setEditingEssay] = useState<Essay | null>(null);
  const [isDeletingEssay, setIsDeletingEssay] = useState<Record<number, boolean>>({});

  const handleDeleteEssay = useCallback(
    async (essayId: number) => {
      setIsDeletingEssay((prevState) => ({ ...prevState, [essayId]: true }));
      try {
        await removeEssay(essayId);

        toast({
          title: 'ესე წაიშალა',
          description: 'ესეს წაშლა წარმატებით დასრულდა.',
        });
      } catch (error) {
        console.error('Error deleting essay:', error);
        toast({
          title: 'მოხდა შეცდომა',
          description: 'ესეს წაშლისას დაფიქსირდა შეცდომა, სცადეთ თავიდან.',
          variant: 'danger',
        });
      } finally {
        setIsDeletingEssay((prevState) => ({ ...prevState, [essayId]: false }));
      }
    },
    [removeEssay, toast],
  );

  const handleEditEssay = useCallback((essay: Essay) => {
    setEditingEssay(essay);
    setOpenNewEssayDialog(true);
  }, []);

  const filteredEssays = useMemo(
    () =>
      essays.filter(
        (essay) =>
          essay.essayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (essay.essayDescription && essay.essayDescription.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [essays, searchQuery],
  );

  if (activeUser?.role !== UserRole.TEACHER) {
    return (
      <DashboardLayout>
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold">წვდომა შეუძლებელია</h1>
          <p>ამ გვერდის ნახვა შეუძლიათ მხოლოდ მასწავლებლებს.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPageLoading={essaysLoading}>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ესეების ბიბლიოთეკა</h1>
            <p className="text-muted-foreground">
              შეგიძლია შექმნა ესეები, რომელსაც შემდეგ გამოიყენებ დავალებების შექმნისას
            </p>
          </div>

          <AddNewEssay
            editingEssay={editingEssay}
            setEditingEssay={setEditingEssay}
            openNewEssayDialog={openNewEssayDialog}
            setOpenNewEssayDialog={setOpenNewEssayDialog}
          />
        </div>

        <div className="mb-6 flex items-center">
          <div className="relative max-w-lg flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="მოძებნე ესე სათაურით ან აღწერით..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {essays.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">ესე არ არის შექმნილი</h3>
              <p className="mb-6 mt-1 max-w-md text-center text-muted-foreground">
                დაამატე შენი პირველი ესე და დაიწყე დავალებების შექმნა სტუდენტებისთვის.
              </p>
              <Button onClick={() => setOpenNewEssayDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                შექმენი პირველი ესე
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredEssays.length > 0 ? (
              filteredEssays.map((essay) => (
                <Card key={essay.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-medium">{essay.essayTitle}</h3>
                        </div>
                        {essay.essayDescription && (
                          <p className="mt-2 text-muted-foreground">{essay.essayDescription}</p>
                        )}

                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <FileText className="mr-1 h-4 w-4" />
                            {essay.expectedWordCount} words
                          </div>
                          <div>შეიქმნა: {new Date(essay.createDate).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 md:flex-col">
                        <Button variant="outline" size="sm" onClick={() => handleEditEssay(essay)}>
                          <Edit className="mr-2 h-4 w-4" />
                          ჩასწორება
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteEssay(essay.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isDeletingEssay[essay.id] ? 'იშლება' : 'წაშლა'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">ვერ მოიძებნა ესეები</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Essays;
