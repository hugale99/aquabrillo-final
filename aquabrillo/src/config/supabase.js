export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://adzhlgdxnoprovjpattv.supabase.co';

export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_x3YZN9az_eIYHHLp2_OZgw_iX4FLa7f';

export const HAS_SUPABASE_CONFIG = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
