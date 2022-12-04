/* eslint-disable @typescript-eslint/explicit-function-return-type, import/no-extraneous-dependencies */
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export const createPackageRollupConfig = () => ({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    resolve({
      moduleDirectories: ['node_modules'],
    }),
  ],
  external: ['react'],
});
