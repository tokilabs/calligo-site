declare module 'astro-imagetools' {
  export type * from 'astro-imagetools/types.d.ts';

  export type format =
    | 'heic'
    | 'heif'
    | 'avif'
    | 'jpg'
    | 'jpeg'
    | 'png'
    | 'tiff'
    | 'webp'
    | 'gif';

  // ... (include all other type and interface declarations here)

  export interface PictureConfigOptions
    extends ConfigOptions,
      ObjectStyles,
      PictureFormatOptions {
    artDirectives?: ArtDirective[];
    attributes?: Omit<Attributes, 'container'>;
    fadeInTransition?:
      | boolean
      | {
          delay?: string;
          duration?: string;
          timingFunction?: string;
        };
  }

  // ... (include all other exported interfaces here)

  export const astroImageTools: {
    name: string;
    hooks: {
      'astro:config:setup': Function;
      'astro:build:done': Function;
    };
  };

  export default astroImageTools;
}
