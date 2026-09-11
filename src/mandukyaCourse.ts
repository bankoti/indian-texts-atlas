import asset from './mandukyaOutline.json'
import type { MandukyaTeachingAsset } from './mandukyaTypes'

export const mandukyaTeachingAsset: Omit<MandukyaTeachingAsset, 'sources' | 'passages'> = asset
export const mandukyaSessions = mandukyaTeachingAsset.sessions
export const mandukyaOrientation = mandukyaTeachingAsset.orientation
export const mandukyaFinalSynthesis = mandukyaTeachingAsset.finalSynthesis
export const mandukyaInterpretiveLenses = mandukyaTeachingAsset.interpretiveLenses
