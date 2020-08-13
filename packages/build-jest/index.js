export default function(options) {
  let localConfig = {}
  options = options || {}
  if(options.typescript) {
    localConfig.preset = 'ts-jest'
  }
  return localConfig
}
