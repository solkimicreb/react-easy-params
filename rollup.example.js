import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: './src/example.js',
  output: {
    file: 'dist/example.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    babel()
  ]
}
