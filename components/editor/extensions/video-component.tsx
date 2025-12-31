import { NodeViewWrapper } from '@tiptap/react';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';

interface VideoComponentProps {
  node: {
    attrs: {
      src: string;
      textAlign?: string;
    };
  };
  selected: boolean;
}

export function VideoComponent({ node, selected }: VideoComponentProps) {
  const src = node.attrs.src;
  const textAlign = node.attrs.textAlign;

  if (!src) {
    return (
      <NodeViewWrapper className="video-component border-muted text-muted-foreground flex h-48 items-center justify-center rounded-md border-2 border-dashed p-4">
        No Video Source
      </NodeViewWrapper>
    );
  }

  // Determine flex justification based on text-align
  let justifyClass = 'justify-center'; // default or center
  if (textAlign === 'left') justifyClass = 'justify-start';
  if (textAlign === 'right') justifyClass = 'justify-end';

  return (
    <NodeViewWrapper
      className={`video-component my-4 flex w-full ${justifyClass} transition-all duration-200`}
    >
      <div
        className={`relative w-full max-w-2xl ${selected ? 'ring-primary rounded-sm ring-2 ring-offset-2' : ''}`}
      >
        <CustomVideoPlayer src={src} />
      </div>
    </NodeViewWrapper>
  );
}
