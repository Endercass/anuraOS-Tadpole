import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

export class FieldFunctionDropdown extends Blockly.FieldDropdown {
  constructor(workspace) {
    super(() => {
      if (!workspace) return [["<no functions>", ""]];

      const [proceduresNoReturn, proceduresWithReturn] =
        Blockly.Procedures.allProcedures(workspace);
      const allProcedures = proceduresNoReturn.concat(proceduresWithReturn);

      const blocks = workspace.getAllBlocks(false);

      const options = allProcedures.map(([procName]) => {
        const procBlock = blocks.find((b) => {
          if (!b.getFieldValue) return false;
          if (
            b.type !== "procedures_defnoreturn" &&
            b.type !== "procedures_defreturn"
          )
            return false;
          return b.getFieldValue("NAME") === procName;
        });

        const legalName = procBlock
          ? Blockly.Procedures.findLegalName(procName, procBlock)
          : procName;

        if (!javascriptGenerator.nameDB_) {
          javascriptGenerator.nameDB_ = new Blockly.Names(
            javascriptGenerator.RESERVED_WORDS_,
          );
        }

        const safeName = javascriptGenerator.nameDB_.safeName(legalName);

        return [procName, safeName]; // show original name, store sanitized safe name
      });

      return options.length > 0 ? options : [["<no functions>", ""]];
    });
  }
}

export const proceduresRef = {
  init: function () {
    this.appendDummyInput()
      .appendField("Procedure ")
      .appendField(new FieldFunctionDropdown(this.workspace), "FUNC_NAME");
    this.setOutput(true, "Function");
    this.setColour(290);
  },
};

export function proceduresRefJS(block) {
  const funcName = block.getFieldValue("FUNC_NAME");
  // Just output the function name as identifier (no quotes)
  return [funcName || "undefined", Order.ATOMIC];
}

/**
 * @param {Blockly.Workspace} workspace
 */
export function dynamicCategory(ws) {
  const upstream = workspace.toolboxCategoryCallbacks.get("PROCEDURE");
  return [
    ...upstream(ws),
    {
      kind: "block",
      type: "procedures_ref",
    },
  ];
}

export const defs = {
  procedures_ref: proceduresRef,
};

export const js = {
  procedures_ref: proceduresRefJS,
};
