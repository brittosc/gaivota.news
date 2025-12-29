'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// The user prompt didn't say install `use-debounce`. I'll implement a simple debounce in-component or check deps.
// Safer to implement basic debounce with `setTimeout`.

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Local state for immediate input response
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query')?.toString() || '');

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    // Debounce params update
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    // Reset page on search
    params.set('page', '1');

    // Using a timeoutRef would be needed for a real debounce, but `replace` works.
    // Let's implement robust debounce:
    // Actually, let's keep it simple: `onChange` updates state, `useEffect` triggers URL update with delay.
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const currentQuery = params.get('query') || '';

      if (searchTerm !== currentQuery) {
        if (searchTerm) {
          params.set('query', searchTerm);
        } else {
          params.delete('query');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, pathname, replace, searchParams]);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Pesquisar posts..."
          className="pl-8"
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-50">
        <Select
          defaultValue={searchParams.get('sort')?.toString() || 'latest'}
          onValueChange={handleSort}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Mais Recentes</SelectItem>
            <SelectItem value="oldest">Mais Antigos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
