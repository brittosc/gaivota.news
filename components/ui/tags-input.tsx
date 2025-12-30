'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagsInputProps {
  selectedTags: string[]; // List of tag IDs
  onTagsChange: (tags: string[]) => void;
}

export function TagsInput({ selectedTags, onTagsChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await supabase.from('tags').select('*').order('name');
      if (data) {
        setAvailableTags(data);
      }
    };
    fetchTags();
  }, [supabase]);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredTags([]);
    } else {
      setFilteredTags(
        availableTags.filter(
          tag =>
            tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedTags.includes(tag.id)
        )
      );
    }
  }, [inputValue, availableTags, selectedTags]);

  const handleCreateTag = async () => {
    if (!inputValue.trim()) return;

    setLoading(true);
    const slug = inputValue
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newTag = {
      name: inputValue.trim(),
      slug: slug,
    };

    try {
      const { data, error } = await supabase.from('tags').insert(newTag).select().single();
      if (error) throw error;
      if (data) {
        setAvailableTags([...availableTags, data]);
        onTagsChange([...selectedTags, data.id]);
        setInputValue('');
        toast.success(`Tag '${data.name}' criada!`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao criar tag: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there is an exact match in available tags, select it
      const exactMatch = availableTags.find(
        t => t.name.toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (exactMatch) {
        if (!selectedTags.includes(exactMatch.id)) {
          onTagsChange([...selectedTags, exactMatch.id]);
          setInputValue('');
        }
      } else {
        // Otherwise try to create
        handleCreateTag();
      }
    }
  };

  const selectTag = (tag: Tag) => {
    onTagsChange([...selectedTags, tag.id]);
    setInputValue('');
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const selectedTagObjects = availableTags.filter(t => selectedTags.includes(t.id));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTagObjects.map(tag => (
          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
            {tag.name}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeTag(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar tags..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleCreateTag}
            disabled={!inputValue.trim() || loading}
          >
            {loading ? <span className="animate-spin">...</span> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
        {/* Dropdown suggestions */}
        {filteredTags.length > 0 && (
          <div className="bg-popover absolute z-10 mt-1 w-full rounded-md border p-1 shadow-md">
            {filteredTags.map(tag => (
              <div
                key={tag.id}
                className="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm px-2 py-1.5 text-sm"
                onClick={() => selectTag(tag)}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
