import esbuild from "esbuild";
import { builtinModules } from "node:module";
import { copyFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const prod = process.argv[2] === "production";

// Watch mode only: if OBSIDIAN_PLUGIN_DIR points at a plugin folder in a vault,
// mirror the build outputs there and touch ".hotreload" after every rebuild so
// the hot-reload plugin picks the change up. Never used by the production build.
const vaultDir = !prod && process.env.OBSIDIAN_PLUGIN_DIR;
const mirrorPlugin = {
  name: "mirror-to-vault",
  setup(build) {
    build.onEnd((result) => {
      if (!vaultDir || result.errors.length) return;
      try {
        for (const f of ["main.js", "manifest.json", "styles.css"]) {
          if (existsSync(f)) copyFileSync(f, join(vaultDir, f));
        }
        writeFileSync(join(vaultDir, ".hotreload"), "");
        console.log(`[mirror] -> ${vaultDir}`);
      } catch (e) {
        console.error("[mirror] failed:", e.message);
      }
    });
  },
};

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian", "electron", ...builtinModules],
  format: "cjs",
  target: "es2018",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  outfile: "main.js",
  minify: prod,
  plugins: vaultDir ? [mirrorPlugin] : [],
});

if (prod) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
  if (vaultDir) console.log(`Watching + mirroring to ${vaultDir}`);
}
