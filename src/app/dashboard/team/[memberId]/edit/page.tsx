// src/app/dashboard/team/[memberId]/edit/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import TeamMemberForm from '@/components/team/TeamMemberForm';
import {
  ITeamMemberFormSchema,
  createTeamMemberSchema,
} from '@/validations/team/team-member-validation';
import {
  useGetTeamMemberByIdQuery,
  useUpdateTeamMemberMutation,
} from '@/redux/team/team-member-api';
import { buildTeamMemberFormData } from '@/utils/team-member-form-data';
import { extractApiError } from '@/utils/extract-api-error';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

const EditTeamMemberPage = () => {
  const router = useRouter();
  const params = useParams();
  const memberId = params.memberId as string;

  const {
    data: memberData,
    isLoading: isLoadingMember,
    error: memberError,
    isError: isMemberError,
    refetch: refetchMember,
  } = useGetTeamMemberByIdQuery(memberId);

  const [updateTeamMember, { isLoading: isUpdating }] =
    useUpdateTeamMemberMutation();

  const form = useForm<ITeamMemberFormSchema>({
    resolver: zodResolver(createTeamMemberSchema),
    defaultValues: {
      name: '',
      role: '',
      email: '',
      facebookUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      displayOrder: 0,
      isPublished: false,
    },
  });

  useEffect(() => {
    if (memberData?.data) {
      const member = memberData.data;

      form.reset({
        name: member.name,
        role: member.role,
        email: member.email ?? '',
        facebookUrl: member.facebookUrl ?? '',
        twitterUrl: member.twitterUrl ?? '',
        linkedinUrl: member.linkedinUrl ?? '',
        displayOrder: member.displayOrder,
        isPublished: member.isPublished,
      });
    }
  }, [memberData, form]);

  async function onSubmit(data: ITeamMemberFormSchema, imageFile: File | null) {
    const toastId = toast.loading('Updating team member...');

    try {
      await updateTeamMember({
        memberId,
        data: buildTeamMemberFormData(data, imageFile),
      }).unwrap();

      toast.dismiss(toastId);
      toast.success('Team member updated successfully!');
      router.push('/dashboard/team');
    } catch (err) {
      toast.dismiss(toastId);

      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof ITeamMemberFormSchema, {
            message: errorMessage,
          });
        });
      }

      toast.error(message);
    }
  }

  if (isMemberError) {
    return (
      <div className="container mx-auto max-w-2xl">
        <ErrorMessage
          error={extractApiError(memberError).message}
          onRetry={refetchMember}
        />
      </div>
    );
  }

  if (isLoadingMember) {
    return (
      <div className="container mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <TeamMemberForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isUpdating}
        existingImageUrl={memberData?.data.imageUrl}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default EditTeamMemberPage;
