
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wgsciadzmspaxfzkfqdp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnc2NpYWR6bXNwYXhmemtmcWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMTg1NTEsImV4cCI6MjA2MjY5NDU1MX0.6EYB6fcKGBLBdnmuwJkTVw0_QQ8OAVye5XhAzAQuPG4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
