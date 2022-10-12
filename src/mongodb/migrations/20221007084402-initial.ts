import type { Db } from 'mongodb';
import { SchemaName } from '../../common/interfaces/schema';

export = {
  async up(db: Db) {
    await db.collection(SchemaName.CHAT).createIndexes([
      { name: 'chat_members', key: { "members.userId": 1 }, unique: true, },
      { name: 'chat_messages',  key: { "messages.timestamp": -1 } },
      { name: 'chat_last_message_timestamp', key: { lastMessageTimestamp: 1 } },
    ]);
  },

  async down(db: Db) {
    await db.collection(SchemaName.CHAT).dropIndex('category_name');
    await db.collection(SchemaName.CHAT).dropIndex('category_path');
    await db.collection(SchemaName.CHAT).dropIndex('category_order');
  },
};
