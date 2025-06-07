import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import * as En from "blockly/msg/en";
import "blockly/blocks";

import { proceduresCategory } from "../../../dreamland-blocks";

export default function BlocklyComponent() {
  this.css = `
  height: 100%;
  width: 100%;

  .blocklyDiv {
    height: 100%;
    width: 100%;
    overflow: hidden;
    border: 1px solid #d0d0d0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: #ffffff;
  }

  .blocklyMainBackground {
    stroke: none !important;
  }
`;

  this.onCodeChange ||= () => {};
  this.setWorkspace = (workspace) => {
    Blockly.serialization.workspaces.load(workspace, this.workspace);
  };

  this.options = {
    renderer: "zelos",
    media: "media/",
    move: {
      scrollbars: {
        horizontal: true,
        vertical: true,
      },
      wheel: true,
      drag: true,
    },
  };

  this.mount = () => {
    Blockly.setLocale(En);

    requestAnimationFrame(() => {
      this.options.toolbox = this.toolbox;
      this.workspace = Blockly.inject(this.blocklyDiv, this.options);
      window.workspace = this.workspace;
      window.Blockly = Blockly;
      Blockly.svgResize(this.workspace);

      this.workspace.registerToolboxCategoryCallback(
        "DL_PROCEDURE",
        proceduresCategory,
      );

      this.workspace.addChangeListener((e) => {
        if (
          e.isUiEvent ||
          e.type == Blockly.Events.FINISHED_LOADING ||
          this.workspace.isDragging()
        ) {
          return;
        }
        this.onCodeChange(javascriptGenerator.workspaceToCode(this.workspace));
      });

      if (this.preload) {
        Blockly.serialization.workspaces.load(this.preload, this.workspace);
      }
    });
  };

  return (
    <div>
      <div class="blocklyDiv" bind:this={use(this.blocklyDiv)}></div>
      <xml style="display: none" bind:this={use(this.toolbox)}>
        {...this.children}
      </xml>
    </div>
  );
}
