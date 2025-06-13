import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import ImageViewer from '../ui/image-viewer';

interface ImagesListCardProps {
  images: string[];
}

const ImagesListCard = ({ images }: ImagesListCardProps) => {
  if (images.length === 0) return null;
  return (
    <Card className="glass mt-6 border-muted/30">
      <CardHeader>
        <CardTitle>მიმაგრებული ფოტოები</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
        <div>
          <div className="flex flex-wrap gap-4">
            {images.map((img, index) => (
              <ImageViewer key={index} index={index} img={img} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagesListCard;
