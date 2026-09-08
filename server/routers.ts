import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import type { AssessmentPayload, TriageResult } from "@shared/triage";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const assessmentSchema = z.object({
  region: z.string().min(1),
  symptoms: z.array(z.string()).min(1),
  severity: z.number().int().min(1).max(10),
  duration: z.string().min(1),
  suddenStart: z.string().min(1),
  details: z.string().max(2000),
  age: z.string().max(20),
  sex: z.string().max(40),
  conditions: z.string().max(1000),
  medications: z.string().max(1000),
  allergies: z.string().max(1000),
});

const fallbackTriage: TriageResult = {
  urgency: "informational",
  summary: "AI assessment is temporarily unavailable.",
  possible_causes: [],
  red_flags: ["If symptoms are severe, sudden, or worsening, seek professional care now."],
  recommended_action: "Please contact a qualified healthcare professional for guidance. Call local emergency services for severe or life-threatening symptoms.",
  questions_to_consider: [],
  specialist_type: "Primary care",
  reasoning_summary: "No automated assessment was completed.",
};

const triageSchema = {
  type: "object",
  properties: {
    urgency: { type: "string", enum: ["emergency", "urgent", "routine", "informational"] },
    summary: { type: "string" },
    possible_causes: { type: "array", items: { type: "string" } },
    red_flags: { type: "array", items: { type: "string" } },
    recommended_action: { type: "string" },
    questions_to_consider: { type: "array", items: { type: "string" } },
    specialist_type: { type: "string" },
    reasoning_summary: { type: "string" },
  },
  required: [
    "urgency",
    "summary",
    "possible_causes",
    "red_flags",
    "recommended_action",
    "questions_to_consider",
    "specialist_type",
    "reasoning_summary",
  ],
  additionalProperties: false,
} as const;

function parseAssessment(input: AssessmentPayload) {
  return [
    `Body region: ${input.region}`,
    `Symptoms: ${input.symptoms.join(", ")}`,
    `Severity: ${input.severity}/10`,
    `Duration: ${input.duration}`,
    `Sudden onset: ${input.suddenStart}`,
    `Additional details: ${input.details || "None provided"}`,
    `Age: ${input.age || "Not provided"}`,
    `Sex: ${input.sex || "Not provided"}`,
    `Known conditions: ${input.conditions || "None provided"}`,
    `Current medications: ${input.medications || "None provided"}`,
    `Known allergies: ${input.allergies || "None provided"}`,
  ].join("\n");
}

async function runTriage(input: AssessmentPayload): Promise<TriageResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallbackTriage;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "You are a cautious health-information triage assistant. This is not a diagnosis. Identify potential red flags, recommend an appropriate level of care, and never prescribe medication or discourage emergency care. Treat emergency symptoms conservatively. Return only the requested JSON object.",
            }],
          },
          contents: [{
            role: "user",
            parts: [{ text: `Assess this structured symptom report for next-step guidance:\n\n${parseAssessment(input)}` }],
          }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                urgency: { type: "STRING", enum: ["emergency", "urgent", "routine", "informational"] },
                summary: { type: "STRING" },
                possible_causes: { type: "ARRAY", items: { type: "STRING" } },
                red_flags: { type: "ARRAY", items: { type: "STRING" } },
                recommended_action: { type: "STRING" },
                questions_to_consider: { type: "ARRAY", items: { type: "STRING" } },
                specialist_type: { type: "STRING" },
                reasoning_summary: { type: "STRING" },
              },
              required: [
                "urgency",
                "summary",
                "possible_causes",
                "red_flags",
                "recommended_action",
                "questions_to_consider",
                "specialist_type",
                "reasoning_summary",
              ],
            },
          },
        }),
      },
    );

    if (!response.ok) throw new Error(`Gemini request failed with status ${response.status}`);
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = payload.candidates?.[0]?.content?.parts?.map(part => part.text ?? "").join("") ?? "";
    const parsed = JSON.parse(text) as TriageResult;
    if (!triageSchema.properties.urgency.enum.includes(parsed.urgency)) return fallbackTriage;
    return parsed;
  } catch (error) {
    console.warn("[Triage] Gemini unavailable or returned invalid data", error instanceof Error ? error.message : "unknown error");
    return fallbackTriage;
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  triage: router({
    assess: publicProcedure.input(assessmentSchema).mutation(({ input }) => runTriage(input)),
  }),
});

export type AppRouter = typeof appRouter;
