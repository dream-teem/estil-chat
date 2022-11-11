WITH RECURSIVE c_with_level AS (
    SELECT *,
        0 as lvl
    FROM "product_category" AS c
    WHERE c."parentId" IS NULL
    UNION ALL
    SELECT child.*,
        parent.lvl + 1
    FROM "product_category" AS child
        JOIN c_with_level parent ON parent.id = child."parentId"
)
SELECT id,
    description,
    price,
    "currency",
    "slug",
    "isDeleted",
    "isSold",
    CAST(
        "images" AS VARCHAR
    ) AS "images",
    to_char (
        "createdAt"::timestamp at time zone 'UTC',
        'YYYY-MM-DD"T"HH24:MI:SS"Z"'
    ) as "createdAt",
    to_char (
        "updatedAt"::timestamp at time zone 'UTC',
        'YYYY-MM-DD"T"HH24:MI:SS"Z"'
    ) as "updatedAt",
    (
        select CAST(
                json_build_object('id', u.id, 'username', u.username) as VARCHAR
            )
        from "user" as u
        where u.id = p."userId"
        limit 1
    ) as "user",
    (
        select CAST(
                json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as VARCHAR
            )
        from "city" as c
        where c.id = p."cityId"
        limit 1
    ) as "city",
    (
        SELECT CAST(
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id',
                            c.id,
                            'title',
                            c.title,
                            'hex',
                            c.hex,
                            'code',
                            c.code
                        )
                    ),
                    '[]'::json
                ) AS VARCHAR
            )
        FROM "product_color" pc
            INNER JOIN "color" AS c ON c."id" = pc."colorId"
            AND pc."productId" = p.id
    ) as colors,
    (
        SELECT CAST(
                json_build_object('id', b.id, 'name', b.name) AS VARCHAR
            )
        FROM "product_brand" AS b
        WHERE b."id" = p."brandId"
    ) as brand,
    (
        SELECT CAST(
                json_build_object('id', c.id, 'title', c.title) AS VARCHAR
            )
        FROM "product_condition" AS c
        WHERE c."id" = p."conditionId"
    ) as condition,
    (
        SELECT CAST(
            json_agg(json_build_object('sizeId', s.id, 'title', s.title, 'quantity', pv.quantity)) AS VARCHAR
        )
        FROM "product_variant" AS pv
        INNER JOIN "size" AS s ON s.id = pv."sizeId" AND p.id = pv."productId"
    ) as variants,
    (
        SELECT CAST(
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id',
                            c.id,
                            'keywords',
                            c.synonyms,
                            'name',
                            c.name,
                            'path',
                            c.path
                        )
                    ),
                    '[]'::json
                ) AS VARCHAR
            )
        FROM c_with_level as c
        WHERE (
                SELECT "path"
                FROM c_with_level
                WHERE "id" = p."categoryId"
                LIMIT 1
            ) LIKE CONCAT("path", '%')
    ) as categories
FROM "product" AS p
WHERE p."updatedAt" > :sql_last_value