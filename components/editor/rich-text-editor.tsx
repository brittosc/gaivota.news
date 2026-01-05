'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
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
import Placeholder from '@tiptap/extension-placeholder';
import { Indent } from './extensions/indent';
import { Audio } from './extensions/audio';
import { Video } from './extensions/video';
import { FontSize } from './extensions/font-size';
import { FileAttachment } from './extensions/file-attachment';
import { ImageGallery } from './extensions/image-gallery';
import { LetterSpacing } from './extensions/letter-spacing';
import { EditorToolbar } from './editor-toolbar';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TextStyle } from '@tiptap/extension-text-style';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
  const t = useTranslations('Components.Editor');
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
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
      Link.configure({ openOnClick: false }),
      Image,
      Youtube,
      Placeholder.configure({ placeholder: 'Write something amazing...' }),
      Indent,
      Audio,
      Video,
      FontSize,
      ImageGallery,
      FileAttachment,
      LetterSpacing,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      // Basic autosave to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('post-draft-content', editor.getHTML());
      }
    },
    editable: editable,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-100 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic',
      },
    },
  });

  // Restore draft on mount if content is empty (optional feature, but good for autosave)
  useEffect(() => {
    if (content === '<p></p>' || content === '') {
      const saved = localStorage.getItem('post-draft-content');
      if (saved && editor) {
        // editor.commands.setContent(saved); // Optional: Discuss with user if they want auto-restore.
        // For now, I'll just save it.
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-background relative w-full overflow-hidden rounded-md border">
      {editable && (
        <div className="absolute top-2 right-2 z-10">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-muted bg-background/50 h-8 w-8 border backdrop-blur-sm"
                  onClick={() => {
                    const newState = !isPreview;
                    setIsPreview(newState);
                    editor.setEditable(!newState);
                  }}
                >
                  {isPreview ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isPreview ? t('edit') : t('preview')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {editable && !isPreview && <EditorToolbar editor={editor} />}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
