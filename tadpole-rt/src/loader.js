import { basepath, components } from "./paths";
import { modules } from "./externs.js";
import { compile } from "./compiler.js";
import { registerComponent } from "./registry.js";

class ComponentLoader {
  constructor() {
    this.loads = [];
  }

  async load() {
    try {
      const files = await anura.fs.promises.readdir(components);
      for (const file of files) {
        this.loads.push({ path: file });
      }
    } catch (_) {
      console.info(
        "[INFO] <tadpole-rt> No code components found. This can be ignored if this is a block-only app.",
      );
      return;
    }

    for (const load of this.loads) {
      if (load.path.endsWith(".js")) {
        const url = new URL(`./src/components/${load.path}`, import.meta.url);
        this.importModule(url, load);
      } else if (load.path.endsWith(".jsx")) {
        try {
          const code = (
            await anura.fs.promises.readFile(
              basepath + "/src/components/" + load.path,
            )
          ).toString();

          const compiled = await compile(code);
          const blobUrl = URL.createObjectURL(
            new Blob([compiled], { type: "application/javascript" }),
          );

          this.importModule(blobUrl, load, true);
        } catch (e) {
          console.error(
            `[ERROR] <tadpole-rt> Failed to compile component ${load.path}: ${e}\nThis is not a fatal error, but the component will not be available.`,
          );
          load.error = e;
        }
      }

      for (const mod of modules) {
        if (
          mod.extensions &&
          mod.extensions.some((ext) => load.path.endsWith(ext))
        ) {
          try {
            await mod.handle(basepath, load);
          } catch (e) {
            console.error(
              `[ERROR] <tadpole-rt> Failed to load component ${load.name} with extension ${mod.path}: ${e}\nThis is not a fatal error, but the component will not be available.`,
            );
            load.error = e;
          }
        }
      }
    }
  }

  importModule(url, load, isBlob = false) {
    import(url)
      .then((mod) => {
        if (isBlob) URL.revokeObjectURL(url);
        this.handleModuleImport(load, mod);
      })
      .catch((e) => {
        if (isBlob) URL.revokeObjectURL(url);
        console.error(
          `[ERROR] <tadpole-rt> Failed to load component ${load.path}: ${e}\nThis is not a fatal error, but the component will not be available.`,
        );
        load.error = e;
      });
  }

  handleModuleImport(load, mod) {
    if (mod.default) {
      load.name =
        mod.name || mod.default.name || load.path.replace(/\.jsx?$/, "");
      load.component = mod.default;
      registerComponent(load.name, load.component);
    } else {
      console.warn(
        `[WARNING] <tadpole-rt> Component ${load.path} does not export a default component. It will not be registered.`,
      );
    }
  }
}

export const componentLoader = new ComponentLoader();
