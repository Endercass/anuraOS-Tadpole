const baseurl = new URL(import.meta.url).href;

export const basepath = baseurl.substring(
  baseurl.indexOf("/fs/") + 3,
  baseurl.lastIndexOf("/"),
);

export const components = basepath + "/src/components";
