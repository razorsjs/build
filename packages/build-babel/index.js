const getEnvPresets = (lib) => {
  switch (lib) {
    case 'vue':
      return "@vue/babel-preset-app"
    default:
      return "@babel/preset-env"
  }
}

// merge config
const merge = (local, remote) => {
  Object.keys(local).forEach(key=> {
    if(remote[key]) {
      local[key] = local[key].concat(remote[key])
    }
  })
  return local
}

module.exports= function(options = {
  lib: '',
  envConfig: {}
}, configure = {}) {
  const {lib, envConfig} = options

  const localConfigure = {
    "presets": [
      [getEnvPresets(lib), {useBuiltIns: false, ...envConfig}],
    ],
    "plugins": []
  }
  return merge(localConfigure, configure)
}
