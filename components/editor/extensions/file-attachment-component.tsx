import { NodeViewWrapper } from '@tiptap/react';
import { FileIcon, Download } from 'lucide-react';

interface FileAttachmentComponentProps {
  node: {
    attrs: {
      href: string;
      fileName: string;
      fileSize?: string;
      fileType?: string;
    };
  };
  selected: boolean;
}

export function FileAttachmentComponent({ node, selected }: FileAttachmentComponentProps) {
  const { href, fileName, fileSize } = node.attrs;

  return (
    <NodeViewWrapper
      className={`file-attachment my-4 inline-block max-w-sm rounded-lg border bg-zinc-50 p-3 transition-colors dark:bg-zinc-900 ${selected ? 'ring-primary ring-2' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 no-underline"
      >
        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded">
          <FileIcon className="text-primary h-5 w-5" />
        </div>
        <div className="flex min-w-0 flex-col overflow-hidden">
          <span className="text-foreground truncate text-sm font-medium">
            {fileName || 'Arquivo'}
          </span>
          {fileSize && <span className="text-muted-foreground text-xs">{fileSize}</span>}
        </div>
        <Download className="text-muted-foreground ml-auto h-4 w-4 opacity-50" />
      </a>
    </NodeViewWrapper>
  );
}
