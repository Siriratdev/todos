import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!URL || !SERVICE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

/**
 * อย่าสร้าง client ตอน import
 * ให้เรียกฟังก์ชันนี้ภายใน handler เพื่อเลี่ยง build-time import
 */
export function getSupabaseAdmin() {
  return createClient(URL, SERVICE_KEY);
}
