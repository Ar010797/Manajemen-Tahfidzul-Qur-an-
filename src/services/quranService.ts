// src/services/quranService.ts

export interface Surah {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
}

export interface Verse {
  id: number;
  verse_number: number;
  text_uthmani: string;
}

const API_BASE = 'https://api.quran.com/api/v4';

export const quranService = {
  getSurahs: async (): Promise<Surah[]> => {
    try {
      const response = await fetch(`${API_BASE}/chapters?language=id`);
      const data = await response.json();
      return data.chapters;
    } catch (error) {
      console.error('Error fetching surahs:', error);
      return [];
    }
  },

  getVerses: async (surahId: number, start: number, end: number): Promise<Verse[]> => {
    try {
      // Primary API: Quran.com v4
      const quranComUrl = `${API_BASE}/verses/by_range/${surahId}:${start}-${surahId}:${end}?fields=text_uthmani`;
      const response = await fetch(quranComUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
          return data.verses;
        }
      }
      
      // Fallback API: AlQuran.cloud (highly stable)
      // Optimized range query: offset is start-1, limit is number of verses
      const offset = Math.max(0, start - 1);
      const limit = Math.max(1, end - start + 1);
      const fallbackUrl = `https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani?offset=${offset}&limit=${limit}`;
      const fallbackResponse = await fetch(fallbackUrl);
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.data && fallbackData.data.verses) {
          const fetchedVerses = fallbackData.data.verses;
          return fetchedVerses.map((v: any) => ({
            id: v.number,
            verse_number: v.numberInSurah,
            text_uthmani: v.text
          }));
        }
      }

      // Third Fallback: QuranAPI (Static JSON)
      const thirdUrl = `https://quranapi.pages.dev/api/${surahId}.json`;
      const thirdResponse = await fetch(thirdUrl);
      if (thirdResponse.ok) {
        const thirdData = await thirdResponse.json();
        if (thirdData && thirdData.arabic) {
          // This API provides an array of arabic text
          const arabicVerses = thirdData.arabic;
          const result: Verse[] = [];
          for (let i = start - 1; i < end && i < arabicVerses.length; i++) {
            result.push({
              id: surahId * 1000 + (i + 1),
              verse_number: i + 1,
              text_uthmani: arabicVerses[i]
            });
          }
          if (result.length > 0) return result;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching verses:', error);
      return [];
    }
  }
};
