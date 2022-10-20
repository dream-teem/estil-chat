import type { Db } from 'mongodb';
import { SchemaName } from '../../common/interfaces/schema';

export = {
  async up(db: Db) {
    await db.collection(SchemaName.CHAT).createIndexes([
      { name: 'chat_members_user_id', key: { "members.userId": 1 } },
      { name: 'chat_messages_timestamp',  key: { "messages.timestamp": -1 } },
      { name: 'chat_last_message_timestamp', key: { lastMessageTimestamp: 1 } },
    ]);
  },

  async down(db: Db) {
    await db.collection(SchemaName.CHAT).dropIndex('chat_members_user_id');
    await db.collection(SchemaName.CHAT).dropIndex('chat_messages_timestamp');
    await db.collection(SchemaName.CHAT).dropIndex('chat_last_message_timestamp');
  },
};
