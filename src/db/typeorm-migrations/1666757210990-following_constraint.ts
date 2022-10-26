import type { MigrationInterface, QueryRunner } from "typeorm";

export class followingConstraint1666757210990 implements MigrationInterface {
    name = 'followingConstraint1666757210990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "following" ADD CONSTRAINT "CHK_c9242f8a19e1e1c0a6ca0518f5" CHECK ("followerId" <> "userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "following" DROP CONSTRAINT "CHK_c9242f8a19e1e1c0a6ca0518f5"`);
    }

}
