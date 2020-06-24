import {rollupConfigure} from '../packages/build-rollup/index';
import rollupBuild from '../packages/build-rollup/package.json';
import babelBuild from '../packages/build-babel/package.json';
import jestBuild from '../packages/build-jest/package.json'

export default [
  rollupConfigure(babelBuild, {
    target: 'cjs',
    useTypescript: false,
    named: 'default'
  }),
  rollupConfigure(rollupBuild, {
    target: 'cjs',
    useTypescript: false,
    named: 'default'
  }),
  rollupConfigure(jestBuild, {
    target: 'cjs',
    useTypescript: false
  }),
]
