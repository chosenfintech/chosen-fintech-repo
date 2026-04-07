// src/components/users/UserProfileDropdown.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Power } from 'lucide-react';
import { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { userLoggedOut } from '@/redux/auth-slice';
import { logout } from '@/lib/auth';
import toast from 'react-hot-toast';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const UserProfileDropdown: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  if (!user) return null;

  const fullName = user.fullname;

  const userInitials = user.fullname
    .split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...');
    setIsLoading(true);

    try {
      await logout();
      dispatch(userLoggedOut());
      toast.dismiss(toastId);
      toast.success('Logout successful, redirecting...');
      router.push('/login');
    } catch (err) {
      console.log(err);
      toast.dismiss(toastId);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-10 w-10 border-2 border-foreground cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="my-2 bg-popover border-border shadow-lg w-auto min-w-46 max-w-64"
          align="end"
          forceMount
        >
          {/* Profile Header */}
          <div className="w-full p-4 bg-card">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-border">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 overflow-hidden flex-1 min-w-0">
                <p className="text-sm font-medium leading-none text-foreground truncate">
                  {fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuLabel className="text-xs text-muted-foreground px-4 py-2">
            Account
          </DropdownMenuLabel>

          {/* Profile Link */}
          <DropdownMenuItem
            onClick={() =>
              handleNavigation(`/dashboard/users/${user.id}/user-profile`)
            }
            className="cursor-pointer px-4 py-2 hover:bg-accent focus:bg-accent text-foreground flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

          {/* Logout */}
          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 hover:bg-destructive/10 focus:bg-destructive/10 text-destructive disabled:opacity-50"
          >
            <Power className="mr-2 h-4 w-4" />
            <span>{isLoading ? 'Logging out...' : 'Sign Out'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Confirm Logout"
        description="Are you sure you want to sign out? You'll need to log in again to access your account."
        onConfirm={handleLogout}
        confirmText="Sign Out"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
};

export default UserProfileDropdown;
