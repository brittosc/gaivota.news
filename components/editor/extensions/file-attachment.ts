import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FileAttachmentComponent } from './file-attachment-component';

export interface FileAttachmentOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fileAttachment: {
      setFileAttachment: (options: {
        href: string;
        fileName: string;
        fileSize?: string;
      }) => ReturnType;
    };
  }
}

export const FileAttachment = Node.create<FileAttachmentOptions>({
  name: 'fileAttachment',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      href: {
        default: null,
      },
      fileName: {
        default: 'Arquivo',
      },
      fileSize: {
        default: null,
      },
      fileType: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'file-attachment',
      },
      {
        tag: 'a[data-type="file-attachment"]',
        getAttrs: node => {
          const element = node as HTMLElement;
          return {
            href: element.getAttribute('href'),
            fileName: element.dataset.filename || element.innerText,
            fileSize: element.dataset.filesize,
            fileType: element.dataset.filetype,
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    // Render as a special anchor so it degrades gracefully outside React
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'file-attachment',
        'data-filename': node.attrs.fileName,
        'data-filesize': node.attrs.fileSize,
        'data-filetype': node.attrs.fileType,
        target: '_blank',
      }),
      node.attrs.fileName,
    ];
  },

  addNodeView() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ReactNodeViewRenderer(FileAttachmentComponent as any);
  },

  addCommands() {
    return {
      setFileAttachment:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
