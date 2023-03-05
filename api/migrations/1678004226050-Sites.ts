import { MigrationInterface, QueryRunner } from "typeorm";

export class Sites1678004226050 implements MigrationInterface {
    name = 'Sites1678004226050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sites" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_4f5eccb1dfde10c9170502595a7" PRIMARY KEY ("id")); COMMENT ON COLUMN "sites"."id" IS 'site ID'; COMMENT ON COLUMN "sites"."name" IS 'site name'; COMMENT ON COLUMN "sites"."url" IS 'site url'; COMMENT ON COLUMN "sites"."type" IS 'site type'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sites"`);
    }

}
