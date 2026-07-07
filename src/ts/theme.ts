export type PresentationThemeType =
  | 'industrial'
  | 'terminal'
  | 'scanline'
  | 'alert'
  | 'hologram'
  | 'classified'
  | 'clean';

export type PresentationThemeConfig = {
  type?: PresentationThemeType;
};

export const defaultPresentationThemeType: PresentationThemeType = 'industrial';

export const resolvePresentationThemeType = (
  themeType?: string,
  fallbackThemeType: PresentationThemeType = defaultPresentationThemeType
): PresentationThemeType => {
  const resolvedThemeType = themeType ?? fallbackThemeType;
  if (
    resolvedThemeType === 'industrial'
    || resolvedThemeType === 'terminal'
    || resolvedThemeType === 'scanline'
    || resolvedThemeType === 'alert'
    || resolvedThemeType === 'hologram'
    || resolvedThemeType === 'classified'
    || resolvedThemeType === 'clean'
  ) {
    return resolvedThemeType;
  }

  throw new Error(`Unknown presentation theme type "${resolvedThemeType}". Expected "industrial", "terminal", "scanline", "alert", "hologram", "classified", or "clean".`);
};
