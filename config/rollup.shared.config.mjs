/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import { nodeExternals } from 'rollup-plugin-node-externals';

export const createPackageRollupConfig = ({ outDir = 'dist' } = {}) => ({
  input: 'src/index.ts',
  output: [
    {
      file: './dist/cjs/index.js',
      format: 'cjs',
    },
    {
      dir: './dist/esm',
      format: 'esm',
      preserveModules: true,
    },
  ],
  plugins: [
    del({
      targets: path.join(outDir, '*'),
    }),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ES2022',
          moduleResolution: 'node',
          declaration: true,
        },
        include: ['src/'],
        exclude: ['node_modules/', '**/*.test.tsx', '**/*.test.ts'],
      },
    }),
    nodeExternals(),
    resolve({
      moduleDirectories: ['node_modules'],
    }),
  ],
  external: ['react'],
});
