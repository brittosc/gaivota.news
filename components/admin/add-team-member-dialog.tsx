'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { searchUserByEmail, updateUserRole } from '@/app/actions/team';
import { toast } from 'sonner';
import { Loader2, Plus, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function AddTeamMemberDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'user'>('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState<Profile | null>(null);

  const handleSearch = async () => {
    if (!email) return;
    setIsLoading(true);
    setSearchedUser(null);
    try {
      const result = await searchUserByEmail(email);
      if (result.error || !result.user) {
        toast.error(result.error);
      } else {
        setSearchedUser(result.user as Profile);
        setRole(result.user.role as 'admin' | 'editor' | 'user');
      }
    } catch {
      toast.error('Erro ao buscar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!searchedUser) return;
    setIsLoading(true);
    try {
      const result = await updateUserRole(searchedUser.id, role);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Membro adicionado com sucesso');
        setOpen(false);
        setSearchedUser(null);
        setEmail('');
      }
    } catch {
      toast.error('Erro ao atualizar permissões');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Adicionar Membro da Equipe</DialogTitle>
          <DialogDescription>Busque um usuário pelo email e atribua uma função.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email do Usuário</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <Button size="icon" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {searchedUser && (
            <div className="rounded-md border p-4">
              <div className="mb-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={searchedUser.avatar_url || ''} />
                  <AvatarFallback>
                    {searchedUser.full_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{searchedUser.full_name}</p>
                  <p className="text-muted-foreground text-sm">Atual: {searchedUser.role}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Nova Função</Label>
                <Select
                  value={role}
                  onValueChange={(val: 'admin' | 'editor' | 'user') => setRole(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!searchedUser || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
