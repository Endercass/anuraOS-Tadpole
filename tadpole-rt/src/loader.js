import { components } from "./paths";
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
        try {
          const mod = await import(
            new URL(`./src/components/${load.path}`, import.meta.url)
          );

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
        } catch (e) {
          console.error(
            `[ERROR] <tadpole-rt> Failed to load component ${load.path}: ${e}\nThis is not a fatal error, but the component will not be available.`,
          );
          load.error = e;
        }
      } else if (load.path.endsWith(".jsx")) {
        console.warn(
          `[WARNING] <tadpole-rt> Component ${load.path} is a JSX file. This is not supported yet. Please use .js files instead.`,
        );
      }
    }
  }
}

const loader = new ComponentLoader();
export { loader as componentLoader };
