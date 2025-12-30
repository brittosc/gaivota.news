import { Extension } from '@tiptap/core';

export interface IndentOptions {
  types: string[];
  indentLevels: number[];
  defaultIndentLevel: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      /**
       * Set the indent attribute
       */
      indent: () => ReturnType;
      /**
       * Unset the indent attribute
       */
      outdent: () => ReturnType;
    };
  }
}

export const Indent = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      indentLevels: [0, 30, 60, 90, 120], // Indentation steps in pixels
      defaultIndentLevel: 0,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndentLevel,
            parseHTML: element => {
              const marginLeft = element.style.marginLeft;
              return parseInt(marginLeft) || this.options.defaultIndentLevel;
            },
            renderHTML: attributes => {
              if (attributes.indent === this.options.defaultIndentLevel) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.indent}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state }) => {
          const { selection } = state;
          const { from, to } = selection;
          let applicable = false;

          tr.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              applicable = true;
              const currentIndent = node.attrs.indent || 0;
              const currentIndex = this.options.indentLevels.indexOf(currentIndent);

              let nextIndent = this.options.indentLevels[this.options.indentLevels.length - 1]; // Max
              if (currentIndex < this.options.indentLevels.length - 1) {
                nextIndent = this.options.indentLevels[currentIndex + 1];
              }

              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: nextIndent,
              });
            }
          });

          return applicable;
        },
      outdent:
        () =>
        ({ tr, state }) => {
          const { selection } = state;
          const { from, to } = selection;
          let applicable = false;

          tr.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              applicable = true;
              const currentIndent = node.attrs.indent || 0;
              const currentIndex = this.options.indentLevels.indexOf(currentIndent);

              let prevIndent = 0;
              if (currentIndex > 0) {
                prevIndent = this.options.indentLevels[currentIndex - 1];
              }

              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: prevIndent,
              });
            }
          });

          return applicable;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      'Shift-Tab': () => this.editor.commands.outdent(),
    };
  },
});
