'use client';

import * as React from 'react';
import { MoreHorizontal, Shield, ShieldAlert, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUserRole } from '@/app/actions/team';
import { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface TeamMemberCardProps {
  profile: Profile & { email?: string };
  currentUserId: string;
}

export function TeamMemberCard({ profile, currentUserId }: TeamMemberCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'admin' | 'editor'>(
    (profile.role as 'admin' | 'editor') || 'editor'
  );
  const [isPending, startTransition] = React.useTransition();

  const isSelf = profile.id === currentUserId;

  const handleUpdateRole = () => {
    startTransition(async () => {
      const result = await updateUserRole(profile.id, selectedRole);
      if (result.error) {
        toast.error('Erro ao atualizar cargo');
      } else {
        toast.success('Cargo atualizado com sucesso');
        setIsEditDialogOpen(false);
      }
    });
  };

  const handleRemoveMember = () => {
    startTransition(async () => {
      // Demote to 'user'
      const result = await updateUserRole(profile.id, 'user');
      if (result.error) {
        toast.error('Erro ao remover membro');
      } else {
        toast.success('Membro removido da equipe');
        setIsRemoveDialogOpen(false);
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar_url || ''} />
            <AvatarFallback>{profile.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <CardTitle className="truncate text-base" title={profile.full_name || ''}>
              {profile.full_name}
            </CardTitle>
            <p className="text-muted-foreground truncate text-xs" title={profile.email}>
              {profile.email || 'Email não disponível'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isSelf}>
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <UserCog className="mr-2 h-4 w-4" />
                Alterar Cargo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50"
                onClick={() => setIsRemoveDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover da Equipe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge
              variant={profile.role === 'admin' ? 'default' : 'secondary'}
              className="flex items-center gap-1"
            >
              {profile.role === 'admin' ? (
                <ShieldAlert className="h-3 w-3" />
              ) : (
                <Shield className="h-3 w-3" />
              )}
              {profile.role.toUpperCase()}
            </Badge>
            <span className="text-muted-foreground text-xs">
              Entrou em: {new Date(profile.updated_at || new Date()).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Cargo</DialogTitle>
            <DialogDescription>Selecione o novo cargo para {profile.full_name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedRole}
              onValueChange={val => setSelectedRole(val as 'admin' | 'editor')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRole} disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Alert Dialog */}
      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover da Equipe?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso removerá o acesso administrativo de <b>{profile.full_name}</b> e definirá seu
              cargo como &quot;User&quot;. Essa ação pode ser desfeita readicionando o membro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleRemoveMember}
              disabled={isPending}
            >
              {isPending ? 'Removendo...' : 'Sim, remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
