/*
# FIRMA Studio MVP — Core schema

## Purpose
Creates the minimal tables required for the FIRMA Studio MVP:
owner-only authentication, blog article management, public article
display, minimal taxonomy (authors, categories, tags), and article
image storage references.

## New Tables

1. **profiles** — one row per authenticated user, linked to auth.users.
2. **authors** — article authors (pen name or external contributor).
3. **categories** — article categories.
4. **articles** — the core content item for the Blog module.
5. **tags** — article tags (many-to-many with articles).
6. **article_tags** — join table articles <-> tags.

## Indexes
- Unique index on articles.slug, authors.slug, categories.slug, tags.slug
- Index on articles.status, articles.publish_date DESC

## Security (RLS)
All tables have RLS enabled.
- Authenticated owner: full CRUD (owner-scoped on profiles and articles;
  full on authors, categories, tags, article_tags).
- Public (anon): SELECT only on published articles and the taxonomy
  referenced by them. No public writes.

## Notes
- owner_id defaults to auth.uid() so client inserts that omit owner_id
  still satisfy the INSERT WITH CHECK policy.
- A trigger auto-creates a profile row when a new auth.users row is created.
*/

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  avatar_url text,
  role text NOT NULL DEFAULT 'owner',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_profile" ON profiles;
CREATE POLICY "owner_select_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "owner_insert_profile" ON profiles;
CREATE POLICY "owner_insert_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "owner_update_profile" ON profiles;
CREATE POLICY "owner_update_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "owner_delete_profile" ON profiles;
CREATE POLICY "owner_delete_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ============================================================
-- 2. authors
-- ============================================================
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  bio text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS authors_slug_idx ON authors (slug);

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_authors" ON authors;
CREATE POLICY "owner_select_authors" ON authors FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_authors" ON authors;
CREATE POLICY "owner_insert_authors" ON authors FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "owner_update_authors" ON authors;
CREATE POLICY "owner_update_authors" ON authors FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "owner_delete_authors" ON authors;
CREATE POLICY "owner_delete_authors" ON authors FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 3. categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_idx ON categories (slug);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_categories" ON categories;
CREATE POLICY "owner_select_categories" ON categories FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_categories" ON categories;
CREATE POLICY "owner_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "owner_update_categories" ON categories;
CREATE POLICY "owner_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "owner_delete_categories" ON categories;
CREATE POLICY "owner_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 4. articles
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  body text,
  featured_image_url text,
  featured_image_alt text,
  author_id uuid REFERENCES authors(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  publish_date timestamptz,
  reading_time integer NOT NULL DEFAULT 0,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  no_index boolean NOT NULL DEFAULT false,
  no_follow boolean NOT NULL DEFAULT false,
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS articles_slug_idx ON articles (slug);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles (status);
CREATE INDEX IF NOT EXISTS articles_publish_date_idx ON articles (publish_date DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS articles_owner_idx ON articles (owner_id);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_articles" ON articles;
CREATE POLICY "owner_select_articles" ON articles FOR SELECT
  TO authenticated USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner_insert_articles" ON articles;
CREATE POLICY "owner_insert_articles" ON articles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner_update_articles" ON articles;
CREATE POLICY "owner_update_articles" ON articles FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "owner_delete_articles" ON articles;
CREATE POLICY "owner_delete_articles" ON articles FOR DELETE
  TO authenticated USING (auth.uid() = owner_id);

-- Public: read only published articles
DROP POLICY IF EXISTS "public_select_articles" ON articles;
CREATE POLICY "public_select_articles" ON articles FOR SELECT
  TO anon USING (status = 'published');

-- ============================================================
-- 5. tags
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_idx ON tags (slug);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_tags" ON tags;
CREATE POLICY "owner_select_tags" ON tags FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "owner_insert_tags" ON tags;
CREATE POLICY "owner_insert_tags" ON tags FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "owner_update_tags" ON tags;
CREATE POLICY "owner_update_tags" ON tags FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "owner_delete_tags" ON tags;
CREATE POLICY "owner_delete_tags" ON tags FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 6. article_tags
-- ============================================================
CREATE TABLE IF NOT EXISTS article_tags (
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_article_tags" ON article_tags;
CREATE POLICY "owner_select_article_tags" ON article_tags FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_tags.article_id AND articles.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "owner_insert_article_tags" ON article_tags;
CREATE POLICY "owner_insert_article_tags" ON article_tags FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_tags.article_id AND articles.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "owner_update_article_tags" ON article_tags;
CREATE POLICY "owner_update_article_tags" ON article_tags FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_tags.article_id AND articles.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_tags.article_id AND articles.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "owner_delete_article_tags" ON article_tags;
CREATE POLICY "owner_delete_article_tags" ON article_tags FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_tags.article_id AND articles.owner_id = auth.uid())
  );

-- ============================================================
-- Public read policies (after all tables exist)
-- ============================================================

DROP POLICY IF EXISTS "public_select_authors" ON authors;
CREATE POLICY "public_select_authors" ON authors FOR SELECT
  TO anon USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.author_id = authors.id
        AND articles.status = 'published'
    )
  );

DROP POLICY IF EXISTS "public_select_categories" ON categories;
CREATE POLICY "public_select_categories" ON categories FOR SELECT
  TO anon USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.category_id = categories.id
        AND articles.status = 'published'
    )
  );

DROP POLICY IF EXISTS "public_select_tags" ON tags;
CREATE POLICY "public_select_tags" ON tags FOR SELECT
  TO anon USING (
    EXISTS (
      SELECT 1 FROM article_tags
      JOIN articles ON articles.id = article_tags.article_id
      WHERE article_tags.tag_id = tags.id
        AND articles.status = 'published'
    )
  );

DROP POLICY IF EXISTS "public_select_article_tags" ON article_tags;
CREATE POLICY "public_select_article_tags" ON article_tags FOR SELECT
  TO anon USING (
    EXISTS (SELECT 1 FROM articles WHERE articles.id = article_tags.article_id AND articles.status = 'published')
  );

-- ============================================================
-- updated_at trigger function (reusable)
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS authors_updated_at ON authors;
CREATE TRIGGER authors_updated_at BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS categories_updated_at ON categories;
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS tags_updated_at ON tags;
CREATE TRIGGER tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();