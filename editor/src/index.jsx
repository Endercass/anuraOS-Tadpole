import Header from "./components/Header";
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import { defs, js } from "../../dreamland-blocks/index";
import EditorView from "./views/EditorView";
import ControlsView from "./views/ControlsView";

Blockly.common.defineBlocks(defs);
Object.assign(javascriptGenerator.forBlock, js);

const url = new URL(window.location.href);
const argv = ExternalApp.deserializeArgs(url.searchParams.get("args"));

let preload = null;

if (argv?.[0]?.startsWith("/")) {
  preload = argv[0];
}

function viewToName(view) {
  switch (view) {
    case "editor":
      return "Editor";
    case "controls":
      return "Controls";
    default:
      return "Unknown";
  }
}

function App() {
  this.css = `
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100vw;
    height: 100vh;
    `;

  this.view ??= "controls";
  this.openedFolder ??= preload;

  return (
    <div>
      <Header
        pageName={use(this.view, viewToName)}
        bind:openedFolder={use(this.openedFolder)}
        bind:view={use(this.view)}
      />
      {use(this.view, (view) => {
        switch (view) {
          case "editor":
            return <EditorView bind:openedFolder={use(this.openedFolder)} />;
          case "controls":
            return <ControlsView bind:openedFolder={use(this.openedFolder)} />;
          default:
            return <div>Unknown View</div>;
        }
      })}
    </div>
  );
}

document.body.appendChild(<App />);
