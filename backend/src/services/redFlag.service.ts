export type RedFlagResult = {
  redFlags: string[];
  riskScore: number;
};

const rules: Array<{ label: string; score: number; patterns: RegExp[] }> = [
  {
    label: "Requests upfront payment or training fee",
    score: 25,
    patterns: [/registration fee/i, /training fee/i, /security deposit/i, /pay.*(fee|deposit|amount)/i]
  },
  {
    label: "Promises unrealistic stipend or guaranteed selection",
    score: 15,
    patterns: [/guaranteed (selection|job|offer)/i, /no interview/i, /earn.*(daily|weekly)/i, /too good to be true/i]
  },
  {
    label: "Uses pressure tactics or urgency",
    score: 15,
    patterns: [/urgent/i, /limited seats/i, /apply immediately/i, /last chance/i, /today only/i]
  },
  {
    label: "Asks for sensitive documents early",
    score: 20,
    patterns: [/bank details/i, /aadhaar/i, /passport/i, /ssn/i, /social security/i, /otp/i]
  },
  {
    label: "Suspicious communication channel",
    score: 10,
    patterns: [/telegram/i, /whatsapp only/i, /personal email/i, /gmail\.com/i, /yahoo\.com/i]
  },
  {
    label: "Vague company or role details",
    score: 15,
    patterns: [/work from home.*easy/i, /data entry/i, /no experience required/i, /investment/i]
  }
];

export const detectRedFlags = (text: string, feeAmount?: number | null): RedFlagResult => {
  const redFlags = rules
    .filter((rule) => rule.patterns.some((pattern) => pattern.test(text)))
    .map((rule) => rule.label);

  let riskScore = rules
    .filter((rule) => redFlags.includes(rule.label))
    .reduce((total, rule) => total + rule.score, 0);

  if (feeAmount && feeAmount > 0 && !redFlags.includes("Requests upfront payment or training fee")) {
    redFlags.push("Mentions a monetary fee");
    riskScore += 20;
  }

  return {
    redFlags,
    riskScore: Math.min(riskScore, 100)
  };
};
