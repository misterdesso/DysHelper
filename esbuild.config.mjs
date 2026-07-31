import { build, context } from "esbuild";
import { cpSync, rmSync } from "fs";

const isWatch = process.argv.includes("--watch");

const buildOptions = {
  entryPoints: [
    "src/background.js",
    "src/content/content.js",
    "src/popup/popup.js",
    "src/ocr/ocr-result.js",
  ],
  bundle: true,
  outdir: "dist",
  outbase: "src",
  format: "iife",
  target: "chrome120",
  platform: "browser",
  sourcemap: isWatch,
  minify: !isWatch,
};

function copyStatic() {
  rmSync("dist", { recursive: true, force: true });

  cpSync("static", "dist", { recursive: true });

  cpSync("src/content/styles.css", "dist/content/styles.css");
  cpSync("src/popup/popup.html", "dist/popup/popup.html");
  cpSync("src/popup/popup.css", "dist/popup/popup.css");
  cpSync("src/ocr/ocr-result.html", "dist/ocr/ocr-result.html");
  cpSync(
    "node_modules/tesseract.js/dist/worker.min.js",
    "dist/ocr/tesseract-worker.js",
  );
  cpSync("node_modules/tesseract.js-core", "dist/ocr/tesseract-core", {
    recursive: true,
    filter: (src) => src.endsWith("tesseract.js-core") || src.endsWith(".wasm.js"),
  });
}

copyStatic();

if (isWatch) {
  const ctx = await context(buildOptions);
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await build(buildOptions);
  console.log("Build complete.");
}
