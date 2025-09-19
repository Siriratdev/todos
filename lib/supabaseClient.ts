import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!URL || !ANON) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// สร้าง client แบบทันที เพราะโค้ดนี้จะถูก bundle ไปฝั่ง browser เท่านั้น
const supabaseClient = createClient(URL, ANON);
export default supabaseClient;
