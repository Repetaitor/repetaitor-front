import * as DialogP from '@/components/ui/dialog';

const MyImageViewer = ({ index, img }: { index: number; img: string }) => {
  return (
    <DialogP.Dialog>
      <DialogP.DialogTrigger asChild>
        <img
          key={index}
          src={img}
          alt={`img-${index}`}
          style={{
            width: 120,
            height: 120,
            objectFit: 'cover',
            cursor: 'pointer',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s',
          }}
        />
      </DialogP.DialogTrigger>

      <DialogP.DialogPortal>
        <DialogP.DialogOverlay
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
          }}
        />
        <DialogP.DialogContent
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            padding: 0,
            zIndex: 9999,
          }}
        >
          <img
            key={index}
            src={img}
            alt={`img-${index}`}
            style={{
              maxWidth: '95vw',
              maxHeight: '95vh',
              borderRadius: '4px',
            }}
          />
          <DialogP.DialogClose
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              fontSize: '24px',
            }}
          />
        </DialogP.DialogContent>
      </DialogP.DialogPortal>
    </DialogP.Dialog>
  );
};

export default MyImageViewer;
