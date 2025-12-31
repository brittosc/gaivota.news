import { type Editor } from '@tiptap/react';
import { useTranslations } from 'next-intl';
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
  Music,
  Images,
  Video,
  Paperclip,
} from 'lucide-react';

import { useState } from 'react';
import { MediaUploadModal } from '@/components/editor/media-upload-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const t = useTranslations('Components.Editor');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    'image' | 'youtube' | 'link' | 'audio' | 'video' | 'gallery' | 'file'
  >('link');

  const openModal = (
    type: 'image' | 'youtube' | 'link' | 'audio' | 'video' | 'gallery' | 'file'
  ) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalConfirm = (url: string | string[], options?: { target?: string }) => {
    const urls = Array.isArray(url) ? url : [url];
    if (urls.length === 0) return;

    if (modalType === 'link') {
      const currentUrl = urls[0];
      const target = options?.target || '_blank';

      if (currentUrl === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: currentUrl, target }).run();
      }
      return;
    }

    if (modalType === 'gallery') {
      editor.chain().focus().setImageGallery({ images: urls }).run();
      return;
    }

    const content = urls
      .map(currentUrl => {
        switch (modalType) {
          case 'image':
            return { type: 'image', attrs: { src: currentUrl } };
          case 'youtube':
            return { type: 'youtube', attrs: { src: currentUrl } };
          case 'audio':
            return { type: 'audio', attrs: { src: currentUrl } };
          case 'video':
            return { type: 'video', attrs: { src: currentUrl } };
          case 'file':
            const fileName = currentUrl.split('/').pop() || 'Arquivo';
            return { type: 'fileAttachment', attrs: { href: currentUrl, fileName } };
          default:
            return null;
        }
      })
      .filter(Boolean);

    if (content.length > 0) {
      editor.chain().focus().insertContent(content).run();
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="hover:bg-muted inline-flex h-8 w-8 items-center justify-center rounded-md p-0 disabled:opacity-50"
              >
                <Undo className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{t('undo')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="hover:bg-muted inline-flex h-8 w-8 items-center justify-center rounded-md p-0 disabled:opacity-50"
              >
                <Redo className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{t('redo')}</TooltipContent>
          </Tooltip>
        </div>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Font Size */}
        <Select
          onValueChange={value => editor.chain().focus().setFontSize(value).run()}
          value={(editor.getAttributes('textStyle').fontSize as string) || '16px'}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SelectTrigger className="h-8 w-20 px-2 text-xs">
                  <SelectValue placeholder={t('size')} />
                </SelectTrigger>
              </div>
            </TooltipTrigger>
            <TooltipContent>{t('fontSize')}</TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value="12px">12px</SelectItem>
            <SelectItem value="14px">14px</SelectItem>
            <SelectItem value="16px">16px</SelectItem>
            <SelectItem value="18px">18px</SelectItem>
            <SelectItem value="20px">20px</SelectItem>
            <SelectItem value="24px">24px</SelectItem>
            <SelectItem value="30px">30px</SelectItem>
          </SelectContent>
        </Select>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Letter Spacing */}
        <Select
          onValueChange={value => editor.chain().focus().setLetterSpacing(value).run()}
          value={(editor.getAttributes('textStyle').letterSpacing as string) || '0px'}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SelectTrigger className="h-8 w-20 px-2 text-xs">
                  <SelectValue placeholder={t('spacing')} />
                </SelectTrigger>
              </div>
            </TooltipTrigger>
            <TooltipContent>{t('letterSpacing')}</TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value="0px">Normal</SelectItem>
            <SelectItem value="0.5px">0.5px</SelectItem>
            <SelectItem value="1px">1px</SelectItem>
            <SelectItem value="1.5px">1.5px</SelectItem>
            <SelectItem value="2px">2px</SelectItem>
            <SelectItem value="3px">3px</SelectItem>
          </SelectContent>
        </Select>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Headings */}
        <ToggleGroup type="multiple" className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="h1"
                aria-label={t('heading1')}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                data-state={editor.isActive('heading', { level: 1 }) ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <Heading1 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('heading1')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="h2"
                aria-label={t('heading2')}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <Heading2 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('heading2')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="h3"
                aria-label={t('heading3')}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                data-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <Heading3 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('heading3')}</TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Basic Formatting */}
        <ToggleGroup type="multiple" className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="bold"
                aria-label={t('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-state={editor.isActive('bold') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('bold')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="italic"
                aria-label={t('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-state={editor.isActive('italic') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('italic')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="underline"
                aria-label={t('underline')}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                data-state={editor.isActive('underline') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('underline')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="strike"
                aria-label={t('strikethrough')}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                data-state={editor.isActive('strike') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <Strikethrough className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('strikethrough')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="code"
                aria-label={t('inlineCode')}
                onClick={() => editor.chain().focus().toggleCode().run()}
                data-state={editor.isActive('code') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <Code className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('inlineCode')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="highlight"
                aria-label={t('highlight')}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                data-state={editor.isActive('highlight') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <Highlighter className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('highlight')}</TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <Tooltip>
          <TooltipTrigger asChild>
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
              />
              <div className="hover:bg-muted/50 flex h-8 w-8 items-center justify-center rounded-md">
                <Palette
                  className="h-4 w-4"
                  style={{ color: editor.getAttributes('textStyle').color }}
                />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>{t('textColor')}</TooltipContent>
        </Tooltip>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Alignment */}
        <ToggleGroup type="single" className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="left"
                aria-label={t('alignLeft')}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                data-state={editor.isActive({ textAlign: 'left' }) ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('alignLeft')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="center"
                aria-label={t('alignCenter')}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                data-state={editor.isActive({ textAlign: 'center' }) ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <AlignCenter className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('alignCenter')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="right"
                aria-label={t('alignRight')}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                data-state={editor.isActive({ textAlign: 'right' }) ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <AlignRight className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('alignRight')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="justify"
                aria-label={t('justify')}
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                data-state={editor.isActive({ textAlign: 'justify' }) ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <AlignJustify className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('justify')}</TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Lists & Indentation */}
        <ToggleGroup type="multiple" className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="bulletList"
                aria-label={t('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-state={editor.isActive('bulletList') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('bulletList')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="orderedList"
                aria-label={t('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-state={editor.isActive('orderedList') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <ListOrdered className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('orderedList')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="outdent"
                aria-label={t('outdent')}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
                    editor.chain().focus().liftListItem('listItem').run();
                  } else {
                    editor.chain().focus().outdent().run();
                  }
                }}
                disabled={!editor.can().liftListItem('listItem') && !editor.can().outdent()}
                className="h-8 w-8 p-0"
              >
                <Outdent className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('outdent')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="indent"
                aria-label={t('indent')}
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
            </TooltipTrigger>
            <TooltipContent>{t('indent')}</TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Insert Media & Extras */}
        <ToggleGroup type="multiple" className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="link"
                aria-label={t('link')}
                onClick={() => openModal('link')}
                data-state={editor.isActive('link') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <LinkIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('link')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="image"
                aria-label={t('image')}
                onClick={() => openModal('image')}
                className="h-8 w-8 p-0"
              >
                <ImageIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('image')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="file"
                aria-label={t('file') || 'Arquivo'}
                onClick={() => openModal('file')}
                className="h-8 w-8 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('file') || 'Arquivo'}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="gallery"
                aria-label={t('gallery')}
                onClick={() => openModal('gallery')} // Uses proper gallery mode
                className="h-8 w-8 p-0"
                title="" // Removing title attr as we have Tooltip now
              >
                <Images className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('gallery')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="youtube"
                aria-label={t('youtube')}
                onClick={() => openModal('youtube')}
                className="h-8 w-8 p-0"
              >
                <Youtube className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('youtube')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="audio"
                aria-label={t('audio')}
                onClick={() => openModal('audio')}
                className="h-8 w-8 p-0"
              >
                <Music className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('audio')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="video"
                aria-label={t('video') || 'Video'}
                onClick={() => openModal('video')}
                className="h-8 w-8 p-0"
              >
                <Video className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('video') || 'Video'}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="horizontalRule"
                aria-label={t('horizontalRule')}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('horizontalRule')}</TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <div className="bg-border mx-1 h-6 w-px" />

        {/* Sub/Sup */}
        <ToggleGroup type="multiple" className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="subscript"
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                data-state={editor.isActive('subscript') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <SubIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('subscript')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="superscript"
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                data-state={editor.isActive('superscript') ? 'on' : 'off'}
                className="h-8 w-8 p-0"
              >
                <SuperIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t('superscript')}</TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </div>
    </>
  );
}
