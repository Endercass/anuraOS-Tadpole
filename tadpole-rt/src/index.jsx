import settings from "./settings.js";
import { componentLoader } from "./loader.js";
import { getComponent } from "./registry.js";

componentLoader.load().then(() => {
  console.info(
    "[INFO] <tadpole-rt> Component loader finished loading components.",
  );
});

const app = document.getElementById("app");

app.appendChild(
  await getComponent(settings.entrypoint).then((App) => {
    return <App />;
  }),
);

export { default as settings } from "./settings.js";
