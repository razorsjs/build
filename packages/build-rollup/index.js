// This is for sdk
import path from "path"
import typescript from "rollup-plugin-typescript2";
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
// for SFC loader
import VuePlugin from 'rollup-plugin-vue'
// for resolve .vue
import resolve from '@rollup/plugin-node-resolve'
// fro .json
import json from '@rollup/plugin-json';
// extract css
import css from 'rollup-plugin-css-only'
// node externals
import externals from 'rollup-plugin-node-externals'

const packagesPath = path.join(__dirname, '../packages')

export function rollupConfigure(pkg, options = {
  target: 'es',
  useTypescript: true,
  useVue: false
}) {
  let {name, dependencies} = pkg
  const {target, useTypescript, useVue} = options

  // solve namespace
  if(name.startsWith('@')) {
    name = name.split('/')[1]
  }

  const rootDir = path.join(packagesPath, name)
  const isCjs = target === 'cjs'
  const isEs = target === 'es'

  const babelPresetOptions = {
    modules: false,
    useBuiltIns: false,
    exclude: [
      '@babel/plugin-transform-regenerator',
      '@babel/transform-async-to-generator',
    ],
  }

  const resolveOptions = {
    extensions: []
  }

  const presets = [
      ["@babel/preset-env", babelPresetOptions]
  ];

  if(useVue) {
    resolveOptions.extensions.push('.vue')
    presets[0][0] = '@vue/babel-preset-app'
  }

  const plugins = [
    json(),
    externals({
      builtins: true
    }),
    useVue ? css() : null,
    resolve(resolveOptions),
    useTypescript ? typescript({
      exclude: "node_modules/**"
    }) : null,
    commonjs(),
    useVue ? VuePlugin({css: false}) : null,
    babel({
      babelHelpers: 'bundled',
      extensions: ['.vue', '.js'],
      presets,
    })
  ]
  const input = path.join(rootDir, useTypescript ?'index.ts' :'index.js')
  const external = Object.keys(dependencies)

  if(isCjs) {
    return {
      plugins,
      input,
      external,
      output: {
        file: path.resolve(rootDir, `dist/index.${target}.js`),
        format: target,
        exports: 'named',
        sourcemap: true
      }
    }
  }

  if(isEs) {
    return {
      plugins,
      input,
      external,
      output: {
        file: path.resolve(rootDir, `dist/index.${target}.js`),
        format: target,
        sourcemap: true
      }
    }
  }
}
