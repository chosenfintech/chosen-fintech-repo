// src/app/dashboard/team/create/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import TeamMemberForm from '@/components/team/TeamMemberForm';
import {
  ITeamMemberFormSchema,
  createTeamMemberSchema,
} from '@/validations/team/team-member-validation';
import { useCreateTeamMemberMutation } from '@/redux/team/team-member-api';
import { buildTeamMemberFormData } from '@/utils/team-member-form-data';
import { extractApiError } from '@/utils/extract-api-error';

const CreateTeamMemberPage = () => {
  const router = useRouter();
  const [createTeamMember, { isLoading }] = useCreateTeamMemberMutation();

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

  async function onSubmit(data: ITeamMemberFormSchema, imageFile: File | null) {
    const toastId = toast.loading('Adding team member...');

    try {
      await createTeamMember(
        buildTeamMemberFormData(data, imageFile),
      ).unwrap();

      toast.dismiss(toastId);
      toast.success('Team member added successfully!');
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

  return (
    <div className="container mx-auto max-w-2xl">
      <TeamMemberForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default CreateTeamMemberPage;
