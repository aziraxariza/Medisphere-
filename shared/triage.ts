export type AssessmentPayload = {
  region: string;
  symptoms: string[];
  severity: number;
  duration: string;
  suddenStart: string;
  details: string;
  age: string;
  sex: string;
  conditions: string;
  medications: string;
  allergies: string;
};

export type Urgency = "emergency" | "urgent" | "routine" | "informational";

export type TriageResult = {
  urgency: Urgency;
  summary: string;
  possible_causes: string[];
  red_flags: string[];
  recommended_action: string;
  questions_to_consider: string[];
  specialist_type: string;
  reasoning_summary: string;
};
