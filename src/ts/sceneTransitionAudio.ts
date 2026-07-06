import type { TextCrawlConfig } from './textCrawl';
import type {
  AudioHelperGlobal,
  SceneTransitionSounds,
  TransitionAudio,
  TransitionController,
  TransitionSound
} from './sceneTransitionTypes';

export const startTypingAudio = (
  text: TextCrawlConfig,
  sounds: Required<SceneTransitionSounds>,
  controller: TransitionController
): TransitionAudio | undefined => {
  if (!sounds.typingClick) {
    return undefined;
  }

  return scheduleTypingClicks(text, sounds.typingClick, sounds.typingVolume, controller);
};

export const playSound = async (src: string, volume: number, loop = false) => {
  if (!src) {
    return undefined;
  }

  try {
    const audioHelper = (globalThis as typeof globalThis & { AudioHelper?: AudioHelperGlobal }).AudioHelper;
    if (audioHelper) {
      return await audioHelper.play({ src, volume, loop }, false);
    }

    const fallbackSound = (game as ReadyGame).audio.create({ src });
    fallbackSound.volume = volume;
    await fallbackSound.load();
    await fallbackSound.play({ loop });
    return fallbackSound;
  } catch (error) {
    console.warn(`Anarchist Overlay | Unable to play sound "${src}".`, error);
    return undefined;
  }
};

const scheduleTypingClicks = (
  text: TextCrawlConfig,
  src: string,
  volume: number,
  controller: TransitionController
): TransitionAudio => {
  const timers: number[] = [];
  const typingTimeMs = (text.typingTime ?? 2) * 1000;
  const delayMs = (text.delay ?? 1) * 1000;
  const lineDelayMs = typingTimeMs + delayMs;

  text.lines.forEach((line, lineIndex) => {
    if (!line.text.length) {
      return;
    }

    const intervalMs = typingTimeMs / line.text.length;
    const startMs = lineIndex * lineDelayMs;
    for (let index = 0; index < line.text.length; index++) {
      if (line.text.charAt(index).trim() === '') {
        continue;
      }

      timers.push(window.setTimeout(() => {
        if (!controller.canceled) {
          void playSound(src, volume);
        }
      }, startMs + ((index + 1) * intervalMs)));
    }
  });

  return {
    stop: () => timers.forEach(timer => window.clearTimeout(timer))
  };
};

export const stopSound = async (sound?: TransitionSound) => {
  if (!sound) {
    return;
  }

  try {
    await sound.stop();
  } catch (error) {
    console.warn('Anarchist Overlay | Unable to stop transition sound.', error);
  }
};
