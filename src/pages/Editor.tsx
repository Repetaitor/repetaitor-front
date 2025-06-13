import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import AttachImageCard from '@/components/editor/AttachImageCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks';
import { isAssignmentByAI } from '@/lib/assignments.utils';
import { getAssignmentBaseInfoById, getUserAssignment, saveOrSubmitAssignment } from '@/lib/serverCalls';
import { useAuthContext } from '@/store';
import { Assignment, NavigationRoute } from '@/types';
import { Progress } from '@radix-ui/react-progress';
import { AlertCircle, ArrowLeft, FileText, Save, Send } from 'lucide-react';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeUser } = useAuthContext();

  const [assignment, setAssignment] = useState<Assignment>();
  const [isAssignmentLoading, setIsAssignmentLoading] = useState(true);
  const [essayContent, setEssayContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const isAIAssignment = useMemo(() => assignment && isAssignmentByAI(assignment), [assignment]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchAssignments = async () => {
      if (!activeUser) return;
      setIsAssignmentLoading(true);
      try {
        const fetchedAssignment = await getAssignmentBaseInfoById(Number(id));
        const userAssignment = await getUserAssignment(activeUser.id, Number(id));
        if (!isSubscribed) return;
        setAssignment(fetchedAssignment);
        if (userAssignment && userAssignment.text) {
          setEssayContent(userAssignment.text);
          setWordCount(userAssignment.wordCount);
          const base64Images = await Promise.all(
            userAssignment.images.map(async (imageUrl) => {
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  resolve(reader.result as string);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            }),
          );
          setBase64Images(base64Images as string[]);
        }
      } catch (error) {
        console.error('Error fetching assignment:', error);
      } finally {
        setIsAssignmentLoading(false);
      }
    };

    fetchAssignments();

    return () => {
      isSubscribed = false;
    };
  }, [activeUser, id]);

  const countWords = useCallback((text: string) => {
    const words = text.trim().split(/\s+/);
    setWordCount(text.trim() ? words.length : 0);
  }, []);

  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setEssayContent(newText);
      countWords(newText);
    },
    [countWords],
  );

  const handleSubmit = useCallback(
    async (isSubmitted = false) => {
      try {
        setIsSubmitting(true);
        await saveOrSubmitAssignment(Number(id), essayContent, wordCount, isSubmitted, base64Images);

        if (isSubmitted) {
          toast({
            title: 'მონაცემები გაიგზავნა',
            description: 'მასწავლებელმა მიიღო ნამუშევარი გასასწორებლად.',
          });
          navigate(isAIAssignment ? NavigationRoute.AI_ASSIGNMENTS : NavigationRoute.ASSIGNMENTS);
        } else {
          toast({
            title: 'ნამუშევარი შენახულია',
            description: 'ნამუშევარი შენახულია, შეგიძლია მომავალში დაბრუნდე მის გასაგრძელებლად.',
          });
        }
      } catch (error) {
        console.error('Error submitting essay:', error);
        toast({
          title: 'მოხდა შეცდომა',
          description: 'ოპერაცია ვერ შესრულდა, გთხოვთ სცადოთ თავიდან.',
          variant: 'danger',
        });
      } finally {
        setIsSubmitting(false);
        setIsSubmitDialogOpen(false);
      }
    },
    [essayContent, id, isAIAssignment, navigate, toast, wordCount, base64Images],
  );

  return (
    <DashboardLayout isPageLoading={isAssignmentLoading}>
      {assignment ? (
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              უკან დაბრუნება
            </Button>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left sidebar with assignment details */}
            <div className="w-full space-y-4 lg:w-1/3">
              <Card className="glass border-muted/30">
                <CardHeader>
                  <CardTitle>{assignment.essay.essayTitle}</CardTitle>
                  <CardDescription>
                    ჩაბარების თარიღი: {new Date(assignment.dueDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
                  <div>
                    <span>აღწერა:</span>
                    <p>{assignment.essay.essayDescription}</p>
                  </div>
                  <div>
                    <span>ინსტრუქციები:</span>
                    <p>{assignment.instructions}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">პროგრესი</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between">
                        <span className="text-sm font-medium">სიტყვების რაოდენობა</span>
                        <span className="text-sm text-muted-foreground">
                          {wordCount} / {assignment.essay.expectedWordCount}
                        </span>
                      </div>
                      <Progress value={(wordCount / assignment.essay.expectedWordCount) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <AttachImageCard
                base64Images={base64Images}
                setBase64Images={setBase64Images}
                setEssayContent={setEssayContent}
                countWords={countWords}
              />
            </div>

            {/* Main editor area */}
            <div className="w-full lg:w-2/3">
              <Card className="glass flex h-full flex-col border-muted/30">
                <CardHeader className="border-b border-muted/30">
                  <CardTitle>{assignment.essay.essayTitle}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <Textarea
                    className="h-[calc(100vh-350px)] min-h-[400px] resize-none rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="დაიწყე ესეს დაწერა..."
                    value={essayContent}
                    onChange={handleTextChange}
                  />
                </CardContent>
                <CardFooter className="justify-between border-t border-muted/30">
                  <div className="text-sm text-muted-foreground">
                    <span
                      className={wordCount < assignment.essay.expectedWordCount ? 'text-yellow-500' : 'text-green-500'}
                    >
                      {wordCount}
                    </span>{' '}
                    / {assignment.essay.expectedWordCount} სიტყვა
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleSubmit(false)}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'ინახება ნამუშევარი...' : 'შეინახე ნამუშევარი'}
                    </Button>
                    <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Send className="mr-2 h-4 w-4" />
                          გაუგზავნე მასწავლებელს
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>ნამდვილად გსურთ გაგზავნა?</DialogTitle>
                          <DialogDescription>გაგზავნილი ნამუშევრის დაბრუნება ან შეცვლა შეუძლებელია.</DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                          {wordCount < assignment.essay.expectedWordCount && (
                            <Alert variant="danger" className="mb-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>სიტყვების რაოდენობის გაფრთხილება</AlertTitle>
                              <AlertDescription>
                                თქვენი ესე {assignment.essay.expectedWordCount - wordCount} სიტყვით მოკლეა ვიდრე
                                რეკომენდირებულია.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                            დაბრუნება
                          </Button>
                          <Button onClick={() => handleSubmit(true)} disabled={isSubmitting}>
                            {isSubmitting ? 'იგზავნება...' : 'გაგზავნა'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-medium">დავალება ვერ მოიძებნა</h3>
            <p className="mt-2 text-muted-foreground">დავალებას რომელსაც ეძებ არ არსებობს, ან არ გაქვს მასზე წვდომა.</p>
            <Button className="mt-6" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              უკან დაბრუნება
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
export default Editor;
