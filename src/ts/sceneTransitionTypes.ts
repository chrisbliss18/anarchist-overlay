import type { TextCrawlConfig } from './textCrawl';

export type SceneTransitionConfig = {
  sceneId: string;
  id?: string;
  text?: TextCrawlConfig;
  timing?: SceneTransitionTiming;
  sounds?: SceneTransitionSounds;
  aboveUi?: boolean;
  blockInteractions?: boolean;
};

export type SceneTransitionTiming = {
  doorCloseMs?: number;
  briefingMs?: number;
  doorUnlockMs?: number;
  doorOpenMs?: number;
  textFadeMs?: number;
  sceneReadyTimeoutMs?: number;
};

export type SceneTransitionSounds = {
  doorClose?: string;
  doorSeal?: string;
  doorUnlock?: string;
  doorOpen?: string;
  typingClick?: string;
  doorVolume?: number;
  typingVolume?: number;
};

export type NormalizedSceneTransitionConfig = Required<
  Omit<SceneTransitionConfig, 'text' | 'timing' | 'sounds'>
> & {
  text?: TextCrawlConfig;
  timing: Required<SceneTransitionTiming>;
  sounds: Required<SceneTransitionSounds>;
};

export type TransitionSound = {
  stop: () => Promise<unknown> | unknown;
};

export type TransitionAudio = {
  stop: () => Promise<unknown> | unknown;
};

export type TransitionController = {
  canceled: boolean;
  cancel: () => void;
  cancelPromise: Promise<void>;
};

export type AudioHelperGlobal = {
  play: (
    data: { src: string; volume: number; loop: boolean },
    socketOptions?: boolean | null
  ) => Promise<TransitionSound>;
};
