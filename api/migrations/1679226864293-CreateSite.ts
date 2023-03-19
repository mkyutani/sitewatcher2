import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSite1679226864293 implements MigrationInterface {
    name = 'CreateSite1679226864293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "site" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id")); COMMENT ON COLUMN "site"."id" IS 'auto generated ID'; COMMENT ON COLUMN "site"."name" IS 'name'; COMMENT ON COLUMN "site"."url" IS 'url'; COMMENT ON COLUMN "site"."type" IS 'type'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "site"`);
    }

}
