import { NodeViewWrapper } from '@tiptap/react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ImageGalleryComponentProps {
  node: {
    attrs: {
      images: string[];
    };
  };
}

export function ImageGalleryComponent({ node }: ImageGalleryComponentProps) {
  const images = node.attrs.images || [];

  if (images.length === 0) {
    return (
      <NodeViewWrapper className="image-gallery border-muted text-muted-foreground flex h-32 items-center justify-center rounded-md border-2 border-dashed p-4">
        Empty Gallery
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="image-gallery my-4">
      <Carousel className="mx-auto w-full max-w-xl">
        <CarouselContent>
          {images.map((src: string, index: number) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                {/* 
                  Using a standard img tag here because next/image requires width/height or fill. 
                  If using fill, parent needs relative. 
                  Also, for editor, standard img might be safer, but let's try standard img first for simplicity in editor.
                  Actually, user wants "wow" factor, so maybe next/image is better if configured right.
                  But we don't know dimensions. 'fill' with 'object-cover' is good.
                */}
                <Image
                  src={src}
                  alt={`Gallery Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </NodeViewWrapper>
  );
}
