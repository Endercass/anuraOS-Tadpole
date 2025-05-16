import settings from "./settings.js";

const app = document.getElementById("app");

app.appendChild(
  <div>
    <h1>{settings.title}</h1>
    <p>
      This is a simple anuraOS dreamland app that uses the Tadpole learning
      toolkit.
    </p>
    <p>
      Note: this is not yet dynamically loading anything except for the app
      title. This is just a test to get the bundler working
    </p>
  </div>,
);

export { default as settings } from "./settings.js";
