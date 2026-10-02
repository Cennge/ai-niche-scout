// How crowded an idea is, based on how many AI startups match it.
// The thresholds are a heuristic and are explained on /about.

export type Verdict = {
  label: string
  description: string
  level: 1 | 2 | 3 | 4
}

export const VERDICTS: (Verdict & { min: number })[] = [
  {
    min: 1000,
    level: 4,
    label: "Crowded",
    description: "A mature space. You will need a sharp angle or a narrower audience to stand out.",
  },
  {
    min: 200,
    level: 3,
    label: "Competitive",
    description: "Plenty of players already. Study the leaders and find what they leave out.",
  },
  {
    min: 20,
    level: 2,
    label: "Emerging",
    description: "A handful of startups are testing this. There is room, and proof that people care.",
  },
  {
    min: 0,
    level: 1,
    label: "Open field",
    description: "Almost nobody builds this yet. Check that the demand is real before you start.",
  },
]

export function getVerdict(competitors: number): Verdict {
  return VERDICTS.find((v) => competitors >= v.min) ?? VERDICTS[VERDICTS.length - 1]
}
