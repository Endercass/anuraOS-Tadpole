export default function Header() {
  this.css = `
        display: flex;
        height: 48px;
        width: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 0 16px;
        background-color: #f0f0f0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        .branding {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 8px;
        }

        button {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
        }

        h1 {
            font-size: 16px;
            margin: 0;
            text-align: center;
        }
    `;

  this.pageName ??= "";
  this.view ??= "";

  return (
    <header class="freaking-header">
      <div class="branding">
        <button
          on:click={() => {
            // this.view = this.view === "editor" ? "controls" : "editor";
            switch (this.view) {
              case "editor":
                this.view = "controls";
                break;
              case "controls":
                if (this.openedFolder !== null) {
                  this.view = "editor";
                }
                break;
              default:
                this.view = "editor";
            }
          }}
        >
          {/* using the weird use`` template string hack to listen on multiple pointers */}
          {use(use`${this.view}${this.openedFolder}`, () => {
            switch (this.view) {
              case "editor":
                return "☰";
              case "controls":
                return this.openedFolder !== null ? ">" : "X";
              default:
                return ">";
            }
          })}
        </button>
        <h1>{use`Dreamland Blocks Editor${use(this.pageName, (name) =>
          name === "" ? name : " | " + name
        )}`}</h1>
      </div>
    </header>
  );
}
