import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

import { defs, js } from "../../dreamland-blocks/index";

Blockly.common.defineBlocks(defs);
Object.assign(javascriptGenerator.forBlock, js);

export const extensions = ["bkx"];

export async function handle(basepath, load) {
  // we can assume it is a block file
  const workspaceJson = JSON.parse(
    await anura.fs.promises.readFile(basepath + "/src/components/" + load.path)
  );

  const ws = new Blockly.Workspace();
  Blockly.serialization.workspaces.load(workspaceJson, ws);

  try {
    const code = javascriptGenerator.workspaceToCode(ws);
    const url = URL.createObjectURL(
      new Blob([code], { type: "application/javascript" })
    );
    const mod = await import(url);
    URL.revokeObjectURL(url);
    if (mod.default) {
      load.name =
        mod.name || mod.default.name || load.path.replace(/\.bkx?$/, "");
      load.component = mod.default;

      registerComponent(load.name, load.component);
    } else {
      console.warn(
        `[WARNING] <tadpole-rt> Component ${load.path} does not export a default component. It will not be registered.`
      );
    }
  } catch (e) {
    console.error(
      `[ERROR] <tadpole-rt> Failed to load component ${load.path}: ${e}\nThis is not a fatal error, but the component will not be available.`
    );
    load.error = e;
  }
}
