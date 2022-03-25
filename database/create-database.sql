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
  "title" TEXT,
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

ALTER TABLE
  "links"
ALTER COLUMN
  "title" DROP NOT NULL;