/**
 * Bahasa Melayu (Malay) translations for the Cause & Effect app
 * Designed for EAL students with L1 = Bahasa Melayu
 */

export interface Translation {
  en: string;
  bm: string;
  context?: string; // Optional context for when to use
}

/**
 * UI Elements
 */
export const UI_TRANSLATIONS: Record<string, Translation> = {
  // Basic UI
  'score': { en: 'Score', bm: 'Skor' },
  'reset': { en: 'Reset', bm: 'Set Semula' },
  'next': { en: 'Next', bm: 'Seterusnya' },
  'back': { en: 'Back', bm: 'Kembali' },
  'continue': { en: 'Continue', bm: 'Teruskan' },
  'start': { en: 'Start', bm: 'Mula' },
  'complete': { en: 'Complete', bm: 'Selesai' },

  // Core concepts
  'cause': { en: 'Cause', bm: 'Sebab' },
  'effect': { en: 'Effect', bm: 'Akibat' },
  'connection': { en: 'Connection', bm: 'Hubungan' },
  'relationship': { en: 'Relationship', bm: 'Perkaitan' },

  // Instructions
  'select_cause': { en: 'Select a cause', bm: 'Pilih sebab' },
  'select_effect': { en: 'Select an effect', bm: 'Pilih akibat' },
  'make_connection': { en: 'Make Connection', bm: 'Buat Hubungan' },
  'correct': { en: 'Correct!', bm: 'Betul!' },
  'incorrect': { en: 'Incorrect', bm: 'Salah' },
  'try_again': { en: 'Try Again', bm: 'Cuba Lagi' },

  // Stages
  'watch_learn': { en: 'Watch & Learn', bm: 'Tonton & Belajar' },
  'build_chain': { en: 'Build the Chain', bm: 'Bina Rantaian' },
  'analyze_text': { en: 'Analyze the Text', bm: 'Analisis Teks' },
  'write_paragraph': { en: 'Write Your Paragraph', bm: 'Tulis Perenggan Anda' },

  // Thinking/Reasoning
  'thinking': { en: 'Thinking', bm: 'Berfikir' },
  'understanding': { en: 'Understanding', bm: 'Pemahaman' },
  'knowledge': { en: 'Knowledge', bm: 'Pengetahuan' },
  'explain': { en: 'Explain', bm: 'Jelaskan' },
  'describe': { en: 'Describe', bm: 'Huraikan' },
  'compare': { en: 'Compare', bm: 'Bandingkan' },
  'analyze': { en: 'Analyze', bm: 'Analisis' },
};

/**
 * Connective Phrases (Academic Language)
 */
export const CONNECTIVE_PHRASES: Record<string, Translation> = {
  // Simple causation
  'leads_to': { en: 'leads to', bm: 'membawa kepada' },
  'causes': { en: 'causes', bm: 'menyebabkan' },
  'results_in': { en: 'results in', bm: 'mengakibatkan' },
  'produces': { en: 'produces', bm: 'menghasilkan' },
  'creates': { en: 'creates', bm: 'mewujudkan' },

  // Consequence
  'therefore': { en: 'therefore', bm: 'oleh itu' },
  'thus': { en: 'thus', bm: 'maka' },
  'consequently': { en: 'consequently', bm: 'akibatnya' },
  'as_a_result': { en: 'as a result', bm: 'akibatnya' },
  'for_this_reason': { en: 'for this reason', bm: 'atas sebab ini' },

  // Multiple causes
  'together': { en: 'together', bm: 'bersama-sama' },
  'combine_to': { en: 'combine to', bm: 'bergabung untuk' },
  'work_together_to': { en: 'work together to', bm: 'bekerjasama untuk' },
  'interact_to': { en: 'interact to', bm: 'berinteraksi untuk' },

  // Reasoning
  'because': { en: 'because', bm: 'kerana' },
  'because_of': { en: 'because of', bm: 'disebabkan oleh' },
  'due_to': { en: 'due to', bm: 'disebabkan' },
  'since': { en: 'since', bm: 'memandangkan' },
  'given_that': { en: 'given that', bm: 'memandangkan bahawa' },

  // Sequential
  'first': { en: 'first', bm: 'pertama' },
  'then': { en: 'then', bm: 'kemudian' },
  'next': { en: 'next', bm: 'seterusnya' },
  'finally': { en: 'finally', bm: 'akhirnya' },

  // Addition
  'also': { en: 'also', bm: 'juga' },
  'additionally': { en: 'additionally', bm: 'tambahan pula' },
  'furthermore': { en: 'furthermore', bm: 'tambahan lagi' },
  'moreover': { en: 'moreover', bm: 'lebih-lebih lagi' },

  // Complex phrases
  'this_leads_to': { en: 'This leads to', bm: 'Ini membawa kepada' },
  'as_result_of': { en: 'As a result of', bm: 'Akibat daripada' },
  'which_results_in': { en: 'which results in', bm: 'yang mengakibatkan' },
  'resulting_in': { en: 'resulting in', bm: 'mengakibatkan' },
};

