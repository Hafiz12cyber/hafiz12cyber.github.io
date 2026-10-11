export const provinces = ['Agusan del Norte', 'Agusan del Sur', 'Surigao del Norte', 'Surigao del Sur', 'Province of Dinagat Islands']

export const municipalitiesByProvince: Record<string, string[]> = {
  'Agusan del Norte': ['Buenavista', 'Carmen', 'Jabonga', 'Kitcharao', 'Las Nieves', 'Magallanes', 'Nasipit', 'Remedios T. Romualdez', 'Santiago', 'Tubay'],
  'Agusan del Sur': ['Bunawan', 'Esperanza', 'La Paz', 'Loreto', 'Prosperidad', 'Rosario', 'San Francisco', 'San Luis', 'Santa Josefa', 'Sibagat', 'Talacogon', 'Trento', 'Veruela'],
  'Surigao del Norte': ['Alegria', 'Bacuag', 'Burgos', 'Claver', 'Dapa', 'Del Carmen', 'General Luna', 'Gigaquit', 'Mainit', 'Malimono', 'Pilar', 'Placer', 'San Benito', 'San Francisco', 'San Isidro', 'Santa Monica', 'Sison', 'Socorro', 'Tagana-an', 'Tubod'],
  'Surigao del Sur': ['Barobo', 'Bayabas', 'Cagwait', 'Cantilan', 'Carmen', 'Carrascal', 'Cortes', 'Hinatuan', 'Lanuza', 'Lianga', 'Lingig', 'Madrid', 'Marihatag', 'San Agustin', 'San Miguel', 'Tagbina', 'Tago'],
  'Province of Dinagat Islands': ['Basilisa', 'Cagdianao', 'Dinagat', 'Libjo', 'Loreto', 'San Jose', 'Tubajon'],
}

export interface Office { name: string; abbreviation: string; scope: 'province' | 'municipality' | 'designated'; options?: string[] }
export const offices: Office[] = [
  { name: 'Agricultural Program Coordinating Office', abbreviation: 'apco', scope: 'province' },
  { name: 'Municipal Agriculture Office', abbreviation: 'mao', scope: 'municipality' },
  { name: 'Provincial Agriculture Office', abbreviation: 'pao', scope: 'province' },
  { name: 'Provincial Coordination and Management Office', abbreviation: 'pcmo', scope: 'province' },
  { name: 'Regional Coordination and Management Office', abbreviation: 'rcmo', scope: 'designated', options: ['Data Analyst', 'Budget Officer', 'Team Lead'] },
  { name: 'Department of Agriculture', abbreviation: 'da', scope: 'designated', options: ['Regional AgriStat Focal Person', 'Regional AgriStat Alternate Focal Person'] },
]

export function expandedOfficeName(officeValue: string) {
  return offices.find((office) => office.name === officeValue || office.abbreviation.toLowerCase() === officeValue.toLowerCase())?.name ?? officeValue
}

export function expandedDesignation(officeValue: string, designation: string) {
  const officeName = expandedOfficeName(officeValue)
  const prefix = `${officeValue} - `
  const fullPrefix = `${officeName} - `
  const remainder = designation.startsWith(prefix) ? designation.slice(prefix.length) : designation.startsWith(fullPrefix) ? designation.slice(fullPrefix.length) : null
  return remainder === null ? designation : `${officeName} - ${remainder}`
}
