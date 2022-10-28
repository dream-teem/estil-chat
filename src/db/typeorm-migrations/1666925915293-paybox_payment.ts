import type { MigrationInterface, QueryRunner } from "typeorm";

export class payboxPayment1666925915293 implements MigrationInterface {
    name = 'payboxPayment1666925915293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP CONSTRAINT "UQ_0d5766a885719f114935998ccb1"`);
        await queryRunner.query(`CREATE TYPE "public"."paybox_event_type_enum" AS ENUM('charge', 'refund', 'payout')`);
        await queryRunner.query(`CREATE TABLE "paybox_event" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "payboxId" character varying NOT NULL, "data" text NOT NULL, "type" "public"."paybox_event_type_enum" NOT NULL, "purchaseId" integer NOT NULL, CONSTRAINT "UQ_8c22a67542353535c8db8f1e034" UNIQUE ("payboxId", "purchaseId"), CONSTRAINT "PK_9568c2d9d4bea807e2099e5c43e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_status_enum"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP COLUMN "signature"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP COLUMN "salt"`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_paymentstatus_enum" AS ENUM('paid', 'pending', 'rejected', 'refunded')`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "paymentStatus" "public"."purchase_paymentstatus_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_orderstatus_enum" AS ENUM('completed', 'pending', 'processing', 'canceled')`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "orderStatus" "public"."purchase_orderstatus_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "serviceFee" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD "payboxChargeId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "price" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP CONSTRAINT "FK_d042b621cc9fa0a4593fb22f7fe"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD CONSTRAINT "UQ_d042b621cc9fa0a4593fb22f7fe" UNIQUE ("purchaseId")`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD CONSTRAINT "UQ_0c863ac67ad893b79f70deb8988" UNIQUE ("payboxChargeId", "purchaseId")`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD CONSTRAINT "FK_d042b621cc9fa0a4593fb22f7fe" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "paybox_event" ADD CONSTRAINT "FK_5e4a09d9fd4822948aa98145182" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paybox_event" DROP CONSTRAINT "FK_5e4a09d9fd4822948aa98145182"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP CONSTRAINT "FK_d042b621cc9fa0a4593fb22f7fe"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP CONSTRAINT "UQ_0c863ac67ad893b79f70deb8988"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP CONSTRAINT "UQ_d042b621cc9fa0a4593fb22f7fe"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD CONSTRAINT "FK_d042b621cc9fa0a4593fb22f7fe" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "price" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP COLUMN "payboxChargeId"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "serviceFee"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "orderStatus"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_orderstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_paymentstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD "salt" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD "signature" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_status_enum" AS ENUM('completed', 'pending', 'canceled', 'refunded')`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "status" "public"."purchase_status_enum" NOT NULL DEFAULT 'completed'`);
        await queryRunner.query(`DROP TABLE "paybox_event"`);
        await queryRunner.query(`DROP TYPE "public"."paybox_event_type_enum"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD CONSTRAINT "UQ_0d5766a885719f114935998ccb1" UNIQUE ("salt", "signature")`);
    }

}
