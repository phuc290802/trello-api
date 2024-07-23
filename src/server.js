import express from 'express'
import exitHook from 'async-exit-hook'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { CONNECT_DB, GET_DB, CLOSE_DB } from './config/mongodb'
import { env } from '~/config/environment'
import { APIs_v1 } from './routes/v1/index'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express();
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_v1);

  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Hello ${env.AUTHOR}, I am running at ${env.APP_HOST}:${env.APP_PORT}/`);
  });

  exitHook(() => {
    console.log('Shutting down');
    CLOSE_DB().then(() => {
      console.log('Disconnected from database');
      process.exit(0);
    }).catch((error) => {
      console.error('Error disconnecting from database:', error);
      process.exit(1);
    });
  });
};

CONNECT_DB()
  .then(() => {
    console.log('Connected to MongoDB Cloud Atlas!');
    START_SERVER();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });
