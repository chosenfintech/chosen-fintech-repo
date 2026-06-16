// src/components/users/profile/ProfilePageSkeleton.tsx
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto max-w-5xl space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 lg:mb-12">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 border-2 border-border rounded-lg bg-card">
            <Skeleton className="h-24 w-24 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-5 w-14 rounded-full mt-1" />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-end">
            <Skeleton className="h-11 w-36 rounded-md" />
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            {/* Password Card */}
            <Card className="border shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center p-4 border-2 border-border rounded-lg bg-card">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-9 w-36 rounded-md" />
                </div>
              </CardContent>
            </Card>

            {/* 2FA Card */}
            <Card className="border shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-64 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center p-4 border-2 border-border rounded-lg bg-card">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
