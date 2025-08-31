import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const config = {
  input: "src/index.js",
  output: {
    esModule: true,
    file: "dist/index.js",
    format: "es",
    sourcemap: true
  },
  plugins: [
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    alias({
      entries: [
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: '@sf', replacement: path.resolve(__dirname, 'src/sf') },
        { find: '@ui', replacement: path.resolve(__dirname, 'src/ui') }
      ]
    }),
  ],
};

export default config;
