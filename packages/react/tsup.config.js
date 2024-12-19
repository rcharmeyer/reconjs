// @ts-check

import { defineConfig } from 'tsup'
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions'

/**
 * @param {Object} opts - Options for building configurations.
 * @param {string[]} opts.entry - The entry array.
 * @returns {import('tsup').Options}
 */
function modernConfig(opts) {
  return {
    entry: opts.entry,
    format: ['cjs', 'esm'],
    target: ['chrome91', 'firefox90', 'edge91', 'safari15', 'ios15', 'opera77'],
    outDir: 'build/modern',
    dts: true,
    sourcemap: true,
    clean: true,
    esbuildPlugins: [
      // I don't know why this is breaking the build...
      // @ts-expect-error
      esbuildPluginFilePathExtensions({ esmExtension: 'js' })
    ],
  }
}

export default defineConfig([
  modernConfig({ entry: ['src/*.ts', 'src/*.tsx'] }),
])