// src/app/dashboard/users/[userId]/user-profile/page.tsx
'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield } from 'lucide-react';
import { RootState } from '@/redux/store';
import { useGetUserQuery } from '@/redux/user-api';
import { extractApiError } from '@/utils/extract-api-error';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { ProfileSkeleton } from '@/components/users/profile/ProfilePageSkeleton';
import ProfileInfoTab from '@/components/users/profile/ProfileInfoTab';
import SecurityTab from '@/components/users/profile/SecurityTab';

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState('profile');

  const isViewingOwnProfile = currentUser?.id === userId;

  const {
    data: userData,
    error,
    isError,
    isLoading,
    refetch,
  } = useGetUserQuery(userId!, { skip: isViewingOwnProfile });

  const errorMessage = extractApiError(error).message;

  // Use fetched data for other users, Redux state for own profile
  const displayUser = isViewingOwnProfile ? currentUser : userData?.data;

  if (isLoading && !isViewingOwnProfile) {
    return <ProfileSkeleton />;
  }

  if (isError && !isViewingOwnProfile) {
    return <ErrorMessage error={errorMessage} onRetry={refetch} />;
  }

  if (!displayUser) {
    return <ErrorMessage error="User not found" />;
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 lg:mb-12">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile Information</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2"
            disabled={!isViewingOwnProfile}
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security Settings</span>
            <span className="sm:hidden">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <ProfileInfoTab user={displayUser} currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          {isViewingOwnProfile && <SecurityTab userId={userId!} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
