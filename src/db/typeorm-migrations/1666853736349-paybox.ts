import type { MigrationInterface, QueryRunner } from "typeorm";

export class paybox1666853736349 implements MigrationInterface {
    name = 'paybox1666853736349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_27910f0a513af0a38392951bd29"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payboxChargeId"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD "purchaseId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" ADD CONSTRAINT "FK_d042b621cc9fa0a4593fb22f7fe" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP CONSTRAINT "FK_d042b621cc9fa0a4593fb22f7fe"`);
        await queryRunner.query(`ALTER TABLE "paybox_charge" DROP COLUMN "purchaseId"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payboxChargeId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_27910f0a513af0a38392951bd29" FOREIGN KEY ("payboxChargeId") REFERENCES "paybox_charge"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
    }

}
