import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

export const elementBlock = {
  init: function () {
    this.attributes = [];
    this.children = [];
    this.appendValueInput("TAG")
      .setCheck(["String", "Function"])
      .appendField("Element with tag");
    this.updateShape();
    this.setOutput(true, "HTMLElement");
    this.setMutator(
      new Blockly.icons.MutatorIcon(
        ["element_attribute_item", "element_child_item"],
        this,
      ),
    );
    this.setColour(120);
  },

  saveExtraState: function () {
    return {
      attributes: this.attributes,
      children: this.children.length,
    };
  },

  loadExtraState: function (state) {
    this.attributes = state.attributes || [];
    this.children = new Array(state.children || 0).fill(null);
    this.updateShape();
  },

  decompose: function (workspace) {
    const container = workspace.newBlock("element_container");
    container.initSvg();
    container.setFieldValue(this.getFieldValue("TAG") || "div", "TAGNAME");

    let attrConn = container.getInput("ATTR_STACK").connection;
    this.attributes.forEach((attr) => {
      const item = workspace.newBlock("element_attribute_item");
      item.initSvg();
      item.setFieldValue(attr, "NAME");
      attrConn.connect(item.previousConnection);
      attrConn = item.nextConnection;
    });

    let childConn = container.getInput("CHILD_STACK").connection;
    this.children.forEach(() => {
      const childItem = workspace.newBlock("element_child_item");
      childItem.initSvg();
      // restore any saved connection
      childItem.valueConnection_ = null;
      childConn.connect(childItem.previousConnection);
      childConn = childItem.nextConnection;
    });

    return container;
  },

  compose: function (container) {
    // ATTRIBUTES
    let item = container.getInputTargetBlock("ATTR_STACK");
    const newAttrs = [],
      attrConns = [];
    while (item) {
      newAttrs.push(item.getFieldValue("NAME"));
      attrConns.push(item.valueConnection_);
      item = item.nextConnection && item.nextConnection.targetBlock();
    }
    // CHILDREN
    item = container.getInputTargetBlock("CHILD_STACK");
    const newChildren = [],
      childConns = [];
    while (item) {
      newChildren.push(null);
      childConns.push(item.valueConnection_);
      item = item.nextConnection && item.nextConnection.targetBlock();
    }

    // disconnect old attr/value inputs
    this.attributes.forEach((_, i) => {
      const inp = this.getInput("ATTR_" + i);
      if (inp && inp.connection.targetConnection)
        inp.connection.targetConnection.disconnect();
    });
    // disconnect old child inputs
    this.children.forEach((_, i) => {
      const inp = this.getInput("CHILD_" + i);
      if (inp && inp.connection.targetConnection)
        inp.connection.targetConnection.disconnect();
    });

    this.attributes = newAttrs;
    this.children = newChildren;
    this.updateShape();

    // reconnect attribute values
    attrConns.forEach((conn, i) => conn && conn.reconnect(this, "ATTR_" + i));
    // reconnect child values
    childConns.forEach((conn, i) => conn && conn.reconnect(this, "CHILD_" + i));
  },

  saveConnections: function (container) {
    let item = container.getInputTargetBlock("ATTR_STACK"),
      i = 0;
    while (item) {
      const inp = this.getInput("ATTR_" + i);
      if (inp) item.valueConnection_ = inp.connection.targetConnection;
      item = item.nextConnection && item.nextConnection.targetBlock();
      i++;
    }
    item = container.getInputTargetBlock("CHILD_STACK");
    i = 0;
    while (item) {
      const inp = this.getInput("CHILD_" + i);
      if (inp) item.valueConnection_ = inp.connection.targetConnection;
      item = item.nextConnection && item.nextConnection.targetBlock();
      i++;
    }
  },

  updateShape: function () {
    // remove old attribute inputs
    let i = 0;
    while (this.getInput("ATTR_" + i)) {
      this.removeInput("ATTR_" + i);
      i++;
    }
    // remove old child inputs
    i = 0;
    while (this.getInput("CHILD_" + i)) {
      this.removeInput("CHILD_" + i);
      i++;
    }

    // re-add attribute inputs
    this.attributes.forEach((name, idx) => {
      const inp = this.appendValueInput("ATTR_" + idx);
      inp.appendField(name);
    });

    // re-add child inputs
    this.children.forEach((_, idx) => {
      this.appendValueInput("CHILD_" + idx).appendField("child");
    });
  },
};

export const elementContainerBlock = {
  init: function () {
    this.setColour(120);
    this.appendDummyInput("TAGLINE")
      .appendField("Element with tag")
      .appendField(new Blockly.FieldLabelSerializable(""), "TAGNAME");
    this.appendStatementInput("ATTR_STACK").setCheck("element_attribute_item");
    this.appendDummyInput().appendField("Children:");
    this.appendStatementInput("CHILD_STACK").setCheck("element_child_item");
    this.setTooltip("Add attributes and children");
  },
};

export const elementAttributeItemBlock = {
  init: function () {
    this.setColour(120);
    this.appendDummyInput()
      .appendField("Attribute")
      .appendField(new Blockly.FieldTextInput("name"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

export const elementChildItemBlock = {
  init: function () {
    this.setColour(120);
    this.appendDummyInput().appendField("Child");
    // this.valueConnection_ will hold the connected child's connection
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

export function elementBlockJS(block) {
  let tagCode = javascriptGenerator.valueToCode(block, "TAG", Order.NONE);
  if (!tagCode) tagCode = '"div"';

  const attrs = [];
  for (let i = 0; i < block.attributes.length; i++) {
    const name = block.attributes[i];
    const val =
      javascriptGenerator.valueToCode(block, "ATTR_" + i, Order.NONE) || '""';
    attrs.push(`${JSON.stringify(name)}: ${val}`);
  }
  const attrObject = `{ ${attrs.join(", ")} }`;

  const kids = [];
  for (let i = 0; i < (block.children || []).length; i++) {
    const childCode =
      javascriptGenerator.valueToCode(block, "CHILD_" + i, Order.NONE) || '""';
    kids.push(childCode);
  }

  const allArgs = [tagCode, attrObject].concat(kids);
  const code = `h(${allArgs.join(", ")})`;

  return [code, Order.FUNCTION_CALL];
}

export const defs = {
  element_block: elementBlock,
  element_container: elementContainerBlock,
  element_attribute_item: elementAttributeItemBlock,
  element_attribute_item_block: elementAttributeItemBlock,
  element_child_item: elementChildItemBlock,
};

export const js = {
  element_block: elementBlockJS,
};
