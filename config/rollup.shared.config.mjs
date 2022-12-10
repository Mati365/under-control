/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import { externals } from 'rollup-plugin-node-externals';
import { uglify } from 'rollup-plugin-uglify';

export const createPackageRollupConfig = ({ outDir = 'dist' } = {}) => ({
  input: 'src/index.ts',
  output: [
    {
      file: path.join(outDir, 'index.js'),
      format: 'cjs',
    },
  ],
  plugins: [
    del({
      targets: path.join(outDir, '*'),
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declarationDir: './',
    }),
    externals(),
    resolve({
      moduleDirectories: ['node_modules'],
    }),
    uglify(),
  ],
  external: ['react'],
});
