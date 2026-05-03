
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;

DROP POLICY IF EXISTS "Public read products bucket" ON storage.objects;
CREATE POLICY "Public read product files" ON storage.objects
  FOR SELECT USING (bucket_id = 'products' AND (storage.foldername(name))[1] IS NOT NULL);
