import type { MigrationInterface, QueryRunner } from "typeorm";

export class userPicture1667737819608 implements MigrationInterface {
    name = 'userPicture1667737819608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "picture"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "picture" jsonb`);
        await queryRunner.query(`ALTER TYPE "public"."paybox_event_type_enum" RENAME TO "paybox_event_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."paybox_event_type_enum" AS ENUM('check', 'charge')`);
        await queryRunner.query(`ALTER TABLE "paybox_event" ALTER COLUMN "type" TYPE "public"."paybox_event_type_enum" USING "type"::"text"::"public"."paybox_event_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."paybox_event_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."paybox_event_type_enum_old" AS ENUM('charge', 'refund', 'payout')`);
        await queryRunner.query(`ALTER TABLE "paybox_event" ALTER COLUMN "type" TYPE "public"."paybox_event_type_enum_old" USING "type"::"text"::"public"."paybox_event_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."paybox_event_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."paybox_event_type_enum_old" RENAME TO "paybox_event_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "picture"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "picture" character varying`);
    }

}
