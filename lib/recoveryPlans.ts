/**
 * Recommended recovery plans mapped by injury type keyword + severity.
 * The keys are lowercase keywords that get matched against the user's injury type.
 */

export interface RecoveryPlanTemplate {
  label: string;
  keywords: string[];
  plans: Record<'minor' | 'moderate' | 'severe', string[]>;
}

export const RECOVERY_TEMPLATES: RecoveryPlanTemplate[] = [
  {
    label: 'Hamstring Strain',
    keywords: ['hamstring', 'ham string'],
    plans: {
      minor: [
        'Rest for 2-3 days',
        'Apply ice 15-20 min, 3x daily',
        'Gentle hamstring stretches',
        'Light walking as tolerated',
        'Gradually return to jogging',
      ],
      moderate: [
        'Rest for 5-7 days — no running',
        'Ice + compression 3x daily',
        'Anti-inflammatory medication as directed',
        'Begin gentle stretching after 3 days',
        'Physical therapy — 2x per week',
        'Progressive strengthening exercises',
        'Gradual return to sport over 2-3 weeks',
      ],
      severe: [
        'Complete rest for 2 weeks minimum',
        'Consult orthopedic specialist',
        'Ice + compression + elevation daily',
        'MRI to assess tear grade',
        'Physical therapy — 3x per week',
        'Progressive rehab protocol (6-8 weeks)',
        'Sport-specific drills before full return',
        'Clearance from doctor before competition',
      ],
    },
  },
  {
    label: 'Ankle Sprain',
    keywords: ['ankle', 'sprain'],
    plans: {
      minor: [
        'RICE protocol for 48 hours',
        'Ankle brace or taping for support',
        'Range of motion exercises',
        'Balance exercises on stable surface',
        'Return to activity in 1-2 weeks',
      ],
      moderate: [
        'RICE protocol for 72 hours',
        'Ankle brace — wear during all activity',
        'No weight-bearing sports for 1 week',
        'Physical therapy for ankle stability',
        'Progressive balance training',
        'Strengthening with resistance bands',
        'Gradual return to sport over 3-4 weeks',
      ],
      severe: [
        'Immobilization (boot/cast) for 1-2 weeks',
        'Consult orthopedic specialist',
        'X-ray to rule out fracture',
        'No weight-bearing for 1-2 weeks',
        'Physical therapy — 3x per week for 6 weeks',
        'Progressive balance and proprioception training',
        'Sport-specific agility drills before return',
        'Clearance from doctor before competition',
      ],
    },
  },
  {
    label: 'Knee Injury',
    keywords: ['knee', 'acl', 'mcl', 'meniscus', 'patellar', 'patella'],
    plans: {
      minor: [
        'Rest and ice for 2-3 days',
        'Compression wrap or knee sleeve',
        'Gentle quad and hamstring stretches',
        'Low-impact activity (swimming/cycling)',
        'Return to sport when pain-free',
      ],
      moderate: [
        'Rest — avoid impact activity for 1-2 weeks',
        'Ice and compression daily',
        'Consult sports medicine doctor',
        'Physical therapy — 2x per week',
        'Quad and hip strengthening',
        'Gradual return to running on flat surfaces',
        'Knee brace during activity for 4 weeks',
      ],
      severe: [
        'Consult orthopedic surgeon immediately',
        'MRI for structural assessment',
        'Possible surgical intervention',
        'Post-op physical therapy (if surgical)',
        'Progressive rehab — 3-6 months',
        'No impact activity until cleared',
        'Full functional testing before return',
        'Clearance from surgeon before competition',
      ],
    },
  },
  {
    label: 'Shoulder Injury',
    keywords: ['shoulder', 'rotator cuff', 'rotator', 'deltoid'],
    plans: {
      minor: [
        'Rest from overhead activities for 3-5 days',
        'Ice 15-20 min, 3x daily',
        'Gentle pendulum exercises',
        'Gradual return to range of motion',
        'Strengthen rotator cuff with bands',
      ],
      moderate: [
        'Rest from upper body activity for 1-2 weeks',
        'Ice and anti-inflammatory medication',
        'Physical therapy — 2x per week',
        'Rotator cuff strengthening program',
        'Scapular stabilization exercises',
        'Gradual return to throwing/overhead activity',
      ],
      severe: [
        'Consult orthopedic specialist',
        'MRI or ultrasound for structural assessment',
        'Possible surgical intervention',
        'Sling immobilization if directed',
        'Physical therapy — 3x per week',
        'Progressive rehab — 3-6 months',
        'Clearance from doctor before competition',
      ],
    },
  },
  {
    label: 'Shin Splints',
    keywords: ['shin', 'tibia', 'shin splint'],
    plans: {
      minor: [
        'Reduce running volume by 50%',
        'Ice after activity for 15 min',
        'Calf stretches and foam rolling',
        'Check footwear — replace if worn',
        'Gradually increase mileage over 2 weeks',
      ],
      moderate: [
        'Stop running for 1-2 weeks',
        'Cross-train with low-impact cardio',
        'Ice and compression daily',
        'Calf and tibialis strengthening',
        'Gait analysis / shoe fitting',
        'Gradual return to running on soft surfaces',
      ],
      severe: [
        'Stop all impact activity — possible stress fracture',
        'Consult sports medicine doctor',
        'Bone scan or MRI to rule out stress fracture',
        'Rest for 4-6 weeks minimum',
        'Cross-train with swimming/cycling only',
        'Progressive return under medical guidance',
        'Clearance from doctor before running',
      ],
    },
  },
  {
    label: 'Back / Spine Injury',
    keywords: ['back', 'spine', 'lumbar', 'disc', 'lower back'],
    plans: {
      minor: [
        'Avoid heavy lifting for 3-5 days',
        'Ice or heat as comfortable',
        'Gentle walking and stretching',
        'Core activation exercises',
        'Maintain good posture',
      ],
      moderate: [
        'Rest from sport for 1-2 weeks',
        'Anti-inflammatory medication as directed',
        'Physical therapy — 2x per week',
        'Core strengthening program',
        'Avoid flexion/rotation under load',
        'Gradual return to sport activity',
      ],
      severe: [
        'Consult spine specialist',
        'MRI for disc/nerve assessment',
        'Possible injection or surgical referral',
        'Physical therapy — 3x per week',
        'Progressive core rehabilitation',
        'No contact or impact sport until cleared',
        'Clearance from specialist before competition',
      ],
    },
  },
  {
    label: 'Quad / Thigh Strain',
    keywords: ['quad', 'quadricep', 'thigh', 'hip flexor'],
    plans: {
      minor: [
        'Rest for 2-3 days',
        'Ice 15-20 min, 3x daily',
        'Gentle quad stretches',
        'Light cycling or walking',
        'Gradual return to running',
      ],
      moderate: [
        'Rest for 5-7 days',
        'Ice + compression 3x daily',
        'Physical therapy — 2x per week',
        'Progressive quad strengthening',
        'No sprinting for 2-3 weeks',
        'Gradual return to sport',
      ],
      severe: [
        'Complete rest for 2 weeks',
        'Consult sports medicine doctor',
        'Ultrasound or MRI to assess tear',
        'Physical therapy — 3x per week',
        'Progressive rehab for 6-8 weeks',
        'Clearance from doctor before competition',
      ],
    },
  },
  {
    label: 'Concussion',
    keywords: ['concussion', 'head', 'brain'],
    plans: {
      minor: [
        'Cognitive and physical rest for 24-48 hours',
        'Avoid screens and bright lights',
        'Monitor symptoms closely',
        'Gradual return to light activity when symptom-free',
        'Follow return-to-play protocol',
      ],
      moderate: [
        'Complete rest until symptom-free',
        'Consult concussion specialist',
        'Baseline cognitive testing',
        'Gradual 5-step return-to-play protocol',
        'No contact until cleared by doctor',
        'Monitor for delayed symptoms for 2 weeks',
      ],
      severe: [
        'Emergency medical evaluation',
        'Neuroimaging (CT/MRI)',
        'Complete rest — no school or sport',
        'Specialist follow-up within 48 hours',
        'Extended return-to-play protocol (4+ weeks)',
        'Neuropsychological testing before return',
        'Clearance from neurologist before competition',
      ],
    },
  },
  {
    label: 'Groin / Adductor Strain',
    keywords: ['groin', 'adductor', 'hip'],
    plans: {
      minor: [
        'Rest for 2-3 days',
        'Ice 15-20 min, 3x daily',
        'Gentle adductor stretches',
        'Light walking',
        'Gradual return to lateral movement',
      ],
      moderate: [
        'Rest for 1-2 weeks',
        'Ice and compression daily',
        'Physical therapy — 2x per week',
        'Progressive adductor strengthening',
        'No cutting/pivoting for 3 weeks',
        'Gradual return to full training',
      ],
      severe: [
        'Complete rest for 2+ weeks',
        'Consult sports medicine specialist',
        'MRI to assess tear',
        'Physical therapy — 3x per week',
        'Progressive rehab for 6-8 weeks',
        'Clearance from doctor before competition',
      ],
    },
  },
  {
    label: 'Wrist / Hand Injury',
    keywords: ['wrist', 'hand', 'finger', 'thumb'],
    plans: {
      minor: [
        'Buddy tape or splint for support',
        'Ice for 15 min, 3x daily',
        'Range of motion exercises',
        'Avoid gripping activities for 3-5 days',
        'Return to activity when pain-free',
      ],
      moderate: [
        'Splint immobilization for 1-2 weeks',
        'X-ray to rule out fracture',
        'Ice and anti-inflammatory medication',
        'Hand therapy exercises',
        'Gradual return to gripping activities',
      ],
      severe: [
        'Consult hand/orthopedic specialist',
        'X-ray and possible MRI',
        'Cast or surgical referral if fracture',
        'Hand therapy — 2x per week',
        'Progressive rehabilitation',
        'Clearance from specialist before return',
      ],
    },
  },
];

/**
 * Finds the best matching recovery plan for a given injury type and severity.
 * Returns null if no match is found.
 */
export function getRecommendedPlan(
  injuryType: string,
  severity: 'minor' | 'moderate' | 'severe'
): { label: string; steps: string[] } | null {
  const lower = injuryType.toLowerCase();

  for (const template of RECOVERY_TEMPLATES) {
    if (template.keywords.some((kw) => lower.includes(kw))) {
      return { label: template.label, steps: template.plans[severity] };
    }
  }

  return null;
}

/**
 * Returns all available template labels for dropdown selection.
 */
export function getAllTemplateLabels(): string[] {
  return RECOVERY_TEMPLATES.map((t) => t.label);
}

/**
 * Gets a plan by exact template label and severity.
 */
export function getPlanByLabel(
  label: string,
  severity: 'minor' | 'moderate' | 'severe'
): string[] | null {
  const template = RECOVERY_TEMPLATES.find((t) => t.label === label);
  return template ? template.plans[severity] : null;
}
