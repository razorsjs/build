import {rollupConfigure} from '../packages/build-rollup/index';
import rollupBuild from '../packages/build-rollup/package.json';
import babelBuild from '../packages/build-babel/package.json'

export default [
  rollupConfigure(babelBuild, {
    target: 'cjs',
    useTypescript: false
  }),
  rollupConfigure(rollupBuild, {
    target: 'cjs',
    useTypescript: false
  }),
]
