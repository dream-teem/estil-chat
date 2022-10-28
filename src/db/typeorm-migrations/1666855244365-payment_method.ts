import type { MigrationInterface, QueryRunner } from "typeorm";

export class paymentMethod1666855244365 implements MigrationInterface {
    name = 'paymentMethod1666855244365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_method" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "paymentMethodId" integer NOT NULL, "userId" integer NOT NULL, "pan" character varying NOT NULL, "expiration" character varying NOT NULL, "owner" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "UQ_09e1bd667eeed3f7cedc6c4b670" UNIQUE ("paymentMethodId", "userId"), CONSTRAINT "PK_7744c2b2dd932c9cf42f2b9bc3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD "captured" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP COLUMN "captured"`);
        await queryRunner.query(`DROP TABLE "payment_method"`);
    }

}
