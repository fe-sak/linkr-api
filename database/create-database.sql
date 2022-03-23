CREATE TABLE "users" (
  "id" serial NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "username" TEXT NOT NULL UNIQUE,
  "picture_url" TEXT NOT NULL,
  CONSTRAINT "users_pk" PRIMARY KEY ("id")
);

CREATE TABLE "sessions" (
  "id" serial NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "user_id" integer NOT NULL,
  CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
);

CREATE TABLE "posts" (
  "id" serial NOT NULL,
  "comment" TEXT,
  "user_id" integer NOT NULL,
  "link_id" integer NOT NULL,
  "timestamp" TIMESTAMP NOT NULL DEFAULT 'NOW()',
  CONSTRAINT "posts_pk" PRIMARY KEY ("id")
);

CREATE TABLE "likes" (
  "id" serial NOT NULL,
  "user_id" integer NOT NULL,
  "post_id" integer NOT NULL,
  CONSTRAINT "likes_pk" PRIMARY KEY ("id")
);

CREATE TABLE "hashtags" (
  "id" serial NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
  CONSTRAINT "hashtags_pk" PRIMARY KEY ("id")
);

CREATE TABLE "hashtags_posts" (
  "id" serial NOT NULL,
  "hashtag_id" integer NOT NULL,
  "post_id" integer NOT NULL,
  CONSTRAINT "hashtags_posts_pk" PRIMARY KEY ("id")
);

CREATE TABLE "links" (
  "id" serial NOT NULL,
  "title" TEXT NOT NULL,
  "image" TEXT,
  "description" TEXT,
  "url" TEXT NOT NULL UNIQUE,
  CONSTRAINT "links_pk" PRIMARY KEY ("id")
);

ALTER TABLE
  "sessions"
ADD
  CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE
  "posts"
ADD
  CONSTRAINT "posts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE
  "posts"
ADD
  CONSTRAINT "posts_fk1" FOREIGN KEY ("link_id") REFERENCES "links"("id");

ALTER TABLE
  "likes"
ADD
  CONSTRAINT "likes_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE
  "likes"
ADD
  CONSTRAINT "likes_fk1" FOREIGN KEY ("post_id") REFERENCES "posts"("id");

ALTER TABLE
  "hashtags_posts"
ADD
  CONSTRAINT "hashtags_posts_fk0" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("id");

ALTER TABLE
  "hashtags_posts"
ADD
  CONSTRAINT "hashtags_posts_fk1" FOREIGN KEY ("post_id") REFERENCES "posts"("id");

SELECT
  posts.id,
  posts.comment,
  users.username,
  users.picture_url,
  links.title,
  links.image,
  links.description,
  links.url
FROM
  posts
  JOIN users ON posts.user_id = users.id
  JOIN links ON posts.link_id = links.id
ORDER BY
  timestamp DESC
LIMIT
  20;

INSERT INTO
  links (title, image, description, url)
VALUES
  (
    'Teste',
    'https://alternativagameselan.com.br/web/fotos/produtos_55_produto-teste-nao-usar_www.alternativagameselan.com.br_zz4ef5edb9b8.png',
    'Descrição do teste',
    'https://pt.wikipedia.org/wiki/Teste'
  );

INSERT INTO
  posts ("comment", user_id, link_id)
VALUES
  (
    'Este post é um teste!!!! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa',
    1,
    1
  );