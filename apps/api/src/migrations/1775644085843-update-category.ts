import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategory1775644085843 implements MigrationInterface {
    name = 'UpdateCategory1775644085843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "createdBy" character varying`);
        await queryRunner.query(`ALTER TABLE "category" ADD "updatedBy" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "createdBy"`);
    }

}
