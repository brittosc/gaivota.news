import { NodeViewWrapper } from '@tiptap/react';
import { CustomAudioPlayer } from '@/components/ui/custom-audio-player';

interface AudioComponentProps {
  node: {
    attrs: {
      src: string;
      textAlign?: string;
    };
  };
  selected: boolean;
  extension: unknown;
}

export function AudioComponent({ node, selected }: AudioComponentProps) {
  const src = node.attrs.src;

  if (!src) {
    return (
      <NodeViewWrapper className="audio-component border-muted text-muted-foreground flex h-16 items-center justify-center rounded-md border-2 border-dashed p-4">
        No Audio Source
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      className="audio-component my-4"
      style={{ textAlign: node.attrs.textAlign as React.CSSProperties['textAlign'] }}
    >
      <div
        className={`inline-block transition-all duration-200 ${selected ? 'ring-offset-background rounded-xl ring-2 ring-emerald-500 ring-offset-2' : ''}`}
        style={{ width: 'fit-content', maxWidth: '100%' }}
      >
        <CustomAudioPlayer src={src} />
      </div>
    </NodeViewWrapper>
  );
}
