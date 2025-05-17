import BlocklyComponent from "./BlocklyDiv";
import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";
import defs from "./blocks";

Blockly.common.defineBlocks(defs);

javascriptGenerator.forBlock["element_block"] = function (block) {
  // Get code from TAG input (can be string or function reference)
  let tagCode = javascriptGenerator.valueToCode(block, "TAG", Order.NONE);

  // Fallback default to string 'div'
  if (!tagCode) {
    tagCode = '"div"';
  }

  const attributes = [];
  for (let i = 0; i < block.attributes.length; i++) {
    const name = block.attributes[i];
    const valueCode =
      javascriptGenerator.valueToCode(block, "ATTR_" + i, Order.NONE) || '""';
    attributes.push(`${JSON.stringify(name)}: ${valueCode}`);
  }

  const attrObject = `{ ${attributes.join(", ")} }`;

  const code = `h(${tagCode}, ${attrObject})`;

  return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock["component_function_ref"] = function (block) {
  const funcName = block.getFieldValue("FUNC_NAME");
  // Just output the function name as identifier (no quotes)
  return [funcName || "undefined", Order.ATOMIC];
};

function App() {
  this.css = `
    display: flex;
    width: 100%;
    max-width: 100vw;
    height: 100vh;
    font-family: sans-serif;
  
    .blockly-panel {
        flex-basis: 100%;
        height: 100%;
        min-width: 600px;
    }

    .preview-panel {

        height: 100%;
    }
    `;

  return (
    <div>
      <div class="blockly-panel">
        <BlocklyComponent
          onCodeChange={(code) => {
            console.log(code);
            const previewCode = document.querySelector(".preview-code");
            previewCode.textContent = code;
          }}
        >
          <category name="Logic" colour="210">
            <block type="controls_if" />
            <block type="logic_compare" />
            <block type="logic_operation" />
            <block type="logic_negate" />
            <block type="logic_boolean" />
            <block type="logic_null" />
            <block type="logic_ternary" />
          </category>
          <category name="Functions" colour="290">
            <block type="procedures_defnoreturn" />
            <block type="procedures_defreturn" />
            <block type="procedures_ifreturn" />
            <block type="procedures_callnoreturn" />
            <block type="procedures_callreturn" />
          </category>
          <category name="JSX" colour="120">
            <block type="element_block" />
            <block type="component_function_ref" />
          </category>
        </BlocklyComponent>
      </div>
      <div class="preview-panel">
        <iframe src="about:blank" />
        <pre class="preview-code"></pre>
      </div>
    </div>
  );
}

document.body.appendChild(<App />);
