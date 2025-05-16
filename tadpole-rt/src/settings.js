const manifest = await fetch(new URL("./manifest.json", import.meta.url)).then(
  (res) => res.json(),
);

const settings = Object.assign(
  {
    title: "Tadpole App",
    blocksEnabled: false,
    entrypoint: "App",
  },
  {
    title: manifest?.wininfo?.title,
    blocksEnabled: manifest?.["x-anura.tadpole"]?.["blocks-enabled"],
    entrypoint: manifest?.["x-anura.tadpole"]?.entrypoint,
  },
);

console.log("Tadpole App Settings:", settings);

export default settings;
