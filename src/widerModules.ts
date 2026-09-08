import vedicEpic from './vedicEpicGuides.json'
import philosophy from './philosophyGuides.json'
import culture from './cultureGuides.json'
import type { WiderModule } from './guidedTypes'

export const widerModules: Record<string, WiderModule> = { ...vedicEpic, ...philosophy, ...culture }
