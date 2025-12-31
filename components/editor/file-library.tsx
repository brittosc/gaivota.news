'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileIcon, Music, Film, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type FileObject = {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
};

const BUCKETS = {
  image: 'blog-images',
  gallery: 'blog-images',
  audio: 'blog-audio',
  video: 'blog-video',
  file: 'blog-files',
};

interface FileLibraryProps {
  type: 'image' | 'gallery' | 'audio' | 'video' | 'file';
  onSelect: (url: string) => void;
}

export function FileLibrary({ type, onSelect }: FileLibraryProps) {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const bucketName = BUCKETS[type] || 'blog-images';

  useEffect(() => {
    async function fetchFiles() {
      setIsLoading(true);
      const { data, error } = await supabase.storage.from(bucketName).list(undefined, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
        console.error('Error fetching files:', error);
      } else {
        setFiles(data || []);
      }
      setIsLoading(false);
    }

    fetchFiles();
  }, [bucketName, supabase.storage]);

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return data.publicUrl;
  };

  return (
    <div className="h-75 w-full rounded-md border">
      <ScrollArea className="h-full p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
            <FileIcon className="mb-2 h-10 w-10 opacity-20" />
            <p>Nenhum arquivo encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {files.map(file => {
              const url = getPublicUrl(file.name);
              return (
                <div
                  key={file.id}
                  className={cn(
                    'group hover:ring-primary relative cursor-pointer overflow-hidden rounded-md border transition-all hover:ring-2',
                    selectedFile === url ? 'ring-primary ring-2' : ''
                  )}
                  onClick={() => {
                    setSelectedFile(url);
                    onSelect(url);
                  }}
                >
                  <div className="bg-muted/30 aspect-square">
                    {type === 'image' || type === 'gallery' ? (
                      <Image src={url} alt={file.name} fill className="object-cover" unoptimized />
                    ) : type === 'audio' ? (
                      <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-2">
                        <Music className="mb-2 h-10 w-10" />
                        <span className="max-w-full truncate px-2 text-xs">{file.name}</span>
                      </div>
                    ) : type === 'video' ? (
                      <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-2">
                        <Film className="mb-2 h-10 w-10" />
                        <span className="max-w-full truncate px-2 text-xs">{file.name}</span>
                      </div>
                    ) : (
                      <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-2">
                        <FileIcon className="mb-2 h-10 w-10" />
                        <span className="max-w-full truncate px-2 text-xs">{file.name}</span>
                      </div>
                    )}
                  </div>
                  {selectedFile === url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Check className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
