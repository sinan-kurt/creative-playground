// Supabase "creative-playground" projesi (ziyaretçi defteri + masa tıklama sayacı).
// Anon anahtarı tarayıcıya açık olacak şekilde tasarlanmıştır; koruma veritabanındaki satır güvenliği kurallarındadır.
// Ortam değişkeni tanımlanırsa o kullanılır.
export const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || 'https://onkcsoqomvjiymfmkwfr.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ua2Nzb3FvbXZqaXltZm1rd2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMTE4OTcsImV4cCI6MjEwNzg4Nzg5N30.OdBFs3YSp5WPiLGZUPJTJrB0YGODfSQ93DtJ51f2WgM';
