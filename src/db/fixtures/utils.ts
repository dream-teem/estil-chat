import type { QueryRunner } from 'typeorm';

export const fixSequence = (queryRunner: QueryRunner, tables: string[]) => {
  const queries = tables.map((table) =>
    queryRunner.query(`SELECT setval(PG_GET_SERIAL_SEQUENCE('"${table}"', 'id'), (SELECT MAX(id) FROM "${table}")+1)`),
  );

  return Promise.all(queries);
};
