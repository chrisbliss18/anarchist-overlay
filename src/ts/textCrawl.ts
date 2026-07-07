import {moduleId} from "./constants";

export type TextCrawlFrameType =
  | 'none'
  | 'cinematic-bars'
  | 'horizontal-bar'
  | 'lower-third'
  | 'terminal-panel'
  | 'alert-banner'
  | 'chyron';
export type TextCrawlEffectType = 'typewriter' | 'scroll' | 'none';
export type TextCrawlAlignment = 'start' | 'center' | 'end';

export type TextCrawlFrameConfig = {
  type?: TextCrawlFrameType;
};

export type TextCrawlEffectConfig = {
  type?: TextCrawlEffectType;
  duration?: number;
  loop?: boolean;
  separator?: string;
};

type TextCrawlLineConfig = {
  text: string;
  fontSize?: string;
};

export type TextCrawlConfig = {
  offsetX?: string;
  offsetY?: string;
  alignX?: TextCrawlAlignment;
  textAlign?: TextCrawlAlignment;
  maxWidth?: string;
  typingTime?: number;
  delay?: number;
  frame?: TextCrawlFrameConfig;
  effect?: TextCrawlEffectConfig;
  lines: TextCrawlLineConfig[];
  glitchEffect?: { time: number } | false;
};

type NormalizedTextCrawlLineConfig = Required<TextCrawlLineConfig>;

type NormalizedTextCrawlEffectConfig = {
  type: TextCrawlEffectType;
  duration: number;
  loop: boolean;
  separator: string;
};

type NormalizedConfig = {
  offsetX: string;
  offsetY: string;
  alignX: TextCrawlAlignment;
  alignXCss: string;
  textAlign: TextCrawlAlignment;
  textAlignCss: string;
  maxWidth: string;
  typingTime: number;
  delay: number;
  frame: Required<TextCrawlFrameConfig>;
  effect: NormalizedTextCrawlEffectConfig;
  frameTypeClass: string;
  effectTypeClass: string;
  isScrollEffect: boolean;
  isTypewriterEffect: boolean;
  showCinematicBars: boolean;
  scrollDuration: number;
  scrollIterationCount: string;
  lines: NormalizedTextCrawlLineConfig[];
  glitchEffect: { time: number } | false;
};

const defaultFrameType: TextCrawlFrameType = 'cinematic-bars';
const defaultTypewriterDurationSeconds = 2;
const defaultTypewriterDelaySeconds = 1;
const defaultScrollDurationSeconds = 18;
const defaultStaticDisplaySeconds = 2.5;
const defaultScrollSeparator = ' // ';

export const createTextCrawlHtml = async (config: TextCrawlConfig) => {
  const normalizedConfig = normalizeConfig(config);
  return await renderTemplate(`modules/${moduleId}/templates/text-crawl.hbs`, {
    ...normalizedConfig,
    lines: normalizedConfig.lines.map((line, index) => ({
      ...line,
      typingTime: normalizedConfig.typingTime,
      textLength: line.text.length,
      cursorDelay: (normalizedConfig.typingTime + normalizedConfig.delay) * 2,
      startDelay: (normalizedConfig.delay + normalizedConfig.typingTime) * index,
      isLastLine: index === normalizedConfig.lines.length - 1,
      isTypewriterEffect: normalizedConfig.isTypewriterEffect,
      glitchEffect: normalizedConfig.glitchEffect
    })),
    scrollLines: normalizedConfig.lines.map(line => ({
      ...line,
      separator: normalizedConfig.effect.separator
    }))
  });
}

export const resolveTextCrawlFrameType = (frameType?: string): TextCrawlFrameType => {
  const resolvedFrameType = frameType ?? defaultFrameType;
  if (
    resolvedFrameType === 'none'
    || resolvedFrameType === 'cinematic-bars'
    || resolvedFrameType === 'horizontal-bar'
    || resolvedFrameType === 'lower-third'
    || resolvedFrameType === 'terminal-panel'
    || resolvedFrameType === 'alert-banner'
    || resolvedFrameType === 'chyron'
  ) {
    return resolvedFrameType;
  }

  throw new Error(`Unknown text crawl frame type "${resolvedFrameType}". Expected "none", "cinematic-bars", "horizontal-bar", "lower-third", "terminal-panel", "alert-banner", or "chyron".`);
};

export const resolveTextCrawlEffectType = (
  effectType?: string,
  frameType: TextCrawlFrameType = defaultFrameType
): TextCrawlEffectType => {
  const resolvedEffectType = effectType ?? (frameType === 'chyron' ? 'scroll' : 'typewriter');
  if (
    resolvedEffectType === 'typewriter'
    || resolvedEffectType === 'scroll'
    || resolvedEffectType === 'none'
  ) {
    return resolvedEffectType;
  }

  throw new Error(`Unknown text crawl effect type "${resolvedEffectType}". Expected "typewriter", "scroll", or "none".`);
};

export const validateTextCrawlConfig = (config: TextCrawlConfig) => {
  const frameType = resolveTextCrawlFrameType(config.frame?.type);
  const effectType = resolveTextCrawlEffectType(config.effect?.type, frameType);
  resolveTextCrawlAlignment(config.alignX, 'alignX');
  resolveTextCrawlAlignment(config.textAlign, 'textAlign');
  validateTextCrawlEffectConfig(config.effect);
  validateTextCrawlEffectFrameCompatibility(frameType, effectType);
};

const resolveTextCrawlAlignment = (
  alignment: string | undefined,
  fieldName: 'alignX' | 'textAlign'
): TextCrawlAlignment => {
  const resolvedAlignment = alignment ?? 'start';
  if (resolvedAlignment === 'start' || resolvedAlignment === 'center' || resolvedAlignment === 'end') {
    return resolvedAlignment;
  }

  throw new Error(`Unknown text crawl ${fieldName} value "${resolvedAlignment}". Expected "start", "center", or "end".`);
};

const getCssAlignment = (alignment: TextCrawlAlignment) => {
  if (alignment === 'center') {
    return 'center';
  }

  return alignment === 'end' ? 'flex-end' : 'flex-start';
};

export const isTextCrawlTypewriterEffect = (config: TextCrawlConfig) => {
  const frameType = resolveTextCrawlFrameType(config.frame?.type);
  return resolveTextCrawlEffectType(config.effect?.type, frameType) === 'typewriter';
};

export const getTextCrawlDisplayDurationMs = (text?: TextCrawlConfig) => {
  if (!text?.lines.length) {
    return 1500;
  }

  const frameType = resolveTextCrawlFrameType(text.frame?.type);
  const effectType = resolveTextCrawlEffectType(text.effect?.type, frameType);
  validateTextCrawlEffectConfig(text.effect);
  validateTextCrawlEffectFrameCompatibility(frameType, effectType);

  if (effectType === 'scroll') {
    return ((text.effect?.duration ?? defaultScrollDurationSeconds) + 1) * 1000;
  }

  if (effectType === 'none') {
    return Math.max(defaultStaticDisplaySeconds, text.lines.length * 0.8) * 1000;
  }

  const typingTime = text.typingTime ?? defaultTypewriterDurationSeconds;
  const delay = text.delay ?? defaultTypewriterDelaySeconds;
  const totalSeconds = ((text.lines.length - 1) * (typingTime + delay)) + typingTime + 1;
  return totalSeconds * 1000;
};

const normalizeConfig = (config: TextCrawlConfig): NormalizedConfig => {
  const frameType = resolveTextCrawlFrameType(config.frame?.type);
  const effectType = resolveTextCrawlEffectType(config.effect?.type, frameType);
  const alignX = resolveTextCrawlAlignment(config.alignX, 'alignX');
  const textAlign = resolveTextCrawlAlignment(config.textAlign, 'textAlign');
  validateTextCrawlEffectConfig(config.effect);
  validateTextCrawlEffectFrameCompatibility(frameType, effectType);
  const effect = {
    type: effectType,
    duration: config.effect?.duration ?? defaultScrollDurationSeconds,
    loop: config.effect?.loop ?? effectType === 'scroll',
    separator: config.effect?.separator ?? defaultScrollSeparator
  };

  return {
    offsetX: config.offsetX ?? '0',
    offsetY: config.offsetY ?? '0',
    alignX,
    alignXCss: getCssAlignment(alignX),
    textAlign,
    textAlignCss: getCssAlignment(textAlign),
    maxWidth: config.maxWidth ?? 'max-content',
    typingTime: config.typingTime ?? defaultTypewriterDurationSeconds,
    delay: config.delay ?? defaultTypewriterDelaySeconds,
    frame: {
      type: frameType
    },
    effect,
    frameTypeClass: `text-crawl--${frameType}`,
    effectTypeClass: `text-crawl--effect-${effectType}`,
    isScrollEffect: effectType === 'scroll',
    isTypewriterEffect: effectType === 'typewriter',
    showCinematicBars: frameType === 'cinematic-bars',
    scrollDuration: effect.duration,
    scrollIterationCount: effect.loop ? 'infinite' : '1',
    lines: config.lines.map(line => ({text: line.text, fontSize: line.fontSize ?? '32px'})),
    glitchEffect: config.glitchEffect ?? false
  };
}

const validateTextCrawlEffectConfig = (effect?: TextCrawlEffectConfig) => {
  if (effect?.duration === undefined) {
    return;
  }

  if (!Number.isFinite(effect.duration) || effect.duration <= 0) {
    throw new Error('Text crawl effect duration must be a positive number of seconds.');
  }
};

const validateTextCrawlEffectFrameCompatibility = (
  frameType: TextCrawlFrameType,
  effectType: TextCrawlEffectType
) => {
  if (effectType !== 'scroll' || isScrollCompatibleFrameType(frameType)) {
    return;
  }

  throw new Error('Text crawl effect "scroll" is only supported with frame types "chyron", "horizontal-bar", or "alert-banner".');
};

const isScrollCompatibleFrameType = (frameType: TextCrawlFrameType) => {
  return frameType === 'chyron' || frameType === 'horizontal-bar' || frameType === 'alert-banner';
};
