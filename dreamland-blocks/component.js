import { javascriptGenerator, Order } from "blockly/javascript";

export const attributeReferenceBlock = {
  init: function () {
    this.setColour(120);
    this.appendDummyInput().appendField("Attribute");
    this.appendValueInput("NAME").setCheck("String");
    this.setInputsInline(true);
    this.setOutput(true, "DLValue");
  },
};

export const derefBlock = {
  init: function () {
    this.setColour(120);
    this.appendDummyInput().appendField("Deref");
    this.appendValueInput("REF").setCheck("DLValue");
    this.setInputsInline(true);
    this.setOutput(true);
  },
};

export const useBlock = {
  init: function () {
    this.setColour(120);
    this.appendDummyInput().appendField("Use");
    this.appendValueInput("REF").setCheck(["DLValue", "DLRef"]);
    this.setInputsInline(true);
    this.setOutput(true, "DLRef");
  },
};

export function attributeReferenceBlockJS(block) {
  const prop =
    javascriptGenerator.valueToCode(block, "NAME", Order.ATOMIC) || "''";
  return [`this[${prop}]`, Order.MEMBER];
}

export function derefBlockJS(block) {
  return [
    javascriptGenerator.valueToCode(block, "REF", Order.ATOMIC) || "''",
    Order.MEMBER,
  ];
}

export function useBlockJS(block) {
  const prop =
    javascriptGenerator.valueToCode(block, "REF", Order.ATOMIC) || "''";
  return [`use(${prop})`, Order.FUNCTION_CALL];
}

export const defs = {
  attribute_reference_block: attributeReferenceBlock,
  deref_block: derefBlock,
  use_block: useBlock,
};

export const js = {
  attribute_reference_block: attributeReferenceBlockJS,
  deref_block: derefBlockJS,
  use_block: useBlockJS,
};
