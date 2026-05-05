export const SITE = {
  website: "https://riteshgoru.com/",
  author: "Ritesh Goru",
  profile: "https://github.com/BlackWingedKing",
  desc: "Personal blog and notes by Ritesh Goru - exploring machine learning, optimization, and reinforcement learning.",
  title: "Ritesh Goru",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/BlackWingedKing/blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Kolkata", // Default global timezone (IANA format)
} as const;
