// src/utils/team-member-form-data.ts
import type { ITeamMemberFormSchema } from '@/validations/team/team-member-validation';

/**
 * Serialises the team-member form for the multipart endpoints. Optional text
 * fields are always sent - an empty string clears them on update, which is why
 * they are not skipped when blank.
 */
export function buildTeamMemberFormData(
  data: ITeamMemberFormSchema,
  imageFile: File | null,
): FormData {
  const formData = new FormData();

  if (imageFile) formData.append('image', imageFile);

  formData.append('name', (data.name ?? '').trim());
  formData.append('role', (data.role ?? '').trim());
  formData.append('email', (data.email ?? '').trim());
  formData.append('facebookUrl', (data.facebookUrl ?? '').trim());
  formData.append('twitterUrl', (data.twitterUrl ?? '').trim());
  formData.append('linkedinUrl', (data.linkedinUrl ?? '').trim());
  formData.append('displayOrder', String(data.displayOrder ?? 0));
  formData.append('isPublished', String(data.isPublished ?? false));

  return formData;
}
