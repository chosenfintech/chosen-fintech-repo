export const pageConfigs = [
  {
    paths: ["/dashboard"],
    title: "Dashboard",
    description: "Admin dashboard overview",
    exact: true,
  },
  // === USER MANAGEMENT ===
  {
    paths: ["/dashboard/users/:id/user-profile"],
    dynamicPaths: [/^\/dashboard\/users\/[^/]+\/user-profile$/],
    title: "User Profile",
    description: "View and manage your profile details",
  },
  {
    paths: ["/dashboard/users/create-user"],
    dynamicPaths: [/^\/dashboard\/users\/[^/]+$/],
    title: "Create Admin",
    description: "Create admins, all admins have management access",
  },
  {
    paths: ["/dashboard/users"],
    dynamicPaths: [/^\/dashboard\/users\/[^/]+$/],
    title: "Admin Management",
    description: "Manage and monitor admin accounts",
  },

  // === DONOR MANAGEMENT - DETAIL PAGES ===
  {
    paths: ["/dashboard/donors/create-donor"],
    title: "Create Donor",
    description: "Add a new donor to the management system",
  },
  {
    paths: ["/dashboard/donors/:id/edit"],
    dynamicPaths: [/^\/dashboard\/donors\/[^/]+\/edit$/],
    title: "Edit Donor",
    description: "Update donor information and contact details",
  },
  {
    paths: ["/dashboard/donors/:id/detail"],
    dynamicPaths: [/^\/dashboard\/donors\/[^/]+\/detail$/],
    title: "Donor Details",
    description: "View comprehensive donor profile and donation history",
  },
  {
    paths: ["/dashboard/donors/:id/donations"],
    dynamicPaths: [/^\/dashboard\/donors\/[^/]+\/donations$/],
    title: "Donor Donations",
    description: "View all donations made by this donor",
  },

  // === DONOR UPLOADS - DETAIL PAGES ===
  {
    paths: ["/dashboard/donors/uploads/:id/details"],
    dynamicPaths: [/^\/dashboard\/donors\/uploads\/[^/]+\/details$/],
    title: "Upload Details",
    description: "View upload results including successful entries and errors",
  },
  {
    paths: ["/dashboard/donors/uploads/momo-statement"],
    title: "Upload MoMo Statement",
    description: "Import donor data from mobile money statement",
  },
  {
    paths: ["/dashboard/donors/uploads/donors-data"],
    title: "Upload Donor Data",
    description: "Bulk import donor information from file",
  },
  {
    paths: ["/dashboard/donors/uploads"],
    title: "Upload History",
    description: "Track all donor data imports and mobile money statements",
  },
  {
    paths: ["/dashboard/donors"],
    title: "Donor Management",
    description: "View and manage all donors in the system",
  },

  // === DONATIONS ===
  {
    paths: ["/dashboard/donations"],
    title: "All Donations",
    description: "Comprehensive view of all donations received",
  },

  // === CONTACTS ===
  {
    paths: ["/dashboard/contacts"],
    title: "Contact Management",
    description: "Manage contacts and communication recipients",
  },

  // === MESSAGES - DETAIL PAGES ===
  {
    paths: ["/dashboard/messages/:id/preview"],
    dynamicPaths: [/^\/dashboard\/messages\/[^/]+\/preview$/],
    title: "Message Preview",
    description:
      "Review message content before sending or view sent message details",
  },
  {
    paths: ["/dashboard/messages/:id/delivery-logs"],
    dynamicPaths: [/^\/dashboard\/messages\/[^/]+\/delivery-logs$/],
    title: "Delivery Logs",
    description: "Track message delivery status and recipient engagement",
  },

  // === SMS MESSAGES ===
  {
    paths: ["/dashboard/messages/sms/create"],
    title: "Create SMS Message",
    description: "Compose and send SMS to donors and contacts",
  },
  {
    paths: ["/dashboard/messages/sms/:id/edit"],
    dynamicPaths: [/^\/dashboard\/messages\/sms\/[^/]+\/edit$/],
    title: "Edit SMS Message",
    description: "Update SMS message content and recipients",
  },
  {
    paths: ["/dashboard/messages/sms"],
    title: "SMS Messages",
    description: "View all SMS messages sent to donors and contacts",
  },

  // === EMAIL MESSAGES ===
  {
    paths: ["/dashboard/messages/email/create"],
    title: "Create Email Message",
    description: "Compose and send email to donors and contacts",
  },
  {
    paths: ["/dashboard/messages/email/:id/edit"],
    dynamicPaths: [/^\/dashboard\/messages\/email\/[^/]+\/edit$/],
    title: "Edit Email Message",
    description: "Update email message content and recipients",
  },
  {
    paths: ["/dashboard/messages/email"],
    title: "Email Messages",
    description: "View all email messages sent to donors and contacts",
  },

  // === ALL MESSAGES ===
  {
    paths: ["/dashboard/messages"],
    title: "Message History",
    description:
      "Complete record of all communications sent to donors and contacts",
  },

  // === SETTINGS ===
  {
    paths: ["/dashboard/settings"],
    title: "Settings",
    description: "Configure system preferences and account settings",
  },
];
