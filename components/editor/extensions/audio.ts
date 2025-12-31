import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AudioComponent } from './audio-component';

export interface AudioOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audio: {
      setAudio: (options: { src: string }) => ReturnType;
    };
  }
}

export const Audio = Node.create<AudioOptions>({
  name: 'audio',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'audio-component',
      },
      // Keep compatibility with standard audio tag for parsing if needed,
      // but strictly we want our component.
      // If we paste HTML with <audio src="...">, we might want to capture it.
      {
        tag: 'audio',
        getAttrs: node => ({
          src: (node as HTMLElement).getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // We render a custom tag that we can parse back, but for output logic valid HTML might be better?
    // NodeView rendering handles the editor view.
    // This renderHTML is for what gets saved to DB (getHTML()).
    // If we want it to be viewable outside React, we should probably output standard <audio> tag?
    // But then parseHTML needs to pick it up.
    // Let's output standard audio tag so it works without the React component viewer if needed.
    return ['audio', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ReactNodeViewRenderer(AudioComponent as any);
  },

  addCommands() {
    return {
      setAudio:
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
