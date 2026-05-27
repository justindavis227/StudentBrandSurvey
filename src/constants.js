const BASE = 'https://vhiqgsubnpubclloavqc.supabase.co/storage/v1/object/public/survey-assets'

export const INTRO_IMAGES = [
  `${BASE}/Screenshot%202026-05-26%20at%207.42.29%20PM.png`,
  `${BASE}/Screenshot%202026-05-26%20at%207.42.42%20PM.png`,
  `${BASE}/Screenshot%202026-05-26%20at%207.43.08%20PM.png`,
  `${BASE}/Screenshot%202026-05-26%20at%207.43.23%20PM.png`,
  `${BASE}/Screenshot%202026-05-26%20at%207.43.33%20PM.png`,
  `${BASE}/Screenshot%202026-05-26%20at%207.43.44%20PM.png`,
  `${BASE}/Screenshot%202026-05-26%20at%207.43.58%20PM.png`,
  `${BASE}/Screenshot%202026-05-26%20at%207.44.09%20PM.png`,
]

export const LOGO_OPTIONS = [
  { value: 'A', label: 'Icon + Wordmark', desc: 'Bold "i" mark beside the name', img: `${BASE}/logo-a.png` },
  { value: 'B', label: 'Solid Wordmark',  desc: 'Clean bold type, nothing extra',  img: `${BASE}/logo-b.png` },
  { value: 'C', label: 'Outline Type',    desc: 'Hollow / stroked letterforms',    img: `${BASE}/logo-c.png` },
  { value: 'D', label: 'Block Badge',     desc: 'Name inside a dark rectangle',    img: `${BASE}/logo-d.png` },
  { value: 'E', label: 'Circle Stamp',    desc: 'Round badge with "S" at center',  img: `${BASE}/logo-e.png` },
  { value: 'F', label: 'S Monogram',      desc: 'Just the bold "S" alone',         img: `${BASE}/logo-f.png` },
]

export const ILLUS_OPTIONS = [
  { value: 'bull',      label: 'Bull',         img: `${BASE}/illus-bull.png` },
  { value: 'avalanche', label: 'Avalanche',     img: `${BASE}/illus-avalanche.png` },
  { value: 'coil',      label: 'Coil',          img: `${BASE}/illus-coil.png` },
  { value: 'kite',      label: 'Kite & Anchor', img: `${BASE}/illus-kite.png` },
  { value: 'volcano',   label: 'Volcano',        img: `${BASE}/illus-volcano.png` },
  { value: 'match',     label: 'Match',          img: `${BASE}/illus-match.png` },
  { value: 'dominoes',  label: 'Dominoes',       img: `${BASE}/illus-dominoes.png` },
]

export const TAG_OPTIONS = [
  { value: 'bold-logo',        label: 'Bold logo type' },
  { value: 'color-palette',    label: 'The color palette' },
  { value: 'ember-orange',     label: 'Ember orange energy' },
  { value: 'blue-rasp',        label: 'Blue Rasp accent' },
  { value: 'solar-yellow',     label: 'Solar yellow pop' },
  { value: 'illustrations',    label: 'The illustrations' },
  { value: 'icons-symbols',    label: 'Icons & symbols' },
  { value: 'diagonal-stripes', label: 'Diagonal stripe patterns' },
  { value: 'typography',       label: 'The typography / fonts' },
  { value: 'dark-background',  label: 'Dark / Pitch background' },
  { value: 'social-look',      label: 'How it looks on social' },
  { value: 'merch-look',       label: 'How it looks on merch' },
  { value: 'overall-vibe',     label: 'The overall vibe' },
  { value: 'one-pattern',      label: '"1" repeated pattern' },
  { value: 'pattern-accents',  label: 'Pattern icons / accents' },
]

export const COLOR_OPTIONS = [
  { value: 'fire',      label: 'Fire',      hex: '#c0392b' },
  { value: 'pitch',     label: 'Pitch',     hex: '#07080a', border: true },
  { value: 'blue-rasp', label: 'Blue Rasp', hex: '#18a8d5' },
  { value: 'ember',     label: 'Ember',     hex: '#e05a00' },
  { value: 'glacier',   label: 'Glacier',   hex: '#daeef8', border: true },
]
