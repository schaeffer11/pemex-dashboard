import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'

let pkg = require('./package.json')
let external = Object.keys(pkg.dependencies)

export default {
  entry: 'server/index.js',
  plugins: [
    json(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [ [ 'es2015', { modules: false } ], 'stage-0' ],
      plugins: [ 'external-helpers' ]
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') })
  ],
  external: [
    ...external,
    'regenerator-runtime/runtime',
    'crypto',
  ],
  targets: [
    {
      dest: pkg['main'],
      format: 'cjs',
      sourceMap: true
    }
  ]
}
