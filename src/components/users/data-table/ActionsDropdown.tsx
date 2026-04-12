// src/components/users/data-table/ActionsDropdown.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Trash2, User } from 'lucide-react';
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
} from '@/components/ui/dropdown-menu';
import { IUser } from '@/types/user.types';
import { useDeleteUserMutation } from '@/redux/user-api';
import { extractApiError } from '@/utils/extract-api-error';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { RootState } from '@/redux/store';

interface UserActionsDropdownProps {
  user: IUser;
}

export function UserActionsDropdown({ user }: UserActionsDropdownProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUser] = useDeleteUserMutation();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = currentUser?.isAdmin ?? false;

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

          {isAdmin && (
            <>
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
