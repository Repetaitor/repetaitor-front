import { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, FileText, MessageCircle, Save, XCircle } from 'lucide-react';
import { useEvaluate, useToast } from '@/hooks';
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import { Slider } from '@/components/ui/slider.tsx';
import { getFullName } from '@/lib/users.utils';
import { EvaluationComment, EvaluationCommentStatus, EvaluationTextComment, NavigationRoute } from '@/types';
import { evaluateAssignment } from '@/lib/serverCalls';
import MyImageViewer from '@/components/ui/image';

const Evaluation = () => {
  const { userId, assignmentId } = useParams<{ userId: string; assignmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentSubmission, assignmentEvaluation, isEvaluateInfoLoading } = useEvaluate(
    Number(userId),
    Number(assignmentId),
  );

  const [selectedText, setSelectedText] = useState<{ text: string; start: number; end: number } | null>(null);
  const [newComment, setNewComment] = useState('');
  const [feedbackItems, setFeedbackItems] = useState<EvaluationTextComment[]>([]);

  const [newGeneralComment, setNewGeneralComment] = useState('');
  const [generalComments, setGeneralComments] = useState<EvaluationComment[]>([]);

  const [grammarScore, setGrammarScore] = useState<number>(0);
  const [fluencyScore, setFluencyScore] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().length === 0) {
      setSelectedText(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const selected = selection.toString();

    const container = paragraphRef.current;
    if (!container || !container.contains(range.startContainer) || !container.contains(range.endContainer)) {
      setSelectedText(null);
      return;
    }

    const getOffset = (node: Node, offset: number): number => {
      let charCount = 0;

      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
      while (walker.nextNode()) {
        const currentNode = walker.currentNode;
        if (currentNode === node) {
          return charCount + offset;
        }
        charCount += currentNode.textContent?.length || 0;
      }
      return -1;
    };

    const start = getOffset(range.startContainer, range.startOffset);
    const end = getOffset(range.endContainer, range.endOffset);

    setSelectedText({
      text: selected,
      start: Math.min(start, end),
      end: Math.max(start, end),
    });
  }, []);

  const addFeedbackItem = useCallback(
    (statusId: EvaluationCommentStatus) => {
      if (!selectedText || !newComment.trim()) return;

      const newFeedbackItem: EvaluationTextComment = {
        statusId,
        comment: newComment,
        startIndex: selectedText.start,
        endIndex: selectedText.end,
      };

      setFeedbackItems((prevItems) => [...prevItems, newFeedbackItem]);
      setNewComment('');
      setSelectedText(null);

      toast({
        title: 'კომენტარი წარმატებით დაემატა',
      });
    },
    [newComment, selectedText, toast],
  );

  const addGeneralComment = useCallback(
    (statusId: EvaluationCommentStatus) => {
      if (!newGeneralComment.trim()) return;

      setGeneralComments((prevGeneralComments) => [
        ...prevGeneralComments,
        {
          statusId,
          comment: newGeneralComment,
        },
      ]);
      setNewGeneralComment('');

      toast({
        title: 'კომენტარი წარმატებით დაემატა',
      });
    },
    [newGeneralComment, toast],
  );

  const submitEvaluation = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await evaluateAssignment(
        Number(userId),
        Number(assignmentId),
        fluencyScore,
        grammarScore,
        feedbackItems,
        generalComments,
      );

      toast({
        title: 'შეფასება გაიგზავნა',
        description: 'შეფასება მიუვა სტუდენტს და ნახავს თქვენ კომენტარებს.',
      });
      navigate(NavigationRoute.DASHBOARD);
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast({
        title: 'მოხდა შეცდომა',
        description: 'შეცდომა მოხდა, სცადეთ თავიდან.',
        variant: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [assignmentId, feedbackItems, fluencyScore, generalComments, grammarScore, navigate, toast, userId]);

  if (!assignmentEvaluation || !currentSubmission) {
    return (
      <DashboardLayout isPageLoading={isEvaluateInfoLoading}>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-medium">ნამუშევარი ვერ მოიძებნა</h3>
            <p className="mt-2 text-muted-foreground">
              ნამუშევარი რომლის შესწორებასაც ცდილობთ, ვერ მოიძებნა. ან არ გაქვთ შეფასების უფლება.
            </p>
            <Button className="mt-6" onClick={() => navigate(NavigationRoute.DASHBOARD)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              უკან დაბრუნება
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPageLoading={isEvaluateInfoLoading}>
      <div className="mx-auto max-w-7xl">
        <Button variant="outline" size="sm" className="mb-6" onClick={() => navigate(NavigationRoute.DASHBOARD)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          უკან დაბრუნება
        </Button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Essay content */}
          <div className="lg:col-span-2">
            <Card className="glass border-muted/30">
              <CardHeader className="border-b border-muted/30 pb-3">
                <div>
                  <CardTitle>{currentSubmission.assignment.essay.essayTitle}</CardTitle>
                  <CardDescription className="mt-1">
                    ნაშრომის ავტორია: {getFullName(currentSubmission.student)}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <p ref={paragraphRef} className="leading-7 selection:bg-primary/30" onMouseUp={handleTextSelection}>
                  {assignmentEvaluation.text}
                </p>
              </CardContent>
              <CardFooter className="justify-between border-t border-muted/30 py-4">
                <Badge variant="outline" className="mr-2">
                  {assignmentEvaluation.wordCount} სიტყვა
                </Badge>
              </CardFooter>
            </Card>
            {assignmentEvaluation.images.length > 0 ?
              (<Card className="glass border-muted/30 mt-6">
                <CardHeader>
                  <CardTitle>მიმაგრებული ფოტოები</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
                  <div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
                      {assignmentEvaluation.images.map((img, index) => (
                        <MyImageViewer key={index} index={index} img={img} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>)
              : (<></>)
            }
          </div>

          {/* Evaluation sidebar */}
          <div className="space-y-4">
            <Card className="glass border-muted/30">
              <CardHeader>
                <CardTitle>შეფასების სისტემა</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedText ? (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">მონიშნული ტექსტი:</h3>
                    <div className="rounded border border-muted/30 bg-muted/40 p-2 text-sm">"{selectedText.text}"</div>

                    <h3 className="mt-4 text-sm font-medium">დაამატე კომენტარი:</h3>
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="დაწერე კომენტარი მონიშნული ტექსტისთვის..."
                      className="min-h-24"
                    />

                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => addFeedbackItem(EvaluationCommentStatus.Strength)}
                        variant="default"
                      >
                        <CheckCircle className="h-4 w-4" />
                        მშვენიერია
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => addFeedbackItem(EvaluationCommentStatus.Suggestion)}
                        variant="default"
                      >
                        <MessageCircle className="h-4 w-4" />
                        რჩევა
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-red-500 hover:bg-red-600"
                        onClick={() => addFeedbackItem(EvaluationCommentStatus.Improvement)}
                        variant="default"
                      >
                        <XCircle className="h-4 w-4" />
                        არასწორია
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <MessageCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">დაამატე კომენტარი</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      მონიშნე ნამუშევრის სასურველი ადგილი და დაამატე კომენტარი.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-muted/30">
              <CardHeader>
                <CardTitle>ზოგადი კომენტარები</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={newGeneralComment}
                  onChange={(e) => setNewGeneralComment(e.target.value)}
                  placeholder="დაამატე ზოგადი კომენტარი ნამუშევარზე..."
                  className="min-h-24"
                />

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => addGeneralComment(EvaluationCommentStatus.Strength)}
                    variant="default"
                  >
                    <CheckCircle className="h-4 w-4" />
                    მშვენიერია
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => addGeneralComment(EvaluationCommentStatus.Suggestion)}
                    variant="default"
                  >
                    <MessageCircle className="h-4 w-4" />
                    რჩევა
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-red-500 hover:bg-red-600"
                    onClick={() => addGeneralComment(EvaluationCommentStatus.Improvement)}
                    variant="default"
                  >
                    <XCircle className="h-4 w-4" />
                    არასწორია
                  </Button>
                </div>

                <div className="space-y-2 pt-4">
                  {generalComments.length > 0 ? (
                    generalComments.map((comment, index) => (
                      <div key={index} className="flex items-start gap-2 rounded-md bg-muted/30 p-3 text-sm">
                        {comment.statusId === EvaluationCommentStatus.Strength ? (
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        ) : (
                          <>
                            {comment.statusId === EvaluationCommentStatus.Suggestion ? (
                              <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                            ) : (
                              <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                            )}
                          </>
                        )}
                        <p>{comment.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text-center text-sm text-muted-foreground">არ გაქვს კომენტარი დამატებული.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-muted/30">
              <CardHeader>
                <CardTitle>საბოლოო ქულები</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">გრამატიკა (0-8)</h3>
                    <span className="font-medium">{grammarScore}</span>
                  </div>
                  <Slider
                    value={[grammarScore]}
                    max={8}
                    step={1}
                    onValueChange={(value) => setGrammarScore(value[0])}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">ანალიზი (0-8)</h3>
                    <span className="font-medium">{fluencyScore}</span>
                  </div>
                  <Slider
                    value={[fluencyScore]}
                    max={8}
                    step={1}
                    onValueChange={(value) => setFluencyScore(value[0])}
                  />
                </div>

                <div className="border-t border-muted/30 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">ჯამური ქულა:</h3>
                    <span className="text-xl font-bold">{grammarScore + fluencyScore}/16</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-muted/30 pt-4">
                <Button onClick={submitEvaluation} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'იგზავნება...' : 'შეფასება'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Evaluation;
