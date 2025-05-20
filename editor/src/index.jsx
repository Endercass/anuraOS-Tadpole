import BlocklyComponent from "./BlocklyDiv";
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import { defs, js } from "../../dreamland-blocks/index";

Blockly.common.defineBlocks(defs);
Object.assign(javascriptGenerator.forBlock, js);

const url = new URL(window.location.href);
const argv = ExternalApp.deserializeArgs(url.searchParams.get("args"));

let preload = null;

if (argv?.[0]?.startsWith("/")) {
  try {
    const data = await anura.fs.promises.readFile(argv[0]);
    preload = JSON.parse(data.toString());
  } catch (e) {
    console.error(
      `[ERROR] <tadpole-rt> Failed to preload workspace: ${e}\nThis is not a fatal error, but the workspace will be empty.`,
    );
  }
}

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
          preload={preload}
          onCodeChange={(code) => {
            console.log(code);
            const previewCode = document.querySelector(".preview-code");
            previewCode.textContent = code;
          }}
        >
          <category name="Logic" colour="210">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_negate"></block>
            <block type="logic_boolean"></block>
            <block type="logic_null"></block>
            <block type="logic_ternary"></block>
          </category>

          <category name="Loops" colour="120">
            <block type="controls_repeat_ext">
              <value name="TIMES">
                <block type="math_number">
                  <field name="NUM">5</field>
                </block>
              </value>
            </block>
            <block type="controls_for">
              <field name="VAR">i</field>
              <value name="FROM">
                <block type="math_number">
                  <field name="NUM">0</field>
                </block>
              </value>
              <value name="TO">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
              <value name="BY">
                <block type="math_number">
                  <field name="NUM">1</field>
                </block>
              </value>
            </block>
            <block type="controls_forEach">
              <field name="VAR">item</field>
            </block>
            <block type="controls_whileUntil"></block>
          </category>

          <category name="Math" colour="230">
            <block type="math_number"></block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
            <block type="math_trig"></block>
            <block type="math_constant"></block>
            <block type="math_number_property"></block>
            <block type="math_round"></block>
            <block type="math_on_list"></block>
            <block type="math_modulo"></block>
            <block type="math_constrain"></block>
            <block type="math_random_int"></block>
            <block type="math_random_float"></block>
          </category>

          <category name="Text" colour="160">
            <block type="text"></block>
            <block type="text_join"></block>
            <block type="text_append">
              <field name="VAR">item</field>
            </block>
            <block type="text_length"></block>
            <block type="text_isEmpty"></block>
            <block type="text_indexOf"></block>
            <block type="text_charAt"></block>
            <block type="text_getSubstring"></block>
            <block type="text_changeCase"></block>
            <block type="text_trim"></block>
            <block type="text_print"></block>
            <block type="text_prompt_ext">
              <value name="TEXT">
                <block type="text"></block>
              </value>
            </block>
          </category>

          <category name="Lists" colour="260">
            <block type="lists_create_empty"></block>
            <block type="lists_create_with"></block>
            <block type="lists_repeat"></block>
            <block type="lists_length"></block>
            <block type="lists_isEmpty"></block>
            <block type="lists_indexOf"></block>
            <block type="lists_getIndex"></block>
            <block type="lists_setIndex"></block>
            <block type="lists_getSublist"></block>
            <block type="lists_split"></block>
            <block type="lists_sort"></block>
            <block type="lists_reverse"></block>
          </category>

          <category name="Variables" colour="330" custom="VARIABLE"></category>

          <category
            name="Functions"
            colour="290"
            custom="DL_PROCEDURE"
          ></category>

          <category name="UI" colour="120">
            <block type="element_block">
              <value name="TAG">
                <block type="text">
                  <field name="TEXT">div</field>
                </block>
              </value>
            </block>
            <block type="attribute_reference_block">
              <value name="NAME">
                <block type="text">
                  <field name="TEXT">class</field>
                </block>
              </value>
            </block>
            <block type="deref_block"></block>
            <block type="use_block"></block>
          </category>
          <category name="Modules" colour="290">
            <block type="export_var_block"></block>
            <block type="export_const_block"></block>
            <block type="export_function_block">
              <value name="FUNC_NAME">
                <block type="procedures_ref"></block>
              </value>
            </block>
            <block type="import_named_component_block">
              <value name="IMPORT_NAME">
                <block type="text">
                  <field name="TEXT">Component</field>
                </block>
              </value>
            </block>
          </category>
        </BlocklyComponent>
      </div>
      <div class="preview-panel" style="color: #fff;">
        <iframe src="about:blank" />
        <pre class="preview-code"></pre>
      </div>
    </div>
  );
}

document.body.appendChild(<App />);
