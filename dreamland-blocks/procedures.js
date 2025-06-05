import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

export const normalizeName = (block, name) => {
  const legalName = block
    ? Blockly.Procedures.findLegalName(name, block)
    : procName;

  if (!javascriptGenerator.nameDB_) {
    javascriptGenerator.nameDB_ = new Blockly.Names(
      javascriptGenerator.RESERVED_WORDS_,
    );
  }

  return javascriptGenerator.nameDB_.safeName(legalName);
};

export class FieldFunctionDropdown extends Blockly.FieldDropdown {
  constructor(workspace) {
    super(() => {
      if (!workspace) return [["<no functions>", ""]];

      const [proceduresNoReturn, proceduresWithReturn] =
        Blockly.Procedures.allProcedures(workspace);
      const allProcedures = proceduresNoReturn.concat(proceduresWithReturn);

      const blocks = workspace.getAllBlocks(false);

      const namedImports = blocks
        .map((b) => {
          if (!b?.getFieldValue) return false;
          if (b.type !== "import_named_component_block") return false;
          return [
            b.getFieldValue("IMPORT_NAME"),
            normalizeName(b, b.getFieldValue("IMPORT_NAME")),
          ];
        })
        .filter(Boolean);

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

        return [procName, normalizeName(procBlock, procName)];
      });

      options.push(...namedImports);

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
