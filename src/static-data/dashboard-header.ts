export const pageConfigs = [
  {
    paths: ['/dashboard'],
    title: 'Dashboard',
    description: 'Admin dashboard overview',
    exact: true,
  },

  // === USER MANAGEMENT ===
  {
    paths: ['/dashboard/users/:id/user-profile'],
    dynamicPaths: [/^\/dashboard\/users\/[^/]+\/user-profile$/],
    title: 'User Profile',
    description: 'View and manage your profile details',
  },
  {
    paths: ['/dashboard/users/create-user'],
    dynamicPaths: [/^\/dashboard\/users\/[^/]+$/],
    title: 'Create Admin',
    description: 'Create admins, all admins have management access',
  },
  {
    paths: ['/dashboard/users'],
    dynamicPaths: [/^\/dashboard\/users\/[^/]+$/],
    title: 'Admin Management',
    description: 'Manage and monitor admin accounts',
  },

  // === POSTS MANAGEMENT ===
  {
    paths: ['/dashboard/posts/categories/:id/view'],
    dynamicPaths: [/^\/dashboard\/posts\/categories\/[^/]+\/view$/],
    title: 'View Post Category',
    description:
      'View details of this post category below including associated posts',
  },
  {
    paths: ['/dashboard/posts/categories/:id/edit'],
    dynamicPaths: [/^\/dashboard\/posts\/categories\/[^/]+\/edit$/],
    title: 'Edit Post Category',
    description: 'Edit an existing post category to update its details',
  },

  {
    paths: ['/dashboard/posts/categories/create'],
    dynamicPaths: [/^\/dashboard\/posts\/categories\/create\/?$/],
    title: 'Create Post Category',
    description: 'Fill in the form below to create a new post category',
  },
  {
    paths: ['/dashboard/posts/categories'],
    dynamicPaths: [/^\/dashboard\/posts\/categories$/],
    title: 'Post Categories',
    description: 'A list of all post categories to organize your blog posts',
  },
  {
    paths: ['/dashboard/posts/:slug/edit'],
    dynamicPaths: [/^\/dashboard\/posts\/[^/]+\/edit/],
    title: 'Edit Post',
    description: 'Edit an existing blog post with the rich text editor',
  },
  {
    paths: ['/dashboard/posts/:slug/edit'],
    dynamicPaths: [/^\/dashboard\/posts\/[^/]+\/preview/],
    title: 'Preview Post',
    description:
      'Preview the blog post before publishing as it will appear on the site',
  },
  {
    paths: ['/dashboard/posts/create'],
    dynamicPaths: [/^\/dashboard\/posts\/[^/]+$/],
    title: 'Create Post',
    description: 'Create a new blog post with the rich text editor',
  },
  {
    paths: ['/dashboard/posts'],
    dynamicPaths: [/^\/dashboard\/posts\/[^/]+$/],
    title: 'All Posts',
    description: 'A comprehensive list of all blog posts in a datatable format',
  },

  // === GALLERY MANAGEMENT ===
  {
    paths: ['/dashboard/gallery/photos/upload'],
    dynamicPaths: [/^\/dashboard\/gallery\/photos\/upload\/?$/],
    title: 'Upload Photo',
    description: 'Upload a new photo to the gallery',
  },
  {
    paths: ['/dashboard/gallery/photos'],
    dynamicPaths: [/^\/dashboard\/gallery\/photos$/],
    title: 'All Photos',
    description:
      'A comprehensive list of all gallery photos in a datatable format',
  },
  {
    paths: ['/dashboard/gallery/categories/create'],
    dynamicPaths: [/^\/dashboard\/gallery\/categories\/create\/?$/],
    title: 'Create Gallery Category',
    description: 'Fill in the form below to create a new gallery category',
  },
  {
    paths: ['/dashboard/gallery/categories'],
    dynamicPaths: [/^\/dashboard\/gallery\/categories$/],
    title: 'Gallery Categories',
    description: 'A list of all gallery categories to organize your photos',
  },
];
