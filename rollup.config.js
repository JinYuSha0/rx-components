"use strict";

import path from "path";
import pkg from "./package.json" assert { type: "json" };
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";

const common = {
  input: "components/index.ts",
};

// extensions: [...Object.keys(pkg.peerDependencies || {})],

const getOutput = (format = "esm") => {
  if (format === "esm") {
    return { dir: path.dirname(pkg.module), format, preserveModules: true };
  }
  return { dir: path.dirname(pkg.main), format, preserveModules: true };
};

const getPlugins = (format = "esm") => {
  const plugins = [
    esbuild({
      include: /\.[jt]sx?$/,
      exclude: /node_modules/,
      sourceMap: process.env.NODE_ENV === "production",
      minify: process.env.NODE_ENV === "production",
      target: "esnext", // default, or 'es20XX', 'esnext'
      jsx: "transform", // default, or 'preserve'
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
      define: {
        __VERSION__: `"${pkg.version}"`,
      },
      tsconfig: "./tsconfig.json",
      loaders: {
        ".json": "json",
        ".js": "jsx",
      },
    }),
  ];

  return plugins;
};

const dtsBundle = (format = "esm") => ({
  input: common.input,
  output: getOutput(format),
  plugins: [dts()],
});

export default [
  {
    ...common,
    plugins: getPlugins(),
    output: getOutput(),
  },
  {
    ...common,
    plugins: getPlugins("cjs"),
    output: getOutput("cjs"),
  },
  dtsBundle(),
  dtsBundle("cjs"),
];
