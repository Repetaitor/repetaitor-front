import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import ImagesListCard from '@/components/reusable/ImagesListCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { useToast } from '@/hooks';
import { isAssignmentByAI } from '@/lib/assignments.utils';
import { changeUserAssignmentPublicStatus, getAssignmentBaseInfoById, getUserAssignment } from '@/lib/serverCalls';
import { useAuthContext } from '@/store';
import { Assignment, AssignmentEvaluation, EvaluationCommentStatus, NavigationRoute, UserRole } from '@/types';
import { ArrowLeft, CheckCircle, FileText, MessageCircle, Share, Users, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Feedback = () => {
  const { assignmentId, userId } = useParams<{ assignmentId: string; userId: string }>();

  const { toast } = useToast();

  const navigate = useNavigate();
  const { activeUser } = useAuthContext();

  const [userAssignment, setUserAssignment] = useState<AssignmentEvaluation>();
  const [assignmentInfo, setAssignmentInfo] = useState<Assignment>();
  const [isLoadingInformation, setIsLoadingInformation] = useState(true);

  const [isMakingPublicInProgress, setIsMakingPublicInProgress] = useState(false);

  const isAIAssignment = useMemo(() => assignmentInfo && isAssignmentByAI(assignmentInfo), [assignmentInfo]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchAssignment = async () => {
      if (!activeUser) return;
      setIsLoadingInformation(true);
      try {
        const userIdToFetch = userId ? Number(userId) : activeUser.id;
        const fetchedAssignmentEvaluation = await getUserAssignment(userIdToFetch, Number(assignmentId));
        const fetchedAssignmentInfo = await getAssignmentBaseInfoById(Number(assignmentId));
        if (!isSubscribed) return;
        if (!fetchedAssignmentEvaluation.isPublic && activeUser?.id !== fetchedAssignmentEvaluation.userId) return;
        setUserAssignment(fetchedAssignmentEvaluation);
        setAssignmentInfo(fetchedAssignmentInfo);
      } catch (error) {
        console.error('Error fetching assignment:', error);
      } finally {
        if (isSubscribed) {
          setIsLoadingInformation(false);
        }
      }
    };

    fetchAssignment();
    return () => {
      isSubscribed = false;
    };
  }, [activeUser, assignmentId, userId]);

  const togglePublicStatus = useCallback(async () => {
    if (isMakingPublicInProgress) return;
    setIsMakingPublicInProgress(true);
    try {
      const isPublic = await changeUserAssignmentPublicStatus(Number(assignmentId));
      if (isPublic) {
        toast({
          title: 'ნამუშევარი წარმატებით გახდა საჯარო.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'ნამუშევარის საჯარო მონახულების შეცდომა.',
          variant: 'danger',
        });
      }
      setUserAssignment((prevAssignment) =>
        prevAssignment ? { ...prevAssignment, isPublic: !prevAssignment.isPublic } : undefined,
      );
    } catch (error) {
      console.error('Error changing public status:', error);
      toast({
        title: 'ნამუშევარის გასაჯაროებისას მოხდა შეცდომა.',
        variant: 'danger',
      });
    } finally {
      setIsMakingPublicInProgress(false);
    }
  }, [assignmentId, isMakingPublicInProgress, toast]);

  const textContentWithComments = useMemo(() => {
    let lastIndex = 0;
    const elements = [];
    if (!userAssignment) return null;

    userAssignment.evaluationComments
      .sort((a, b) => a.startIndex - b.startIndex)
      .forEach((comment, index) => {
        if (comment.startIndex > lastIndex) {
          elements.push(
            <span key={`${index}-text-${lastIndex}`}>
              {userAssignment.text.substring(lastIndex, comment.startIndex)}
            </span>,
          );
        }
        // Add the highlighted text
        elements.push(
          <TooltipProvider key={`${index}-highlight-${comment.startIndex}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={`cursor-help rounded px-0.5 ${
                    comment.statusId === EvaluationCommentStatus.Strength
                      ? 'bg-green-500/20 text-green-500'
                      : comment.statusId === EvaluationCommentStatus.Suggestion
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  {userAssignment.text.substring(comment.startIndex, comment.endIndex)}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <p className="font-medium">მასწავლებლის კომენტარი</p>
                </div>
                <p>{comment.comment}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>,
        );

        lastIndex = comment.endIndex;
      });

    if (lastIndex < userAssignment.text.length) {
      elements.push(<span key={`last-text-end`}>{userAssignment.text.substring(lastIndex)}</span>);
    }

    return <p className="leading-7">{elements}</p>;
  }, [userAssignment]);

  if (!userAssignment || !assignmentInfo) {
    return (
      <DashboardLayout isPageLoading={isLoadingInformation}>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-medium">ესე ვერ მოიძებნა</h3>
            <p className="mt-2 text-muted-foreground">ინფორმაცია ამ ნამუშევარზე ვერ მოიძებნა.</p>
            <Button className="mt-6" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              უკან დაბრუნება
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPageLoading={isLoadingInformation}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            უკან დაბრუნება
          </Button>
          {activeUser?.role === UserRole.STUDENT && isAIAssignment && userAssignment.userId === activeUser.id && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={togglePublicStatus} disabled={isMakingPublicInProgress}>
                <Share className="mr-2 h-4 w-4" />
                {userAssignment.isPublic ? 'გახადე მალული' : 'გახადე საჯარო'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`${NavigationRoute.PUBLIC_SUBMISSIONS}/${assignmentId}`)}
              >
                <Users className="mr-2 h-4 w-4" />
                სხვა მოხმარებლების ნამუშევარები
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Essay with feedback highlights */}
          <div className="w-full lg:w-2/3">
            <Card className="glass border-muted/30">
              <CardHeader className="border-b border-muted/30 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{assignmentInfo.essay.essayTitle}</CardTitle>
                  </div>
                  {userAssignment.isEvaluated && (
                    <Badge className="ml-2 border-0 bg-green-500 text-white">
                      {userAssignment.fluencyScore + userAssignment.grammarScore}/16
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">{textContentWithComments}</CardContent>
            </Card>
            <ImagesListCard images={userAssignment.images} />
          </div>

          {/* Sidebar with feedback summary */}
          {userAssignment.isEvaluated ? (
            <div className="w-full space-y-4 lg:w-1/3">
              <Card className="glass border-muted/30">
                <CardHeader>
                  <CardTitle>შედეგები</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-green-500">{userAssignment.grammarScore}</div>
                        <div className="mt-1 text-sm text-muted-foreground">გრამატიკა</div>
                        <div className="text-xs text-muted-foreground">8 ქულიდან</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-green-500">{userAssignment.fluencyScore}</div>
                        <div className="mt-1 text-sm text-muted-foreground">ანალიზი</div>
                        <div className="text-xs text-muted-foreground">8 ქულიდან</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-3xl font-bold text-green-500">
                          {userAssignment.fluencyScore + userAssignment.grammarScore}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">ჯამში</div>
                        <div className="text-xs text-muted-foreground">16 ქულიდან</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-sm font-medium">სიტყვების რაოდენობა:</h3>
                      <p className="text-sm">{userAssignment.wordCount} სიტყვა</p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">ლეგენდა</h3>
                      <div className="flex items-center">
                        <span className="mr-2 h-3 w-3 rounded-full bg-green-500"></span>
                        <span className="text-sm">მშვენიერია</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></span>
                        <span className="text-sm">რჩევა</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 h-3 w-3 rounded-full bg-red-500"></span>
                        <span className="text-sm">არასწორია</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-muted/30">
                <CardHeader>
                  <CardTitle>მასწავლებლის კომენტარები</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 flex items-center text-sm font-medium text-green-500">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      მშვენიერია
                    </h3>
                    <div className="space-y-3">
                      {userAssignment.generalComments
                        .filter((comment) => comment.statusId === EvaluationCommentStatus.Strength)
                        .map((comment, index) => (
                          <div key={index} className="rounded-md bg-muted/30 p-3 text-sm">
                            {comment.comment}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 flex items-center text-sm font-medium text-yellow-500">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      რჩევა
                    </h3>
                    <div className="space-y-3">
                      {userAssignment.generalComments
                        .filter((comment) => comment.statusId === EvaluationCommentStatus.Suggestion)
                        .map((comment, index) => (
                          <div key={index} className="rounded-md bg-muted/30 p-3 text-sm">
                            {comment.comment}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 flex items-center text-sm font-medium text-red-500">
                      <XCircle className="mr-2 h-4 w-4" />
                      არასწორია
                    </h3>
                    <div className="space-y-3">
                      {userAssignment.generalComments
                        .filter((comment) => comment.statusId === EvaluationCommentStatus.Improvement)
                        .map((comment, index) => (
                          <div key={index} className="rounded-md bg-muted/30 p-3 text-sm">
                            {comment.comment}
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="glass border-muted/30">
              <CardHeader>
                <CardTitle>შეფასება</CardTitle>
              </CardHeader>
              <CardContent>ამჟამად მასწავლებელს არ აქვს შესწორებული ნამუშევარი.</CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
