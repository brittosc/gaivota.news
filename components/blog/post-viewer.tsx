'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { Indent } from '@/components/editor/extensions/indent';
import { Audio } from '@/components/editor/extensions/audio';
import { Video } from '@/components/editor/extensions/video';
import { FontSize } from '@/components/editor/extensions/font-size';
import { ImageGallery } from '@/components/editor/extensions/image-gallery';
import { LetterSpacing } from '@/components/editor/extensions/letter-spacing';
import { FileAttachment } from '@/components/editor/extensions/file-attachment';

interface PostViewerProps {
  content: string;
}

export function PostViewer({ content }: PostViewerProps) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ['heading', 'paragraph', 'image', 'audio', 'video'] }),
      Link.configure({ openOnClick: true }),
      Image,
      Youtube,
      Indent,
      Audio,
      Video,
      FontSize,
      ImageGallery,
      LetterSpacing,
      FileAttachment,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-100 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full bg-transparent">
      <EditorContent editor={editor} />
    </div>
  );
}
