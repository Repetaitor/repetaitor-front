import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const ImageViewer = ({ index, img }: { index: number; img: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          key={index}
          src={img}
          alt={`img-${index}`}
          className="size-32 cursor-pointer rounded-lg object-cover shadow-md transition-all duration-300 hover:scale-105"
        />
      </DialogTrigger>

      <DialogContent
        showCloseBtn={false}
        className="h-fit max-h-full w-fit max-w-full overflow-hidden rounded-lg border-0 p-0"
      >
        <img key={index} src={img} alt={`img-${index}`} className="max-h-[90vh] max-w-[90vw]" />
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
