import { afterEach, describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const originalGeminiKey = process.env.GEMINI_API_KEY;

afterEach(() => {
  if (originalGeminiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalGeminiKey;
});

describe("triage.assess", () => {
  it("returns the safe unavailable message when Gemini is not configured", async () => {
    delete process.env.GEMINI_API_KEY;
    const caller = appRouter.createCaller({
      user: undefined,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    const result = await caller.triage.assess({
      region: "chest",
      symptoms: ["Chest pain"],
      severity: 5,
      duration: "A few hours",
      suddenStart: "Not sure",
      details: "",
      age: "",
      sex: "",
      conditions: "",
      medications: "",
      allergies: "",
    });

    expect(result.summary).toBe("AI assessment is temporarily unavailable.");
    expect(result.urgency).toBe("informational");
  });
});
