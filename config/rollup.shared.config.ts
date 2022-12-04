import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export const createPackageRollupConfig = () => ({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    resolve({
      moduleDirectories: ['node_modules']
    })
  ],
  external: ['react']
});
