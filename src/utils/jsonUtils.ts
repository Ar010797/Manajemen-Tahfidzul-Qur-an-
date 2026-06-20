import { jsonrepair } from 'jsonrepair';

export const safeJsonParse = (jsonString: string) => {
  try {
    const cleanJson = jsonString.trim().replace(/^\uFEFF/, '');
    return JSON.parse(cleanJson);
  } catch (err: any) {
    console.warn("Original JSON parse failed, attempting to repair JSON...", err.message);
    try {
      const repaired = jsonrepair(jsonString);
      return JSON.parse(repaired);
    } catch (repairErr: any) {
      console.error("Failed to repair JSON:", repairErr.message);
      throw new Error(`Failed to parse and repair JSON: ${err.message}`);
    }
  }
};
