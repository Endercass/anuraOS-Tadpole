import { basepath } from "./paths.js";
const builtins = {
  blockRt: basepath + "/block-rt.js",
};

export async function getModules(settings) {
  const mods = [];
  if (settings.blocksEnabled) {
    const blockRtCode = (
      await anura.fs.promises.readFile(builtins.blockRt)
    ).toString();
    const url = URL.createObjectURL(
      new Blob([blockRtCode], { type: "application/javascript" })
    );
    const blockRt = await import(url);
    URL.revokeObjectURL(url);
    mods.push({
      path: basepath + builtins.blockRt,
      extensions: blockRt.extensions,
      handle: blockRt.handle,
    });
  }
  return mods;
}

import settings from "./settings.js";

export const modules = await getModules(settings);
