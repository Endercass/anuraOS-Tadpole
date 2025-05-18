import { FieldFunctionDropdown } from "./utils.js";
import { Order } from "blockly/javascript";

export const componentFunctionRef = {
  init: function () {
    this.appendDummyInput()
      .appendField("Component function named:")
      .appendField(new FieldFunctionDropdown(this.workspace), "FUNC_NAME");
    this.setOutput(true, "ComponentFunction");
    this.setColour(230);
  },
};

export function componentFunctionRefJS(block) {
  const funcName = block.getFieldValue("FUNC_NAME");
  // Just output the function name as identifier (no quotes)
  return [funcName || "undefined", Order.ATOMIC];
}

export const defs = {
  component_function_ref: componentFunctionRef,
};

export const js = {
  component_function_ref: componentFunctionRefJS,
};
