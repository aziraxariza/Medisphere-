import { ArrowLeft, ArrowRight, Check, Copy, Mic, RotateCcw, Siren, Sparkles, Stethoscope, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { HumanBody } from "@/components/HumanBody/HumanBody";
import type { BodyRegion } from "@/components/HumanBody/types";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import type { AssessmentPayload, TriageResult } from "@shared/triage";

const regionLabels: Record<BodyRegion, string> = {
  head: "Head",
  neck: "Neck",
  chest: "Chest",
  abdomen: "Abdomen",
  pelvis: "Pelvis",
  left_arm: "Left arm",
  right_arm: "Right arm",
  left_leg: "Left leg",
  right_leg: "Right leg",
};

const symptomOptions: Record<BodyRegion, string[]> = {
  head: ["Headache", "Pressure", "Dizziness", "Vision changes", "Nausea", "Numbness", "Other"],
  neck: ["Pain", "Stiffness", "Swelling", "Numbness", "Difficulty swallowing", "Other"],
  chest: ["Chest pain", "Pressure or tightness", "Shortness of breath", "Palpitations", "Dizziness", "Sweating", "Nausea", "Pain spreading to arm/jaw", "Other"],
  abdomen: ["Abdominal pain", "Bloating", "Nausea", "Vomiting", "Diarrhea", "Constipation", "Other"],
  pelvis: ["Pain", "Pressure", "Urinary changes", "Bleeding", "Swelling", "Other"],
  left_arm: ["Pain", "Weakness", "Numbness", "Swelling", "Limited movement", "Other"],
  right_arm: ["Pain", "Weakness", "Numbness", "Swelling", "Limited movement", "Other"],
  left_leg: ["Pain", "Weakness", "Numbness", "Swelling", "Limited movement", "Other"],
  right_leg: ["Pain", "Weakness", "Numbness", "Swelling", "Limited movement", "Other"],
};

const initialForm: AssessmentPayload = {
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
};

function humanizeRegion(region: BodyRegion) {
  return regionLabels[region];
}

function UrgencyPill({ urgency }: { urgency: TriageResult["urgency"] }) {
  const label = urgency === "informational" ? "Information" : urgency;
  return <span className={`urgency-pill urgency-${urgency}`}>{label}</span>;
}

function EmergencyPanel({ result }: { result: TriageResult }) {
  return (
    <section className="emergency-panel" aria-live="assertive">
      <div className="emergency-icon"><Siren size={22} /></div>
      <div>
        <p className="eyebrow emergency-eyebrow">Potential emergency</p>
        <h2>These symptoms may require immediate medical attention.</h2>
        <p>{result.recommended_action}</p>
        <div className="emergency-actions">
          <a className="button button-danger" href="tel:112"><Siren size={16} /> Call emergency services</a>
          <button className="button button-quiet" type="button" onClick={() => alert("Location sharing is ready for a connected care service.")}><span>Share my location</span></button>
        </div>
      </div>
    </section>
  );
}

function Results({ form, result, onRestart }: { form: AssessmentPayload; result: TriageResult; onRestart: () => void }) {
  const [copied, setCopied] = useState(false);
  const summary = useMemo(() => {
    return `SYMPTOM SUMMARY\n\nMain concern: ${form.symptoms.join(", ")} (${humanizeRegion(form.region as BodyRegion)})\nStarted: ${form.duration}\nSeverity: ${form.severity}/10\nAssociated details: ${form.details || "None provided"}\nAI triage: ${result.urgency}\nSuggested next step: ${result.recommended_action}`;
  }, [form, result]);

  const copySummary = async () => {
    await navigator.clipboard?.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="results-shell">
      <div className="results-heading">
        <div>
          <p className="eyebrow">Assessment complete</p>
          <h1>Your assessment</h1>
          <p className="lede">A concise, AI-assisted view of what you shared and what to consider next.</p>
        </div>
        <UrgencyPill urgency={result.urgency} />
      </div>
      {result.urgency === "emergency" && <EmergencyPanel result={result} />}
      <div className="results-grid">
        <section className="result-card result-primary">
          <div className="result-card-top"><span className="small-label">What this could mean</span><Sparkles size={17} /></div>
          <h2>{result.summary}</h2>
          <div className="cause-list">
            {result.possible_causes.length ? result.possible_causes.slice(0, 3).map(cause => <div className="cause-row" key={cause}><span className="cause-dot" />{cause}</div>) : <p className="muted">No possible explanations were generated.</p>}
          </div>
          <div className="next-step"><span className="small-label">What to do next</span><p>{result.recommended_action}</p></div>
        </section>
        <section className="result-card">
          <div className="result-card-top"><span className="small-label">What you reported</span><Stethoscope size={17} /></div>
          <ul className="reported-list">
            <li><strong>Area</strong><span>{humanizeRegion(form.region as BodyRegion)}</span></li>
            <li><strong>Symptoms</strong><span>{form.symptoms.join(", ")}</span></li>
            <li><strong>Started</strong><span>{form.duration}</span></li>
            <li><strong>Severity</strong><span>{form.severity}/10</span></li>
          </ul>
          <div className="specialist-note"><span className="small-label">Consider speaking with</span><strong>{result.specialist_type}</strong><span className="muted">Recommendation only, not a diagnosis.</span></div>
        </section>
      </div>
      <section className="summary-card">
        <div><p className="eyebrow">Doctor-ready summary</p><h2>Take a clearer note with you.</h2><pre>{summary}</pre></div>
        <div className="summary-actions"><button className="button button-dark" type="button" onClick={copySummary}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : "Copy summary"}</button><button className="button button-outline" type="button" onClick={() => window.print()}>Print / save PDF</button></div>
      </section>
      <div className="disclaimer-row"><Volume2 size={16} /><span>This is AI-assisted health information, not a medical diagnosis. If you feel unsafe or symptoms worsen, seek professional or emergency care.</span></div>
      <button className="text-button" type="button" onClick={onRestart}><RotateCcw size={15} /> Start a new assessment</button>
    </div>
  );
}

