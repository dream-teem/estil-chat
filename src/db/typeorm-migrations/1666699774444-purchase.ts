import type { MigrationInterface, QueryRunner } from "typeorm";

export class purchase1666699774444 implements MigrationInterface {
    name = 'purchase1666699774444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."purchase_status_enum" AS ENUM('completed', 'in_progress')`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_deliverystatus_enum" AS ENUM('shipped', 'delivered', 'pending')`);
        await queryRunner.query(`CREATE TABLE "purchase" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "productId" integer NOT NULL, "productSizeId" integer, "userId" integer NOT NULL, "addressId" integer, "quantity" integer NOT NULL, "status" "public"."purchase_status_enum" NOT NULL DEFAULT 'in_progress', "deliveryStatus" "public"."purchase_deliverystatus_enum", "price" numeric(10,2) NOT NULL DEFAULT '0', "deliveryPrice" numeric(10,2) NOT NULL DEFAULT '0', "trackingNumber" character varying, "shippedAt" TIMESTAMP WITH TIME ZONE, "deliveredAt" TIMESTAMP WITH TIME ZONE, "productIdId" integer, CONSTRAINT "CHK_bd83745687098aeb20d670e337" CHECK (price >= 0 and quantity > 0), CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "balance" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_beb5846554bec348f6baf449e83" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_eaedf5cbb61b2fc8b1bc4587090" FOREIGN KEY ("productIdId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_4dd5c3bdf25f46e82a07b1792d7" FOREIGN KEY ("productSizeId") REFERENCES "size"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_4dd5c3bdf25f46e82a07b1792d7"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_eaedf5cbb61b2fc8b1bc4587090"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_beb5846554bec348f6baf449e83"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "cityId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balance"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_deliverystatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_status_enum"`);
    }

}
