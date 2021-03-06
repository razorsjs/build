// common plugin
import path from "path"
import typescript from "rollup-plugin-typescript2";
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
// for .json
import json from '@rollup/plugin-json';
// node externals
import externals from 'rollup-plugin-node-externals'
// preserve-shebang for: #!/usr/bin/env node
import shebang from 'rollup-plugin-preserve-shebang';
// minify generated es bundle
import { terser } from "rollup-plugin-terser";
/**
 * for vue sfc
 */
// for SFC loader
import VuePlugin from 'rollup-plugin-vue'
// for resolve .vue
import resolve from '@rollup/plugin-node-resolve'
// extract css for vue SFC
import css from 'rollup-plugin-css-only'

const packagesPath = path.join(process.cwd(), './packages')

const isObject = (o) => {
  Object.prototype.toString.call(o) === '[Object Object]'
}

// merge options for babel, etc..
const merge = (origin, remote) =>{
  const result = {}
  Object.keys(origin).forEach(key => {
    if(remote[key] !== undefined) {
      const o = origin[key]
      const r = remote[key]
      // only object and array need handled
      if(Array.isArray(o) && Array.isArray(r)) {
        result[key] = o.concat(r)
      } else if(isObject(o) && isObject(r)) {
        result[key] = merge(o, r)
      } else {
        result[key] = remote[key]
      }
    } else {
      result[key] = origin[key]
    }
  })
  Object.keys(remote).forEach(key => {
    if(!origin[key]) {
      result[key] = remote[key]
    }
  })
  return result
}

const defaultOptions = {
  target: 'es',
  // use ts
  useTypescript: true,
  // use SFC vue
  useVue: false,
  // use react
  useReact: false,
  exports: 'named',
  external: []
}

export default function(pkg, options = defaultOptions, pluginOptions= {
  babel: {}
}) {
  options = merge(defaultOptions, options)
  let {name, dependencies} = pkg
  const {target, useTypescript, useVue, useReact, exports} = options
  const {babel: babelOptions} = pluginOptions

  //TODO: check tsconfig.json

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

  const _resolveOptions = {
    extensions: []
  }

  const presets = [
      ["@babel/preset-env", babelPresetOptions]
  ];

  const babelPlugins = [];

  const _babelOptions = {
    babelrc: false,
    configFile: false,
    babelHelpers: 'bundled',
    extensions: ['.js', '.tsx', '.ts', 'jsx'],
    presets,
    plugins: babelPlugins
  }

  if(useVue) {
    _resolveOptions.extensions.push('.vue')
    _babelOptions.extensions.push('.vue')
    presets[0][0] = '@vue/babel-preset-app'
  }

  if(useReact) {
    presets.push(["@babel/preset-react", {}])
  }

  const plugins = [
    json(),
    shebang(),
    externals({
      builtins: true
    }),
    useVue ? css() : null,
    resolve(_resolveOptions),
    useTypescript ? typescript({
      exclude: "node_modules/**",
      // find tsconfig in every package
      tsconfig: path.join(rootDir, 'tsconfig.json')
    }) : null,
    commonjs(),
    useVue ? VuePlugin({css: false}) : null,
    babel(merge(_babelOptions, babelOptions)),
    terser()
  ]
  const defaultInput = useTypescript ?'index.ts' :'index.js'
  const defaultOutput = `index.${target}.js`

  const input = path.join(rootDir, options.input ? options.input : defaultInput)
  const output = path.resolve(rootDir, `dist/${ options.output ? options.output : defaultOutput}`)

  let external = dependencies ? Object.keys(dependencies) : []
  external = external.concat(options.external)

  if(isCjs) {
    return {
      plugins,
      input,
      external,
      output: {
        file: output,
        format: target,
        exports,
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
        file: output,
        format: target,
        sourcemap: true
      }
    }
  }
}
