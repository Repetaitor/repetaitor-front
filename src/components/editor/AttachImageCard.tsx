import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ImageViewer from '@/components/ui/image-viewer';
import { Input } from '@/components/ui/input.tsx';
import { useToast } from '@/hooks';
import { toBase64 } from '@/lib/base64';
import { getTextFromImages } from '@/lib/serverCalls';
import { AlignJustify } from 'lucide-react';
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

interface AttachImageCardProps {
  base64Images: string[];
  setBase64Images: Dispatch<SetStateAction<string[]>>;
  setEssayContent: Dispatch<SetStateAction<string>>;
  countWords: (text: string) => void;
}

const AttachImageCard = ({ base64Images, setBase64Images, setEssayContent, countWords }: AttachImageCardProps) => {
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingTextDialogOpen, setIsGeneratingTextDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const base64s = await Promise.all(files.map(async (file) => await toBase64(file)));
      setBase64Images((prevState) => [...prevState, ...base64s]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [setBase64Images],
  );

  const handleRemoveImage = useCallback(
    (img: string) => {
      setBase64Images((prevState) => prevState.filter((base64Image) => base64Image !== img));
    },
    [setBase64Images],
  );

  const handleImagesToText = useCallback(async () => {
    try {
      setIsGeneratingText(true);
      const text = await getTextFromImages(base64Images);
      setEssayContent(text);
      countWords(text);
    } catch (error) {
      console.error('Error submitting essay:', error);
      toast({
        title: 'მოხდა შეცდომა',
        description: 'ოპერაცია ვერ შესრულდა, გთხოვთ სცადოთ თავიდან.',
        variant: 'danger',
      });
    } finally {
      setIsGeneratingText(false);
      setIsGeneratingTextDialogOpen(false);
    }
  }, [base64Images, countWords, setEssayContent, toast]);

  return (
    <Card className="glass border-muted/30">
      <CardHeader>
        <CardTitle>ფოტოები</CardTitle>
        <CardDescription>ატვირთე ესეს ფოტოები სწორი მიმდევრობით აქ</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
        <div>
          <Input ref={inputRef} type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div className="mt-5 flex flex-wrap gap-2.5">
            {base64Images.map((img) => (
              <ImageViewer key={img} img={img} onRemove={handleRemoveImage} />
            ))}
          </div>
        </div>
        {base64Images.length > 0 && (
          <div className="flex justify-between">
            <Dialog open={isGeneratingTextDialogOpen} onOpenChange={setIsGeneratingTextDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-white">
                  <AlignJustify className="mr-2 h-4 w-4" />
                  ტექსტის დაგენერირება
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>გსურთ ტექსტის ავტომატურად ჩასმა?</DialogTitle>
                </DialogHeader>
                <DialogDescription>არსებული ტექსტი ჩანაცვლდება სურათის ტექსტით.</DialogDescription>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsGeneratingTextDialogOpen(false)}
                    disabled={isGeneratingText}
                  >
                    გაუქმება
                  </Button>
                  <Button onClick={handleImagesToText} disabled={isGeneratingText}>
                    {isGeneratingText ? 'მუშავდება...' : 'ჩასმა'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttachImageCard;
