import { describe, it, expect } from "vitest";
import { translations } from "../lib/i18n";

describe("i18n", () => {
  it("should have the same keys for all languages", () => {
    const languages = Object.keys(
      translations
    ) as (keyof typeof translations)[];
    const baseLanguage = languages[0];
    const baseKeys = getKeys(translations[baseLanguage]);

    languages.slice(1).forEach((lang) => {
      const currentKeys = getKeys(translations[lang]);

      // Check for missing keys
      const missingKeys = baseKeys.filter((key) => !currentKeys.includes(key));
      if (missingKeys.length > 0) {
        console.error(`Missing keys in ${lang}:`, missingKeys);
      }
      expect(missingKeys, `Missing keys in ${lang}`).toEqual([]);

      // Check for extra keys
      const extraKeys = currentKeys.filter((key) => !baseKeys.includes(key));
      if (extraKeys.length > 0) {
        console.error(`Extra keys in ${lang}:`, extraKeys);
      }
      expect(extraKeys, `Extra keys in ${lang}`).toEqual([]);
    });
  });
});

function getKeys(obj: any, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`));
    } else {
      keys.push(`${prefix}${key}`);
    }
  }
  return keys;
}
