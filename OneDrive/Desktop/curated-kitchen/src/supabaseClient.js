import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://orfsgfdvojihddeworuz.supabase.co'
const supabaseKey = 'sb_publishable__MwmT7WKaeJJk_E2a6vzOg_qNr76gES'

export const supabase = createClient(supabaseUrl, supabaseKey)