const config = {
  mongodb: {
    url: process.env['MONGO_DB_URL'] || 'mongodb://localhost:27017',

    databaseName: process.env['MONGO_DB_NAME'],

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
    },
  },

  migrationsDir: __dirname + '/migrations',

  changelogCollectionName: 'changelog',

  migrationFileExtension: '.ts',

  useFileHash: false,

  moduleSystem: 'commonjs',
};

module.exports = config