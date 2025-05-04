import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Group, User } from '@/types';
import { useToast } from '@/hooks';
import { getFullName } from '@/lib/users';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { removeStudentFromGroup } from '@/lib/serverCalls';

interface GroupDetailStudentsProps {
  searchQuery: string;
  students: User[];
  setStudents: Dispatch<SetStateAction<User[]>>;
  group: Group;
}

const GroupDetailStudents = ({ students, searchQuery, setStudents, group }: GroupDetailStudentsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRemoveStudent = useCallback(
    (studentId: number) => {
      removeStudentFromGroup(group.id, studentId)
        .then(() => {
          toast({
            title: 'სტუდენტი წაშლილია',
          });
          setStudents((prevStudents) => prevStudents.filter((student) => student.id !== studentId));
        })
        .catch(() => {
          toast({
            title: 'სტუდენტის წაშლის შეცდომა',
            description: 'გთხოვთ, სცადოთ თავიდან.',
            variant: 'danger',
          });
        });
    },
    [group.id, setStudents, toast],
  );

  const handleViewStudentDashboard = useCallback(
    (studentId: number) => {
      navigate(`/student-dashboard/${studentId}`);
    },
    [navigate],
  );

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          getFullName(student).toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [students, searchQuery],
  );

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>სახელი და გვარი</TableHead>
              <TableHead>ელფოსტა</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewStudentDashboard(student.id)}
                >
                  <TableCell className="font-medium">{getFullName(student)}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        handleRemoveStudent(student.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {searchQuery
                    ? 'ამ მონაცემების სტუდენტი არ არსებობს ჯგუფში.'
                    : 'ჯგუფში არ არიან სტუდენტები დამატებული.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GroupDetailStudents;
