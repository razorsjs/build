module.exports = {
  publishCommand: ({ defaultCommand }) => `${defaultCommand} --access public`,
  monorepo: {
    mainVersionFile: 'lerna.json', // or `lerna.json`, or whatever a json file you can read the latest `version` from.
    packagesToBump: ['packages/*'],
    packagesToPublish: ['packages/*'],
  },
};
