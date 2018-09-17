import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
const pkg = require('./package.json')

const external = Object.keys(pkg.dependencies)

export default {
  entry: 'server/index.js',
  plugins: [
    json(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  ],
  external: [
    ...external,
    'crypto',
  ],
  targets: [
    {
      dest: pkg.main,
      format: 'cjs',
      sourceMap: true,
    },
  ],
}
