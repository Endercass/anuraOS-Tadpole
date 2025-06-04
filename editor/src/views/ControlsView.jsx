const { selectFolder } = await anura.import("anura.filepicker");

export default function ControlsView() {
  this.css = `
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    flex-grow: 1;
    background-color: #f9f9f9;
    padding: 16px;

    .controls-panel {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 16px;
        gap: 8px;
    }

    .control {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }

    .control-button {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .control-button:hover {
        background-color: #0056b3;
    }

    .control-value {
        font-size: 14px;
        color: #333;
    }
`;
  this.openedFolder ??= null;

  return (
    <main>
      <div class="controls-panel">
        <div class="control">
          <button
            class="control-button"
            on:click={async () => {
              const folder = await selectFolder({
                app: instance,
              });
              this.openedFolder = folder ?? null;
            }}
          >
            Open Folder
          </button>
          <span class="control-value">{use(this.openedFolder)}</span>
        </div>

        {/* Add your controls here */}
      </div>
    </main>
  );
}
