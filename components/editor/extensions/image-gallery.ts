import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageGalleryComponent } from './image-gallery-component';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageGallery: {
      setImageGallery: (options: { images: string[] }) => ReturnType;
    };
  }
}

export const ImageGallery = Node.create({
  name: 'imageGallery',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'image-gallery',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['image-gallery', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ReactNodeViewRenderer(ImageGalleryComponent as any);
  },

  addCommands() {
    return {
      setImageGallery:
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
