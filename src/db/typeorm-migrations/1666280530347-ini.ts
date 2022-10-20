import type { MigrationInterface, QueryRunner } from "typeorm";

export class ini1666280530347 implements MigrationInterface {
    name = 'ini1666280530347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name"), CONSTRAINT "UQ_12c33d73f8702451fe40e4387ef" UNIQUE ("slug"), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'moderator')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "role" "public"."user_role_enum", "password" character varying NOT NULL, "phone" character varying NOT NULL, "countryCode" character varying NOT NULL, "description" character varying, "cityId" character varying, "picture" character varying, "lastLoggedIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "whatsapp" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_116b976af6ac591c763f565c9f3" UNIQUE ("phone", "countryCode"), CONSTRAINT "CHK_352fc4bed69aba99cf0a2c4cef" CHECK (username = lower(username) and email = lower(email)), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "following" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "followerId" integer NOT NULL, CONSTRAINT "UQ_d26f9858afde487b2f757989b8b" UNIQUE ("userId", "followerId"), CONSTRAINT "PK_c76c6e044bdf76ecf8bfb82a645" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "size_group" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slug" character varying NOT NULL, "title" character varying NOT NULL, "order" character varying NOT NULL, CONSTRAINT "UQ_d137e509d2260ebf28fb241e2e2" UNIQUE ("slug"), CONSTRAINT "PK_1bbc6ececd6336c0ac2e7f325d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_21321ce5cacf6d53e5a1056fb6" ON "size_group" ("order") `);
        await queryRunner.query(`CREATE TABLE "product_category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "parentId" integer, "sizeGroupId" integer, "synonyms" jsonb NOT NULL DEFAULT '[]', "order" character varying NOT NULL, CONSTRAINT "UQ_8b07f4d11a7e8d6c30a872bb7fd" UNIQUE ("slug", "parentId"), CONSTRAINT "UQ_02fc691b1b759dc76912afcfd4d" UNIQUE ("name", "parentId"), CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_275bd9a3b0e72e9df1a7486e4e" ON "product_category" ("order") `);
        await queryRunner.query(`CREATE TYPE "public"."product_currency_enum" AS ENUM('KZT', 'USD', 'RUB')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "description" text NOT NULL, "slug" character varying NOT NULL, "userId" integer NOT NULL, "brandId" integer, "cityId" integer NOT NULL, "categoryId" integer NOT NULL, "conditionId" integer NOT NULL, "price" numeric(10,2) NOT NULL, "currency" "public"."product_currency_enum" NOT NULL DEFAULT 'KZT', "quantity" integer, "images" jsonb NOT NULL DEFAULT '[]', "promoted" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "isSold" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug"), CONSTRAINT "CHK_2a98a549f92f279d89224d8e19" CHECK ("quantity" IS NULL OR "quantity" >= 0), CONSTRAINT "CHK_d00ea1a666a7142a2f9f96bd2f" CHECK ("price" >= 0), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_like" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "UQ_5c60e1c0166d333a1f46f77b89a" UNIQUE ("userId", "productId"), CONSTRAINT "PK_20a8f4d5b9cf0ae11bf2331941e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_rating" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "raterId" integer NOT NULL, "productId" integer NOT NULL, "rating" numeric(2,1) NOT NULL, "feedback" text, CONSTRAINT "UQ_4e9607c3e3bc52ab6bab8c1d2cb" UNIQUE ("raterId", "productId"), CONSTRAINT "PK_bd51c42005b46e0db79b10cef19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "color" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "hex" character varying NOT NULL, "order" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "UQ_fe74918a1db4c69c9efa0ee1c0c" UNIQUE ("code"), CONSTRAINT "PK_d15e531d60a550fbf23e1832343" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9df5a2480243e630d52bb82ea2" ON "color" ("order") `);
        await queryRunner.query(`CREATE TABLE "product_brand" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "order" character varying NOT NULL, CONSTRAINT "UQ_0f65346d968b04d48820e510aaa" UNIQUE ("slug"), CONSTRAINT "PK_2eb5ce4324613b4b457c364f4a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fd6932e3e38c0f12af475aa5bf" ON "product_brand" ("order") `);
        await queryRunner.query(`CREATE TABLE "product_color" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "productId" integer NOT NULL, "colorId" integer NOT NULL, CONSTRAINT "UQ_9885cc35ff96747c316d60b506b" UNIQUE ("productId", "colorId"), CONSTRAINT "PK_e586d22a197c9b985af3ac82ce3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_condition" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "explanation" character varying NOT NULL, "slug" character varying NOT NULL, "order" character varying NOT NULL, CONSTRAINT "UQ_189aa23f6d69e9b9513f1845162" UNIQUE ("title"), CONSTRAINT "UQ_05dd1bcbd3a276f4eb21018219f" UNIQUE ("slug"), CONSTRAINT "PK_2a6ba7b92d21ca854c3aa2f5022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7fd77c5f74885f468790407a3a" ON "product_condition" ("order") `);
        await queryRunner.query(`CREATE TABLE "size" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sizeGroupId" integer NOT NULL, "title" character varying NOT NULL, "order" character varying NOT NULL, CONSTRAINT "PK_66e3a0111d969aa0e5f73855c7a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2b527358794aed92e8f2a85038" ON "size" ("order") `);
        await queryRunner.query(`CREATE TABLE "product_variant" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sizeId" integer NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "UQ_d5a0d01deecf4bee1d34449487e" UNIQUE ("productId", "sizeId"), CONSTRAINT "CHK_6f85225a4eea0f356694bead8b" CHECK (quantity >= 0), CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "following" ADD CONSTRAINT "FK_fc4cbf2396bf4bb1df9ecb3cc4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "following" ADD CONSTRAINT "FK_6516c5a6f3c015b4eed39978be5" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_569b30aa4b0a1ad42bcd30916aa" FOREIGN KEY ("parentId") REFERENCES "product_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_category" ADD CONSTRAINT "FK_a4b3722c0e45c0a21e744c889f6" FOREIGN KEY ("sizeGroupId") REFERENCES "size_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_like" ADD CONSTRAINT "FK_01ee5ea531078cd8a4289190836" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_like" ADD CONSTRAINT "FK_8279023582c738c8e59cb72910a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_rating" ADD CONSTRAINT "FK_5b0e05a00eaf4915027b98b6bb8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_rating" ADD CONSTRAINT "FK_332b31b332a5d26e168f82c4c8e" FOREIGN KEY ("raterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_rating" ADD CONSTRAINT "FK_2b0df25b89027eb4a8be79cbb83" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_color" ADD CONSTRAINT "FK_7a1cefb85fba910888cf9a1a634" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "product_color" ADD CONSTRAINT "FK_d76b385a61478aa9c5c6408f337" FOREIGN KEY ("colorId") REFERENCES "color"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD CONSTRAINT "FK_6e420052844edf3a5506d863ce6" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD CONSTRAINT "FK_83181384731b20fa47ac6b2accb" FOREIGN KEY ("sizeId") REFERENCES "size"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "FK_83181384731b20fa47ac6b2accb"`);
        await queryRunner.query(`ALTER TABLE "product_variant" DROP CONSTRAINT "FK_6e420052844edf3a5506d863ce6"`);
        await queryRunner.query(`ALTER TABLE "product_color" DROP CONSTRAINT "FK_d76b385a61478aa9c5c6408f337"`);
        await queryRunner.query(`ALTER TABLE "product_color" DROP CONSTRAINT "FK_7a1cefb85fba910888cf9a1a634"`);
        await queryRunner.query(`ALTER TABLE "product_rating" DROP CONSTRAINT "FK_2b0df25b89027eb4a8be79cbb83"`);
        await queryRunner.query(`ALTER TABLE "product_rating" DROP CONSTRAINT "FK_332b31b332a5d26e168f82c4c8e"`);
        await queryRunner.query(`ALTER TABLE "product_rating" DROP CONSTRAINT "FK_5b0e05a00eaf4915027b98b6bb8"`);
        await queryRunner.query(`ALTER TABLE "product_like" DROP CONSTRAINT "FK_8279023582c738c8e59cb72910a"`);
        await queryRunner.query(`ALTER TABLE "product_like" DROP CONSTRAINT "FK_01ee5ea531078cd8a4289190836"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_a4b3722c0e45c0a21e744c889f6"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT "FK_569b30aa4b0a1ad42bcd30916aa"`);
        await queryRunner.query(`ALTER TABLE "following" DROP CONSTRAINT "FK_6516c5a6f3c015b4eed39978be5"`);
        await queryRunner.query(`ALTER TABLE "following" DROP CONSTRAINT "FK_fc4cbf2396bf4bb1df9ecb3cc4a"`);
        await queryRunner.query(`DROP TABLE "product_variant"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b527358794aed92e8f2a85038"`);
        await queryRunner.query(`DROP TABLE "size"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7fd77c5f74885f468790407a3a"`);
        await queryRunner.query(`DROP TABLE "product_condition"`);
        await queryRunner.query(`DROP TABLE "product_color"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd6932e3e38c0f12af475aa5bf"`);
        await queryRunner.query(`DROP TABLE "product_brand"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9df5a2480243e630d52bb82ea2"`);
        await queryRunner.query(`DROP TABLE "color"`);
        await queryRunner.query(`DROP TABLE "product_rating"`);
        await queryRunner.query(`DROP TABLE "product_like"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_currency_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_275bd9a3b0e72e9df1a7486e4e"`);
        await queryRunner.query(`DROP TABLE "product_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21321ce5cacf6d53e5a1056fb6"`);
        await queryRunner.query(`DROP TABLE "size_group"`);
        await queryRunner.query(`DROP TABLE "following"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "city"`);
    }

}
