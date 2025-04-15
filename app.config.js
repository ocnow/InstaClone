// filepath: /Users/omkarkulkarni/Coding/reactNative/InstaClone/app.config.js
export default {
  expo: {
    name: "InstaClone",
    slug: "instaclone",
    version: "1.0.0",
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  },
};