import type { Db } from 'mongodb';
import { SchemaName } from '../../common/enums/schema';

export = {
  async up(db: Db) {
    await db.collection(SchemaName.PRODUCT_DRAFT).createIndexes([{ name: 'product_draft_user_id', key: { 'userId': 1 } }]);
  },

  async down(db: Db) {
    await db.collection(SchemaName.PRODUCT_DRAFT).dropIndex('product_draft_user_id');
  },
};
