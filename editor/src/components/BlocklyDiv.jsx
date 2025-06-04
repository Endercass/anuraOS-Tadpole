import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import * as En from "blockly/msg/en";
import "blockly/blocks";

export default function BlocklyDiv() {
  this.css = `
height: 100%;
width: 100%;

.blocklyDiv {
  height: 100%;
  width: 100%;
  overflow: hidden;
}`;

  this.onCodeChange ||= () => {};

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
