# Fonts

| File                         | Family                                                   | Weight                 |
| ---------------------------- | -------------------------------------------------------- | ---------------------- |
| `cormorant-300.woff2`        | [Cormorant](https://github.com/CatharsisFonts/Cormorant) | 300, static            |
| `cormorant-italic-400.woff2` | Cormorant Italic                                         | 400, static            |
| `inter-tight.woff2`          | [Inter Tight](https://github.com/rsms/inter)             | 300–500, variable axis |

Both families are licensed under the SIL Open Font License 1.1, which allows
bundling and redistribution.

The files are cut down with `fontTools` from the upstream variable fonts to what the
site uses: Basic Latin, Russian Cyrillic, typographic punctuation (dashes, quotes,
non-breaking spaces), `₽`, `№`, arrows and `×`, with the `kern`, `liga`, `calt`, `case`,
`locl` and numeral features kept. The serif is set in a single light roman and a single
italic, so those are static instances; the sans needs three weights, which a variable
font covers in one file. Together that is about 70 KB.

To use another weight, instance it from the upstream font the same way and add it to
`src/app/fonts.ts`; a weight that is not listed there falls back to the closest one.

The static `.ttf` instances in `src/assets/og/` are used only to render Open Graph
images, because Satori does not read WOFF2.
