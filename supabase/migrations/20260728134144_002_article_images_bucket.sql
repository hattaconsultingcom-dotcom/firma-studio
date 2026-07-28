/*
# FIRMA Studio MVP — Article images storage bucket

Creates a public storage bucket for article featured images.
The bucket is public-readable so published article images display
without authentication. Uploads and deletes are restricted to
authenticated users via storage policies.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload and manage files
DROP POLICY IF EXISTS "owner_upload_article_images" ON storage.objects;
CREATE POLICY "owner_upload_article_images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'article-images');

DROP POLICY IF EXISTS "owner_update_article_images" ON storage.objects;
CREATE POLICY "owner_update_article_images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'article-images') WITH CHECK (bucket_id = 'article-images');

DROP POLICY IF EXISTS "owner_delete_article_images" ON storage.objects;
CREATE POLICY "owner_delete_article_images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'article-images');

-- Public read
DROP POLICY IF EXISTS "public_read_article_images" ON storage.objects;
CREATE POLICY "public_read_article_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'article-images');