const fs = require('fs')
const path = require('path')
const { execSync: exec } = require('child_process')

const examplesPath = path.resolve('examples')

const examples = fs
  .readdirSync(examplesPath)
  .filter(dir => fs.statSync(path.join(examplesPath, dir)).isDirectory())

for (let example of examples) {
  example = path.join(examplesPath, example)
  exec('npm uninstall react-easy-params', {
    cwd: example,
    stdio: 'inherit'
  })
  exec('npm install react-easy-params', {
    cwd: example,
    stdio: 'inherit'
  })
}
