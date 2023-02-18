const { join } = require('path')
const { DeploymentBuilder } = require('@edgio/core/deploy')

module.exports = async () => {
  const builder = new DeploymentBuilder()
  builder.clearPreviousBuildOutput()
  await builder.exec('node scrape-petsmart.js')
  builder.addStaticAsset(join(process.cwd(), 'products'))
  await builder.build()
}
