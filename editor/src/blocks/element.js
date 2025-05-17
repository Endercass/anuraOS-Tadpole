import * as Blockly from "blockly/core";

class FieldFunctionDropdown extends Blockly.FieldDropdown {
  constructor(workspace) {
    super(() => {
      if (!workspace) return [["<no functions>", ""]];

      const [proceduresNoReturn, proceduresWithReturn] =
        Blockly.Procedures.allProcedures(workspace);
      const allProcedures = proceduresNoReturn.concat(proceduresWithReturn);

      const blocks = workspace.getAllBlocks(false);
      const nameManager = new Blockly.Names();

      allProcedures.forEach(([procName]) => {
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

        nameManager.getName(legalName, Blockly.Names.NameType.PROCEDURE);
      });

      // Then create options with sanitized safe names
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

        const safeName = nameManager.safeName(legalName);

        return [procName, safeName]; // show original name, store sanitized safe name
      });

      return options.length > 0 ? options : [["<no functions>", ""]];
    });
  }
}

export const componentFunctionRef = {
  init: function () {
    this.appendDummyInput()
      .appendField("Component function named:")
      .appendField(new FieldFunctionDropdown(this.workspace), "FUNC_NAME");
    this.setOutput(true, "ComponentFunction");
    this.setColour(230);
  },
};

export const elementBlock = {
  init: function () {
    this.attributes = [];
    this.tagName = "div";

    // this.appendDummyInput("TAG_LINE")
    //   .appendField("Element with tag")
    //   .appendField(new Blockly.FieldTextInput(this.tagName), "TAGNAME");
    this.appendValueInput("TAG")
      .setCheck(["String", "ComponentFunction"])
      .appendField("Element with tag");

    this.updateShape();

    this.setOutput(true, "HTMLElement");
    this.setMutator(
      new Blockly.icons.MutatorIcon(["element_attribute_item"], this),
    );
    this.setColour(225);
  },

  saveExtraState: function () {
    return {
      attributes: this.attributes,
    };
  },

  loadExtraState: function (state) {
    this.attributes = state.attributes || [];
    this.updateShape();
  },

  decompose: function (workspace) {
    const containerBlock = workspace.newBlock("element_container");
    containerBlock.initSvg();
    containerBlock.setFieldValue(this.getFieldValue("TAGNAME"), "TAGNAME");

    let connection = containerBlock.getInput("STACK").connection;

    for (const attr of this.attributes) {
      const itemBlock = workspace.newBlock("element_attribute_item");
      itemBlock.initSvg();
      itemBlock.setFieldValue(attr, "NAME");
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }

    return containerBlock;
  },

  compose: function (containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock("STACK");
    const newAttributes = [];
    const connections = [];

    while (itemBlock) {
      const name = itemBlock.getFieldValue("NAME");
      newAttributes.push(name);
      connections.push(itemBlock.valueConnection_);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    for (let i = 0; i < this.attributes.length; i++) {
      const input = this.getInput("ATTR_" + i);
      if (input && input.connection && input.connection.targetConnection) {
        input.connection.targetConnection.disconnect();
      }
    }

    this.attributes = newAttributes;
    this.updateShape();

    // Reconnect preserved connections
    for (let i = 0; i < this.attributes.length; i++) {
      if (connections[i]) {
        connections[i].reconnect(this, "ATTR_" + i);
      }
    }
  },

  saveConnections: function (containerBlock) {
    let itemBlock = containerBlock.getInputTargetBlock("STACK");
    let i = 0;
    while (itemBlock) {
      const input = this.getInput("ATTR_" + i);
      if (input && input.connection) {
        itemBlock.valueConnection_ = input.connection.targetConnection;
      }
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      i++;
    }
  },

  updateShape: function () {
    let i = 0;
    while (this.getInput("ATTR_" + i)) {
      this.removeInput("ATTR_" + i);
      i++;
    }

    for (let i = 0; i < this.attributes.length; i++) {
      const input = this.appendValueInput("ATTR_" + i).setCheck("String");
      input.appendField(this.attributes[i]);
    }
  },
};
export const elementContainerBlock = {
  init: function () {
    this.setColour(225);
    this.appendDummyInput("TAGNAME")
      .appendField("Element with tag")
      .appendField(new Blockly.FieldLabelSerializable("div"), "TAGNAME");
    this.appendStatementInput("STACK").setCheck(null);
    this.setTooltip("Add attributes for this element.");
    this.setHelpUrl("");
  },
};

export const elementAttributeItemBlock = {
  init: function () {
    this.setColour(225);
    this.appendDummyInput()
      .appendField("Attribute")
      .appendField(new Blockly.FieldTextInput("name"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

export default {
  element_block: elementBlock,
  element_container: elementContainerBlock,
  element_attribute_item: elementAttributeItemBlock,
  element_attribute_item_block: elementAttributeItemBlock,
  component_function_ref: componentFunctionRef,
};