export default function Assessment({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<AssessmentPayload>(initialForm);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [listening, setListening] = useState(false);
  const triage = trpc.triage.assess.useMutation({ onSuccess: data => { setResult(data); setStep(4); } });
  const region = form.region as BodyRegion;

  const setField = <K extends keyof AssessmentPayload>(key: K, value: AssessmentPayload[K]) => setForm(current => ({ ...current, [key]: value }));
  const toggleSymptom = (symptom: string) => setField("symptoms", form.symptoms.includes(symptom) ? form.symptoms.filter(item => item !== symptom) : [...form.symptoms, symptom]);

  const beginVoice = () => {
    const SpeechRecognition = (window as Window & { SpeechRecognition?: new () => { start: () => void; stop: () => void; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void } }).SpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    setListening(true);
    recognition.onresult = event => setField("details", `${form.details} ${event.results[0][0].transcript}`.trim());
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  if (step === 4 && result) return <Results form={form} result={result} onRestart={() => { setForm(initialForm); setResult(null); setStep(1); }} />;

  return (
    <main className="assessment-page">
      <header className="assessment-topbar"><button className="back-button" type="button" onClick={onBack}><ArrowLeft size={17} /> Back</button><div className="assessment-title"><span className="eyebrow">Assessment</span><strong>Step {step} of 3</strong></div><div className="step-track"><span style={{ width: `${(step / 3) * 100}%` }} /></div></header>
      <div className="assessment-content">
        {step === 1 && <section className="assessment-step step-body"><div className="step-copy"><p className="eyebrow">Start with location</p><h1>Where are you experiencing discomfort?</h1><p className="lede">Select an area on the model or use the shortcuts below. You can rotate and zoom the model at any time.</p><div className="selection-callout"><span className="small-label">Selected area</span><strong>{humanizeRegion(region)}</strong><span className="selection-dot" /></div><div className="region-grid">{Object.entries(regionLabels).map(([id, label]) => <button className={`region-button ${region === id ? "is-selected" : ""}`} key={id} type="button" onClick={() => setField("region", id as BodyRegion)}>{label}</button>)}</div><button className="button button-dark continue-button" type="button" onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></button></div><div className="model-stage"><div className="model-stage-header"><span>Interactive anatomy</span><span className="model-status"><span /> Drag to rotate</span></div><HumanBody selected={region} onSelect={selected => setField("region", selected)} /><p className="model-help">Tap a highlighted region to select it. The model uses your provided anatomy asset.</p></div></section>}
        {step === 2 && <section className="assessment-step"><div className="step-copy step-copy-wide"><p className="eyebrow">A little more context</p><h1>What are you experiencing?</h1><p className="lede">Choose everything that applies. This helps organize your description for a qualified professional.</p><div className="symptom-chips">{symptomOptions[region].map(symptom => <button className={`symptom-chip ${form.symptoms.includes(symptom) ? "is-selected" : ""}`} key={symptom} type="button" onClick={() => toggleSymptom(symptom)}>{form.symptoms.includes(symptom) && <Check size={14} />}{symptom}</button>)}</div><div className="question-block"><label htmlFor="severity">How severe is it? <strong>{form.severity}/10</strong></label><input id="severity" type="range" min="1" max="10" value={form.severity} onChange={event => setField("severity", Number(event.target.value))} /><div className="range-labels"><span>Mild</span><span>Severe</span></div></div><div className="two-column"><div className="question-block"><label htmlFor="duration">How long have you had it?</label><select id="duration" value={form.duration} onChange={event => setField("duration", event.target.value)}>{["Just now", "A few hours", "1–2 days", "Several days", "Longer"].map(value => <option key={value}>{value}</option>)}</select></div><div className="question-block"><label htmlFor="sudden">Did it start suddenly?</label><select id="sudden" value={form.suddenStart} onChange={event => setField("suddenStart", event.target.value)}>{["Yes", "No", "Not sure"].map(value => <option key={value}>{value}</option>)}</select></div></div><div className="question-block"><label htmlFor="details">Anything else you would like to tell us?</label><div className="textarea-wrap"><textarea id="details" value={form.details} onChange={event => setField("details", event.target.value)} placeholder="Add any details that feel relevant..." rows={4} /><button className={`voice-button ${listening ? "is-listening" : ""}`} type="button" onClick={beginVoice} title="Describe your symptoms by voice"><Mic size={16} /> {listening ? "Listening" : "Voice input"}</button></div></div><div className="step-actions"><button className="button button-outline" type="button" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button><button className="button button-dark" type="button" disabled={!form.symptoms.length} onClick={() => setStep(3)}>Continue <ArrowRight size={16} /></button></div></div></section>}

        {step === 3 && <section className="assessment-step"><div className="step-copy step-copy-medium"><p className="eyebrow">Optional context</p><h1>Anything useful for the next step?</h1><p className="lede">Only share what you are comfortable sharing. These details are optional and help make the guidance more relevant.</p><div className="form-grid"><label>Age<input value={form.age} onChange={event => setField("age", event.target.value)} placeholder="e.g. 34" inputMode="numeric" /></label><label>Sex <span className="optional">optional</span><select value={form.sex} onChange={event => setField("sex", event.target.value)}><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Non-binary</option></select></label><label>Known conditions<textarea value={form.conditions} onChange={event => setField("conditions", event.target.value)} placeholder="e.g. asthma, diabetes" rows={3} /></label><label>Current medications<textarea value={form.medications} onChange={event => setField("medications", event.target.value)} placeholder="List any regular medications" rows={3} /></label><label>Known allergies<textarea value={form.allergies} onChange={event => setField("allergies", event.target.value)} placeholder="Include medication allergies" rows={3} /></label></div><div className="step-actions"><button className="button button-outline" type="button" onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</button><button className="button button-dark" type="button" disabled={triage.isPending} onClick={() => triage.mutate(form)}>{triage.isPending ? "Reviewing..." : "Get guidance"} <ArrowRight size={16} /></button></div>{triage.error && <p className="form-error">We could not complete the assessment. Please try again or seek professional care if your symptoms are serious.</p>}</div><aside className="privacy-note"><Stethoscope size={19} /><strong>Your information, handled carefully.</strong><p>This prototype sends only the structured assessment you choose to submit to the server-side triage service. It does not make a diagnosis.</p></aside></section>}
      </div>
    </main>
  );
}
