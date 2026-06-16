// src/app/dashboard/users/create-user/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import UserForm from '@/components/users/UserForm';
import {
  createUserSchema,
  ICreateUserSchema,
} from '@/validations/user-validation';
import { useCreateUserMutation } from '@/redux/user-api';
import { extractApiError } from '@/utils/extract-api-error';

const CreateUserPage = () => {
  const router = useRouter();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const form = useForm<ICreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullname: '',
      email: '',
      phone: '',
      password: '',
      role: 'EDITOR',
    },
  });

  async function onSubmit(values: ICreateUserSchema) {
    const toastId = toast.loading('Creating user...');

    try {
      const res = await createUser({
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        phone: values.phone ?? undefined,
        role: values.role,
      }).unwrap();

      toast.dismiss(toastId);
      toast.success('User created successfully');
      router.push(`/dashboard/users/${res.data.id}/user-profile`);
    } catch (error) {
      console.error('User creation error:', error);
      const { message, fieldErrors, hasFieldErrors } = extractApiError(error);

      toast.dismiss(toastId);

      if (hasFieldErrors && fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, errorMessage]) => {
          form.setError(field as keyof ICreateUserSchema, {
            message: errorMessage,
          });
        });
        toast.error(message);
      } else {
        toast.error(message || 'Operation failed');
      }
    }
  }

  return (
    <div className="container mx-auto">
      <UserForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitLabel="Create User"
        loadingLabel="Creating..."
      />
    </div>
  );
};

export default CreateUserPage;
