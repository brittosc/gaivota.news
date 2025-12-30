'use client';

import { type Editor } from '@tiptap/react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Undo,
  Redo,
  Superscript as SuperIcon,
  Subscript as SubIcon,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
  Minus,
  Palette,
  Indent,
  Outdent,
} from 'lucide-react';

import { useState } from 'react';
import { MediaUploadModal } from '@/components/editor/media-upload-modal';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'image' | 'youtube' | 'link'>('link');

  const openModal = (type: 'image' | 'youtube' | 'link') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalConfirm = (url: string) => {
    switch (modalType) {
      case 'image':
        editor.chain().focus().setImage({ src: url }).run();
        break;
      case 'youtube':
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
        break;
      case 'link':
        if (url === '') {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
        break;
    }
  };

  const getInitialUrl = () => {
    if (modalType === 'link' && editor.isActive('link')) {
      return editor.getAttributes('link').href;
    }
    return '';
  };

  return (
    <>
      <MediaUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        type={modalType}
        initialUrl={getInitialUrl()}
      />
      <div className="bg-muted/20 flex flex-wrap items-center gap-1 border-b p-2">
        {/* Undo/Redo */}
        <div className="flex gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="hover:bg-muted inline-flex h-8 w-8 items-center justify-center rounded-md p-0 disabled:opacity-50"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="hover:bg-muted inline-flex h-8 w-8 items-center justify-center rounded-md p-0 disabled:opacity-50"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Headings */}
        <ToggleGroup type="multiple" className="flex">
          <ToggleGroupItem
            value="h1"
            aria-label="Heading 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            data-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Heading1 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="h2"
            aria-label="Heading 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Heading2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="h3"
            aria-label="Heading 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            data-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Heading3 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Basic Formatting */}
        <ToggleGroup type="multiple" className="flex">
          <ToggleGroupItem
            value="bold"
            aria-label="Toggle bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-state={editor.isActive('bold') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            aria-label="Toggle italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-state={editor.isActive('italic') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            aria-label="Toggle underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-state={editor.isActive('underline') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="strike"
            aria-label="Toggle strikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            data-state={editor.isActive('strike') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="code"
            aria-label="Toggle code"
            onClick={() => editor.chain().focus().toggleCode().run()}
            data-state={editor.isActive('code') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Code className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="highlight"
            aria-label="Toggle highlight"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            data-state={editor.isActive('highlight') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Highlighter className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="relative mx-1 flex h-8 w-8 items-center justify-center">
          <input
            type="color"
            onInput={e =>
              editor
                .chain()
                .focus()
                .setColor((e.target as HTMLInputElement).value)
                .run()
            }
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            title="Cor do texto"
          />
          <div className="hover:bg-muted/50 flex h-8 w-8 items-center justify-center rounded-md">
            <Palette
              className="h-4 w-4"
              style={{ color: editor.getAttributes('textStyle').color }}
            />
          </div>
        </div>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Alignment */}
        <ToggleGroup type="single" className="flex">
          <ToggleGroupItem
            value="left"
            aria-label="Align left"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            data-state={editor.isActive({ textAlign: 'left' }) ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="center"
            aria-label="Align center"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            data-state={editor.isActive({ textAlign: 'center' }) ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="right"
            aria-label="Align right"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            data-state={editor.isActive({ textAlign: 'right' }) ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="justify"
            aria-label="Align justify"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            data-state={editor.isActive({ textAlign: 'justify' }) ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <AlignJustify className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Lists */}
        <ToggleGroup type="multiple" className="flex">
          <ToggleGroupItem
            value="bulletList"
            aria-label="Toggle bullet list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-state={editor.isActive('bulletList') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="orderedList"
            aria-label="Toggle ordered list"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-state={editor.isActive('orderedList') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="taskList"
            aria-label="Toggle task list"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            data-state={editor.isActive('taskList') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <CheckSquare className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="blockquote"
            aria-label="Toggle blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            data-state={editor.isActive('blockquote') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <Quote className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Insert */}
        <ToggleGroup type="multiple" className="flex">
          <ToggleGroupItem
            value="link"
            aria-label="Set link"
            onClick={() => openModal('link')}
            data-state={editor.isActive('link') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <LinkIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="image"
            aria-label="Insert image"
            onClick={() => openModal('image')}
            className="h-8 w-8 p-0"
          >
            <ImageIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="youtube"
            aria-label="Insert youtube"
            onClick={() => openModal('youtube')}
            className="h-8 w-8 p-0"
          >
            <Youtube className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="horizontalRule"
            aria-label="Insert horizontal rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Indent/Outdent */}
        <ToggleGroup type="multiple" className="flex">
          <ToggleGroupItem
            value="outdent"
            aria-label="Outdent"
            onMouseDown={e => e.preventDefault()}
            onClick={() => {
              if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
                editor.chain().focus().liftListItem('listItem').run();
              } else {
                editor.chain().focus().outdent().run();
              }
            }}
            // Only disable if NEITHER list lift NOR outdent is possible
            disabled={!editor.can().liftListItem('listItem') && !editor.can().outdent()}
            className="h-8 w-8 p-0"
          >
            <Outdent className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="indent"
            aria-label="Indent"
            onMouseDown={e => e.preventDefault()}
            onClick={() => {
              if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
                editor.chain().focus().sinkListItem('listItem').run();
              } else {
                editor.chain().focus().indent().run();
              }
            }}
            disabled={!editor.can().sinkListItem('listItem') && !editor.can().indent()}
            className="h-8 w-8 p-0"
          >
            <Indent className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Sub/Sup */}
        <ToggleGroup type="multiple" className="flex">
          <ToggleGroupItem
            value="subscript"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            data-state={editor.isActive('subscript') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <SubIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="superscript"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            data-state={editor.isActive('superscript') ? 'on' : 'off'}
            className="h-8 w-8 p-0"
          >
            <SuperIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
}