/**
 * SOLO Taxonomy Terms
 */
export const SOLO_TRANSLATIONS: Record<string, Translation> = {
  'pre_structural': { en: 'Pre-Structural', bm: 'Pra-Struktur', context: 'Getting started with the topic' },
  'unistructural': { en: 'Unistructural', bm: 'Uni-Struktur', context: 'Simple connection (one cause → one effect)' },
  'multistructural': { en: 'Multistructural', bm: 'Multi-Struktur', context: 'Multiple causes identified' },
  'relational': { en: 'Relational', bm: 'Relasi', context: 'Understanding how causes work together' },
  'extended_abstract': { en: 'Extended Abstract', bm: 'Abstrak Lanjutan', context: 'Applying to new contexts' },

  // SOLO descriptions
  'simple_link': { en: 'Simple link', bm: 'Pautan mudah' },
  'multiple_factors': { en: 'Multiple factors', bm: 'Pelbagai faktor' },
  'integrated_understanding': { en: 'Integrated understanding', bm: 'Pemahaman bersepadu' },
  'system_thinking': { en: 'System thinking', bm: 'Pemikiran sistem' },
  'applying_patterns': { en: 'Applying patterns', bm: 'Mengaplikasi corak' },
};

/**
 * Academic Vocabulary (Common terms students need)
 */
export const ACADEMIC_VOCAB: Record<string, Translation> = {
  // Verbs
  'identify': { en: 'identify', bm: 'kenal pasti' },
  'determine': { en: 'determine', bm: 'tentukan' },
  'establish': { en: 'establish', bm: 'menetapkan' },
  'demonstrate': { en: 'demonstrate', bm: 'menunjukkan' },
  'illustrate': { en: 'illustrate', bm: 'menggambarkan' },
  'indicate': { en: 'indicate', bm: 'menunjukkan' },
  'suggest': { en: 'suggest', bm: 'mencadangkan' },
  'imply': { en: 'imply', bm: 'menunjukkan' },

  // Nouns
  'factor': { en: 'factor', bm: 'faktor' },
  'element': { en: 'element', bm: 'elemen' },
  'component': { en: 'component', bm: 'komponen' },
  'aspect': { en: 'aspect', bm: 'aspek' },
  'process': { en: 'process', bm: 'proses' },
  'system': { en: 'system', bm: 'sistem' },
  'pattern': { en: 'pattern', bm: 'corak' },
  'outcome': { en: 'outcome', bm: 'hasil' },
  'consequence': { en: 'consequence', bm: 'akibat' },

  // Adjectives
  'significant': { en: 'significant', bm: 'penting' },
  'important': { en: 'important', bm: 'penting' },
  'major': { en: 'major', bm: 'utama' },
  'primary': { en: 'primary', bm: 'utama' },
  'secondary': { en: 'secondary', bm: 'sekunder' },
  'complex': { en: 'complex', bm: 'kompleks' },
  'simple': { en: 'simple', bm: 'mudah' },
};

/**
 * Feedback Messages
 */
export const FEEDBACK_MESSAGES: Record<string, Translation> = {
  'great_connection': { en: 'Great connection!', bm: 'Hubungan yang baik!' },
  'excellent_thinking': { en: 'Excellent thinking!', bm: 'Pemikiran yang cemerlang!' },
  'keep_going': { en: 'Keep going!', bm: 'Teruskan!' },
  'well_done': { en: 'Well done!', bm: 'Bagus!' },
  'nice_work': { en: 'Nice work!', bm: 'Kerja yang baik!' },

  'partial_match': { en: 'Partial match - try adding more causes', bm: 'Sepadan sebahagian - cuba tambah lebih sebab' },
  'not_quite': { en: 'Not quite right', bm: 'Belum tepat' },
  'try_different': { en: 'Try a different combination', bm: 'Cuba gabungan yang berbeza' },
};

/**
 * Helper function to get translation by key
 */
export function getTranslation(key: string, category: 'ui' | 'connective' | 'solo' | 'academic' | 'feedback' = 'ui'): Translation | null {
  const categories = {
    ui: UI_TRANSLATIONS,
    connective: CONNECTIVE_PHRASES,
    solo: SOLO_TRANSLATIONS,
    academic: ACADEMIC_VOCAB,
    feedback: FEEDBACK_MESSAGES
  };

  return categories[category][key] || null;
}

/**
 * Helper function to search for translation by English text
 */
export function findTranslationByText(englishText: string): Translation | null {
  const allTranslations = {
    ...UI_TRANSLATIONS,
    ...CONNECTIVE_PHRASES,
    ...SOLO_TRANSLATIONS,
    ...ACADEMIC_VOCAB,
    ...FEEDBACK_MESSAGES
  };

  const normalizedSearch = englishText.toLowerCase().trim();

  for (const [key, translation] of Object.entries(allTranslations)) {
    if (translation.en.toLowerCase() === normalizedSearch) {
      return translation;
    }
  }

  return null;
}
