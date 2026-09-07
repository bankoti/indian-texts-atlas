export type DepthEditionDescriptor = {
  id: 'kena' | 'katha' | 'isha'
  title: string
  totalUnits: number
  unitLabel: string
  firstPassageId: string
  passageIds?: string[]
  sectionIds: string[]
  sectionSizes: Record<string, number>
  checkpointChoiceCount: number
  checkpointCorrectAnswers: Record<string, number>
}

export const depthEditionRegistry: Record<DepthEditionDescriptor['id'], DepthEditionDescriptor> = {
  kena: {
    id: 'kena',
    title: 'Kena Upaniṣad',
    totalUnits: 35,
    unitLabel: 'units',
    firstPassageId: '1.1',
    sectionIds: ['1', '2', '3', '4'],
    sectionSizes: { 1: 9, 2: 5, 3: 12, 4: 9 },
    checkpointChoiceCount: 4,
    checkpointCorrectAnswers: { 1: 1, 2: 2, 3: 2, 4: 1 },
  },
  katha: {
    id: 'katha',
    title: 'Kaṭha Upaniṣad',
    totalUnits: 119,
    unitLabel: 'numbered units',
    firstPassageId: '1.1.1',
    sectionIds: ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3'],
    sectionSizes: { '1.1': 29, '1.2': 25, '1.3': 17, '2.1': 15, '2.2': 15, '2.3': 18 },
    checkpointChoiceCount: 4,
    checkpointCorrectAnswers: { '1.1': 1, '1.2': 1, '1.3': 2, '2.1': 1, '2.2': 1, '2.3': 2 },
  },
  isha: {
    id: 'isha',
    title: 'Īśā Upaniṣad',
    totalUnits: 18,
    unitLabel: 'mantras',
    firstPassageId: '1',
    passageIds: Array.from({ length: 18 }, (_, index) => String(index + 1)),
    sectionIds: ['1', '2', '3'],
    sectionSizes: { 1: 8, 2: 6, 3: 4 },
    checkpointChoiceCount: 4,
    checkpointCorrectAnswers: { 1: 2, 2: 2, 3: 1 },
  },
}

export type DepthEditionId = keyof typeof depthEditionRegistry

export function getDepthEditionDescriptor(id: string): DepthEditionDescriptor | undefined {
  if (!Object.hasOwn(depthEditionRegistry, id)) return undefined
  return depthEditionRegistry[id as DepthEditionId]
}

export function isDepthEdition(id: string): id is DepthEditionId {
  return Boolean(getDepthEditionDescriptor(id))
}

export function expectedDepthPassageIds(descriptor: DepthEditionDescriptor): string[] {
  if (descriptor.passageIds) return descriptor.passageIds
  return descriptor.sectionIds.flatMap((sectionId) => (
    Array.from({ length: descriptor.sectionSizes[sectionId] }, (_, index) => `${sectionId}.${index + 1}`)
  ))
}

export function isValidDepthPassageId(editionId: string, passageId: string): boolean {
  const descriptor = getDepthEditionDescriptor(editionId)
  if (!descriptor) return false
  if (descriptor.passageIds) return descriptor.passageIds.includes(passageId)
  const segments = passageId.split('.')
  if (segments.some((segment) => !/^\d+$/.test(segment) || String(Number(segment)) !== segment)) return false
  const number = Number(segments.at(-1))
  const sectionId = segments.slice(0, -1).join('.')
  return descriptor.sectionIds.includes(sectionId)
    && number >= 1
    && number <= descriptor.sectionSizes[sectionId]
    && passageId === `${sectionId}.${number}`
}
