import type { Db } from 'mongodb';
import { SchemaName } from '../../common/interfaces/schema';

export = {
  async up(db: Db) {
    await db.collection(SchemaName.CHAT).createIndexes([{ name: 'chat_product_id', key: { 'product.productId': 1 } }]);
  },

  async down(db: Db) {
    await db.collection(SchemaName.CHAT).dropIndex('chat_product_id');
  },
};
