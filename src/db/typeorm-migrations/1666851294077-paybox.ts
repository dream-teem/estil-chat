import type { MigrationInterface, QueryRunner } from "typeorm";

export class paybox1666851294077 implements MigrationInterface {
    name = 'paybox1666851294077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "paybox_charge" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "salt" character varying NOT NULL, "signature" character varying NOT NULL, "paid" boolean NOT NULL DEFAULT false, "refunded" boolean NOT NULL DEFAULT false, "disputeId" integer, "failure_code" integer, "failure_message" text, CONSTRAINT "UQ_0d5766a885719f114935998ccb1" UNIQUE ("signature", "salt"), CONSTRAINT "PK_f05045ef680354a7fd3624d12e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "addressId"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "deliveryStatus"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_deliverystatus_enum"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "deliveryPrice"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "trackingNumber"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "shippedAt"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "deliveredAt"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "shippingPrice" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "shippingId" integer`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payboxChargeId" integer NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."purchase_status_enum" RENAME TO "purchase_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_status_enum" AS ENUM('completed', 'pending', 'canceled', 'refunded')`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "status" TYPE "public"."purchase_status_enum" USING "status"::"text"::"public"."purchase_status_enum"`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "status" SET DEFAULT 'completed'`);
        await queryRunner.query(`DROP TYPE "public"."purchase_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_27910f0a513af0a38392951bd29" FOREIGN KEY ("payboxChargeId") REFERENCES "paybox_charge"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_27910f0a513af0a38392951bd29"`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_status_enum_old" AS ENUM('completed', 'in_progress')`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "status" TYPE "public"."purchase_status_enum_old" USING "status"::"text"::"public"."purchase_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "status" SET DEFAULT 'in_progress'`);
        await queryRunner.query(`DROP TYPE "public"."purchase_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."purchase_status_enum_old" RENAME TO "purchase_status_enum"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payboxChargeId"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "shippingId"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "shippingPrice"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "deliveredAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "shippedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "trackingNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "deliveryPrice" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_deliverystatus_enum" AS ENUM('shipped', 'delivered', 'pending')`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "deliveryStatus" "public"."purchase_deliverystatus_enum"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "addressId" integer`);
        await queryRunner.query(`DROP TABLE "paybox_charge"`);
    }

}
