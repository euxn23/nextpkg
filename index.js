'use strict'

const { promisify } = require('util')
const { exec } = require('child_process')
const semver = require('semver')

const execAsync = promisify(exec)

const alphaTag = 'alpha'
const rcTag = 'next'



async function main() {
  const preid = should
  const packageJson = require('./package.json')
  const { name } = packageJson
  if (!name) throw new Error()
  const { version } = packageJson
  if (!version) throw new Error()

  const { stdout } = await execAsync(`npm view ${name} version`)
  if (!stdout) console.log('old')
  if (semver.gt(stdout, version)) {
    console.log('new')
  } else {
    console.log('old')
    const { stdout: currentVersion } = await execAsync(`npm view ${name}@alpha`)
    if (currentVersion.match(/^\d+\.\d+\.\d+-rc.\d+$/)) {
      // not tag `next`
      await execAsync(`npm version`)
    }
    await execAsync(`npm version ${currentVersion}`)
  }
  await execAsync(`npm version prerelease --preid ${preid}`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
