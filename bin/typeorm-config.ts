/// <reference types="../typings/global" />
import path from 'path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { configuration } from '../src/config';

dotenv.config({ path: path.join(__dirname, '../.env') });

const ormconfig = async (): Promise<DataSource> => {
  const config = <{ db: DataSourceOptions }>await configuration();

  return new DataSource({
    ...config.db,
    entities: [`${__dirname}/../src/modules/**/*.entity.{js,ts}`],
    migrations: [`${__dirname}/../src/db/typeorm-migrations/**/*.{js,ts}`],
  });
};

export default ormconfig();
