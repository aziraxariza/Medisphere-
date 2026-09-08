import { describe, expect, it } from "vitest";

describe("GEMINI_API_KEY configuration", () => {
  it("can reach the Gemini models endpoint when configured", async () => {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      expect(key).toBeTruthy();
      return;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
    );

    expect(response.ok).toBe(true);
  }, 15_000);
});
