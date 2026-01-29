import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xqjyaqczftcinxacvhla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxanlhcWN6ZnRjaW54YWN2aGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTA2MzQsImV4cCI6MjA4NDEyNjYzNH0.9lUmhGgraEfTmbOT8eF7AWj6q0TECSI7iMK157vGxLQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
