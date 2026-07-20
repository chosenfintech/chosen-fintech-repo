// src/components/team/data-table/ActionsDropdown.tsx
'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MoreHorizontal, Eye, EyeOff, Pencil, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { ITeamMember } from '@/types/team/team-member.types';
import {
  useToggleTeamMemberPublishMutation,
  useDeleteTeamMemberMutation,
} from '@/redux/team/team-member-api';
import { extractApiError } from '@/utils/extract-api-error';
import { useIsAdmin } from '@/hooks/use-is-admin';

interface TeamMemberActionsDropdownProps {
  member: ITeamMember;
}

export function TeamMemberActionsDropdown({
  member,
}: TeamMemberActionsDropdownProps) {
  const router = useRouter();
  const isAdmin = useIsAdmin();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);

  const [togglePublish] = useToggleTeamMemberPublishMutation();
  const [deleteMember] = useDeleteTeamMemberMutation();

  const socials = [
    { label: 'Email', value: member.email },
    { label: 'Facebook', value: member.facebookUrl },
    { label: 'X / Twitter', value: member.twitterUrl },
    { label: 'LinkedIn', value: member.linkedinUrl },
  ].filter((s) => s.value);

  const handleTogglePublish = async () => {
    const toastId = toast.loading(
      member.isPublished ? 'Hiding member...' : 'Publishing member...',
    );
    try {
      await togglePublish(member.id).unwrap();
      toast.dismiss(toastId);
      toast.success(
        `Team member ${member.isPublished ? 'hidden' : 'published'} successfully`,
      );
    } catch (error) {
      const { message } = extractApiError(error);
      toast.dismiss(toastId);
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting team member...');
    try {
      await deleteMember(member.id).unwrap();
      toast.dismiss(toastId);
      toast.success('Team member deleted successfully');
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
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setViewDialogOpen(true)}
          >
            <User className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => router.push(`/dashboard/team/${member.id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Member
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={handleTogglePublish}
          >
            {member.isPublished ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide from site
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600 hover:cursor-pointer"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Member
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        {/* min-w-0 so a long social URL cannot widen the dialog's grid track
            (and with it the photo); max-h keeps tall content scrollable. */}
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader className="min-w-0">
            <DialogTitle className="truncate">{member.name}</DialogTitle>
          </DialogHeader>
          <div className="min-w-0 space-y-4">
            {/* object-contain: portraits and landscape shots are both shown
                whole rather than cropped to the frame. */}
            <div className="relative h-[45vh] max-h-[420px] w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 512px"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{member.role}</Badge>
              <Badge variant={member.isPublished ? 'default' : 'outline'}>
                {member.isPublished ? 'Published' : 'Hidden'}
              </Badge>
              <Badge variant="outline">Order #{member.displayOrder}</Badge>
            </div>

            {socials.length > 0 && (
              <dl className="space-y-1.5 text-sm">
                {socials.map((social) => (
                  <div key={social.label} className="flex min-w-0 gap-2">
                    <dt className="text-muted-foreground shrink-0">
                      {social.label}:
                    </dt>
                    <dd className="min-w-0 break-all">{social.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Team Member"
        description={`Are you sure you want to remove ${member.name} from the team? This action cannot be undone and will delete their photo from storage.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
