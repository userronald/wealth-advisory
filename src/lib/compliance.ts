export const COMPLIANCE_MAP: Record<string, string> = {
  'invest in this': 'people often explore',
  'best option': 'commonly considered',
  'guaranteed return': 'educational information',
  'highest return': 'educational information',
};

/**
 * Replace disallowed compliance phrases with safe alternatives.
 * The replacement is case‑insensitive and preserves original casing for the first letter.
 */
export function applyCompliance(text: string): string {
  let result = text;
  for (const [bad, good] of Object.entries(COMPLIANCE_MAP)) {
    const regex = new RegExp(bad, 'gi');
    result = result.replace(regex, (match) => {
      // Preserve capitalization of the first character
      if (match[0] === match[0].toUpperCase()) {
        return good.charAt(0).toUpperCase() + good.slice(1);
      }
      return good;
    });
  }
  return result;
}
