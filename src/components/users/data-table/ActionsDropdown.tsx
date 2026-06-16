// src/components/users/data-table/ActionsDropdown.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Trash2, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { IUser, UserRole } from '@/types/user.types';
import { useDeleteUserMutation, useUpdateUserRoleMutation } from '@/redux/user-api';
import { extractApiError } from '@/utils/extract-api-error';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { RootState } from '@/redux/store';

interface UserActionsDropdownProps {
  user: IUser;
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'EDITOR', label: 'Editor' },
];

export function UserActionsDropdown({ user }: UserActionsDropdownProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = currentUser?.role === 'ADMIN';
  // Admins cannot change their own role (matches the backend guard).
  const isSelf = currentUser?.id === user.id;

  const handleChangeRole = async (newRole: UserRole) => {
    const roleLabel = newRole === 'ADMIN' ? 'Admin' : 'Editor';
    const toastId = toast.loading(`Changing role to ${roleLabel}...`);

    try {
      await updateUserRole({ userId: user.id, role: newRole }).unwrap();
      toast.dismiss(toastId);
      toast.success(`User role changed to ${roleLabel} successfully`);
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleDeleteUser = async () => {
    const toastId = toast.loading('Deleting user...');

    try {
      await deleteUser(user.id).unwrap();
      toast.dismiss(toastId);
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto max-w-46">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/users/${user.id}/user-profile`}
              className="hover:cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>

          {isAdmin && !isSelf && (
            <>
              <DropdownMenuSeparator />

              {/* Update Role Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  Update Role
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-[350px]:translate-x-10 max-[350px]:translate-y-8">
                  {roleOptions.map((role) => (
                    <DropdownMenuItem
                      key={role.value}
                      className="hover:cursor-pointer"
                      onClick={() => handleChangeRole(role.value)}
                      disabled={user.role === role.value}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      {role.label}
                      {user.role === role.value && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          Current
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:cursor-pointer"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isAdmin && (
        <ConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete User"
          description={`Are you sure you want to delete "${user.fullname}"? This action cannot be undone.`}
          onConfirm={handleDeleteUser}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
        />
      )}
    </>
  );
}
