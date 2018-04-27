const database = require('../../config/database');

const dbService = (environment, migrate) => {
  const authenticateDB = async () => database.authenticate();
  const dropDB = async () => database.drop();
  const syncDB = async () => database.sync();

  const successfulDBStart = () => (
    console.info('INFO: Connection to the database has been established successfully!')
  );

  const errorDBStart = (err) => (
    console.error('ERROR: Unable to connect to the database:', err)
  );

  const wrongEnvironment = () => {
    console.warn(`WARNING: Wrong NODE_ENV specified! Only "development", "testing", "staging", and "production" are valid but specified NODE_ENV: "${environment}"!`);
    return process.exit(1);
  };

  const startMigrateTrue = async () => {
    try {
      await syncDB();
      successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startMigrateFalse = async () => {
    try {
      await dropDB();
      await syncDB();
      await successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startDev = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        await startMigrateTrue();
      } else {
        await startMigrateFalse();
      }
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startStage = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        await startMigrateTrue();
      } else {
        await startMigrateFalse();
      }
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startTest = async () => {
    try {
      await authenticateDB();
      await startMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startProd = async () => {
    try {
      await authenticateDB();
      await startMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const start = async () => {
    switch (environment) {
      case 'development':
        await startDev();
        break;
      case 'staging':
        await startStage();
        break;
      case 'testing':
        await startTest();
        break;
      case 'production':
        await startProd();
        break;
      default:
        await wrongEnvironment();
        break;
    }
  };

  return {
    start,
  };
};

module.exports = dbService;
