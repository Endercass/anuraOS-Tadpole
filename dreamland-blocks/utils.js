import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

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

        const safeName = javascriptGenerator.nameDB_.safeName(legalName);

        return [procName, safeName]; // show original name, store sanitized safe name
      });

      return options.length > 0 ? options : [["<no functions>", ""]];
    });
  }
}
