import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ImageViewerProps {
  img: string;
  onRemove?: (img: string) => void;
}

const ImageViewer = ({ img, onRemove }: ImageViewerProps) => {
  return (
    <div className="relative">
      <Dialog>
        <DialogTrigger asChild>
          <img
            src={img}
            alt={`img-${img}`}
            className="size-32 cursor-pointer rounded-lg object-cover shadow-md transition-all duration-300 hover:scale-105"
          />
        </DialogTrigger>

        <DialogContent
          showCloseBtn={false}
          className="h-fit max-h-full w-fit max-w-full overflow-hidden rounded-lg border-0 p-0"
        >
          <img src={img} alt={`img-${img}`} className="max-h-[90vh] max-w-[90vw]" />
        </DialogContent>
      </Dialog>
      {onRemove && (
        <button
          onClick={() => onRemove(img)}
          className="absolute -right-2 -top-2 rounded-full bg-danger p-1 text-foreground hover:bg-danger/90"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ImageViewer;
