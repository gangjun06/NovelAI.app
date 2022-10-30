export interface ImageInfo {
  program: 'novelAI' | 'webUI'
  prompt: string
  negativePrompt: string
  steps: number
  strength: number
  seed: number
  scale: number
  sampler: string
  noise?: number
  clipSkip?: number
  width: number
  height: number
  modelHash?: string
}
