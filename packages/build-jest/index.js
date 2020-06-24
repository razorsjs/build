export default function(options) {
  let localConfig = {
    moduleFileExtensions: [
      "js",
      "json"
    ],
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest"
    }
  }
  if(options.useVue){
    localConfig.moduleFileExtensions.push('vue')
    localConfig.transform = {
      ...localConfig.transform,
      ...{
        ".*\\.(vue)$": "vue-jest"
      }
    }
  }
  return localConfig
}
