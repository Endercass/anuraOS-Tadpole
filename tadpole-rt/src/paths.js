const __file = import.meta.url;
const baseurl = __file.substring(0, __file.lastIndexOf("/") + 1);

export const esbuildUrl = baseurl + "esbuild.wasm";

export const basepath = baseurl.substring(
  baseurl.indexOf("/fs/") + 3,
  baseurl.lastIndexOf("/"),
);

export const components = basepath + "/src/components";
