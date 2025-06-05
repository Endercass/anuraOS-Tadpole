import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";
import { normalizeName } from "./procedures";

// This should have a field for name (string), value (any), and a checkbox for default export. The value should be a blockly value input, and the name should be a string input. The default export checkbox should be a boolean input. The block should have a colour of 230.
export const exportConstBlock = {
  init: function () {
    this.appendDummyInput()
      .appendField("Export const")
      .appendField(new Blockly.FieldTextInput("name"), "CONST_NAME")
      .appendField("default?")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "EXPORT_DEFAULT");
    this.appendValueInput("CONST_VALUE").setCheck(null).appendField("value");
    this.setColour(290);
    this.setInputsInline(false);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
  },
};

export const exportVarBlock = {
  init: function () {
    this.appendDummyInput()
      .appendField("Export variable ")
      .appendField(new Blockly.FieldVariable("item"), "EXPORT_VAR")
      .appendField(" default? ")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "EXPORT_DEFAULT");

    this.setColour(290);
  },
};

export const exportFunctionBlock = {
  init: function () {
    this.appendValueInput("FUNC_NAME")
      .setCheck("Function")
      .appendField("Export function ");
    this.appendDummyInput()
      .appendField(" default? ")
      .appendField(new Blockly.FieldCheckbox("FALSE"), "EXPORT_DEFAULT");
    this.setColour(290);
  },
};

export const importNamedComponentBlock = {
  init: function () {
    this.appendDummyInput()
      .appendField("Import named component")
      .appendField(new Blockly.FieldTextInput("name"), "IMPORT_NAME");
    this.setColour(290);
  },
};

export function exportVarBlockJS(block) {
  const varId = block.getFieldValue("EXPORT_VAR");
  const exportDefault = block.getFieldValue("EXPORT_DEFAULT") === "TRUE";
  const unsafeVarName = Blockly.Variables.getVariable(
    block.workspace,
    varId,
  ).getName();

  console.log(javascriptGenerator.nameDB_);
  const varName = javascriptGenerator.nameDB_.getName(
    unsafeVarName,
    Blockly.Names.NameType.VARIABLE,
  );
  return "export " + (exportDefault ? "default " : "") + varName + ";\n";
}

export function exportConstBlockJS(block) {
  const constName = block.getFieldValue("CONST_NAME");
  const exportDefault = block.getFieldValue("EXPORT_DEFAULT") === "TRUE";
  const value =
    javascriptGenerator.valueToCode(
      block,
      "CONST_VALUE",
      javascriptGenerator.ORDER_NONE,
    ) || "undefined";
  let code = "export ";
  if (exportDefault) {
    code += "default ";
  }
  code += `const ${constName} = ${value};\n`;
  return code;
}

export function exportFunctionBlockJS(block) {
  const funcName = javascriptGenerator.valueToCode(
    block,
    "FUNC_NAME",
    Order.NONE,
  );

  const exportDefault = block.getFieldValue("EXPORT_DEFAULT") === "TRUE";
  let code = "export ";
  if (exportDefault) {
    code += "default ";
  }
  code += `${funcName};\n`;
  return code;
}

export function importNamedComponentBlockJS(block) {
  const importName = normalizeName(block, block.getFieldValue("IMPORT_NAME"));
  return `const ${importName} = await getComponent("${importName}");\n`;
}

export const defs = {
  export_var_block: exportVarBlock,
  export_const_block: exportConstBlock,
  export_function_block: exportFunctionBlock,
  import_named_component_block: importNamedComponentBlock,
};

export const js = {
  export_var_block: exportVarBlockJS,
  export_const_block: exportConstBlockJS,
  export_function_block: exportFunctionBlockJS,
  import_named_component_block: importNamedComponentBlockJS,
};
