import * as esbuild from "esbuild-wasm";
import { esbuildUrl as wasmURL } from "./paths";

await esbuild.initialize({
  worker: true,
  wasmURL,
});

export async function compile(code) {
  const result = await esbuild.transform(code, {
    loader: "jsx",
    target: "esnext",
    format: "esm",
    jsxFragment: "Fragment",
    jsxFactory: "h",
  });

  return result.code;
}
