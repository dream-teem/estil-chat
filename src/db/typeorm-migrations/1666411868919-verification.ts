import type { MigrationInterface, QueryRunner } from "typeorm";

export class verification1666411868919 implements MigrationInterface {
    name = 'verification1666411868919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "countryCode" character varying NOT NULL, "phone" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "smsCode" character varying NOT NULL, "expiration" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8d80c2c676ddeda2f49654da7a0" UNIQUE ("phone", "smsCode", "countryCode"), CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6432839797a6e2a126cc8084ca" ON "verification" ("expiration") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6432839797a6e2a126cc8084ca"`);
        await queryRunner.query(`DROP TABLE "verification"`);
    }

}
