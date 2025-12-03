import siteData from "@/content/site.json";

export const siteConfig = {
  ...siteData,
  footer: {
    ...siteData.footer,
    year: new Date().getFullYear(),
  },
};
