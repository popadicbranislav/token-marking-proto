import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 2,
      warn: true,
    }),
  ],

  transformers: [
    transformerVariantGroup(),
  ],
})
