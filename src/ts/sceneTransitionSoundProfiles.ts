import { moduleId } from './constants';
import type {
  SceneTransitionSoundProfileType,
  SceneTransitionSounds
} from './sceneTransitionTypes';

export const defaultSceneTransitionSoundProfileType: SceneTransitionSoundProfileType = 'bulkhead';

export const sceneTransitionSoundProfileDefaults: Record<
  SceneTransitionSoundProfileType,
  Required<SceneTransitionSounds>
> = {
  bulkhead: {
    doorClose: `modules/${moduleId}/sounds/industrial-bulkhead-close.ogg`,
    doorSeal: `modules/${moduleId}/sounds/industrial-bulkhead-seal.ogg`,
    doorUnlock: `modules/${moduleId}/sounds/industrial-bulkhead-unlock.ogg`,
    doorOpen: `modules/${moduleId}/sounds/industrial-bulkhead-open.ogg`,
    typingClick: `modules/${moduleId}/sounds/mechanical-typing-click.ogg`,
    doorVolume: 0.82,
    typingVolume: 0.35
  },
  'classic-industrial': {
    doorClose: `modules/${moduleId}/sounds/industrial-door-close.ogg`,
    doorSeal: `modules/${moduleId}/sounds/industrial-door-seal.ogg`,
    doorUnlock: `modules/${moduleId}/sounds/industrial-door-unlock.ogg`,
    doorOpen: `modules/${moduleId}/sounds/industrial-door-open.ogg`,
    typingClick: `modules/${moduleId}/sounds/mechanical-typing-click.ogg`,
    doorVolume: 0.8,
    typingVolume: 0.35
  },
  'heavy-industrial': {
    doorClose: `modules/${moduleId}/sounds/industrial-heavy-close.ogg`,
    doorSeal: `modules/${moduleId}/sounds/industrial-heavy-seal.ogg`,
    doorUnlock: `modules/${moduleId}/sounds/industrial-heavy-unlock.ogg`,
    doorOpen: `modules/${moduleId}/sounds/industrial-heavy-open.ogg`,
    typingClick: `modules/${moduleId}/sounds/mechanical-typing-click.ogg`,
    doorVolume: 0.82,
    typingVolume: 0.35
  },
  'harsh-industrial': {
    doorClose: `modules/${moduleId}/sounds/industrial-harsh-close.ogg`,
    doorSeal: `modules/${moduleId}/sounds/industrial-harsh-seal.ogg`,
    doorUnlock: `modules/${moduleId}/sounds/industrial-harsh-unlock.ogg`,
    doorOpen: `modules/${moduleId}/sounds/industrial-harsh-open.ogg`,
    typingClick: `modules/${moduleId}/sounds/mechanical-typing-click.ogg`,
    doorVolume: 0.72,
    typingVolume: 0.35
  },
  terminal: {
    doorClose: `modules/${moduleId}/sounds/terminal-transition-close.ogg`,
    doorSeal: `modules/${moduleId}/sounds/terminal-transition-seal.ogg`,
    doorUnlock: `modules/${moduleId}/sounds/terminal-transition-unlock.ogg`,
    doorOpen: `modules/${moduleId}/sounds/terminal-transition-open.ogg`,
    typingClick: `modules/${moduleId}/sounds/terminal-typing-click.ogg`,
    doorVolume: 0.52,
    typingVolume: 0.28
  },
  scanline: {
    doorClose: `modules/${moduleId}/sounds/scanline-transition-close.ogg`,
    doorSeal: `modules/${moduleId}/sounds/scanline-transition-seal.ogg`,
    doorUnlock: `modules/${moduleId}/sounds/scanline-transition-unlock.ogg`,
    doorOpen: `modules/${moduleId}/sounds/scanline-transition-open.ogg`,
    typingClick: `modules/${moduleId}/sounds/scanline-typing-click.ogg`,
    doorVolume: 0.48,
    typingVolume: 0.24
  },
  alert: {
    doorClose: `modules/${moduleId}/sounds/alert-transition-close.ogg`,
    doorSeal: `modules/${moduleId}/sounds/alert-transition-seal.ogg`,
    doorUnlock: `modules/${moduleId}/sounds/alert-transition-unlock.ogg`,
    doorOpen: `modules/${moduleId}/sounds/alert-transition-open.ogg`,
    typingClick: `modules/${moduleId}/sounds/alert-typing-click.ogg`,
    doorVolume: 0.64,
    typingVolume: 0.3
  },
  hologram: {
    doorClose: `modules/${moduleId}/sounds/hologram-transition-close.ogg`,
    doorSeal: `modules/${moduleId}/sounds/hologram-transition-seal.ogg`,
    doorUnlock: `modules/${moduleId}/sounds/hologram-transition-unlock.ogg`,
    doorOpen: `modules/${moduleId}/sounds/hologram-transition-open.ogg`,
    typingClick: `modules/${moduleId}/sounds/hologram-typing-click.ogg`,
    doorVolume: 0.46,
    typingVolume: 0.22
  },
  classified: {
    doorClose: `modules/${moduleId}/sounds/classified-transition-close.ogg`,
    doorSeal: `modules/${moduleId}/sounds/classified-transition-seal.ogg`,
    doorUnlock: `modules/${moduleId}/sounds/classified-transition-unlock.ogg`,
    doorOpen: `modules/${moduleId}/sounds/classified-transition-open.ogg`,
    typingClick: `modules/${moduleId}/sounds/classified-typing-click.ogg`,
    doorVolume: 0.44,
    typingVolume: 0.2
  },
  silent: {
    doorClose: '',
    doorSeal: '',
    doorUnlock: '',
    doorOpen: '',
    typingClick: '',
    doorVolume: 0,
    typingVolume: 0
  }
};

export const resolveSceneTransitionSoundProfileType = (
  soundProfileType?: string
): SceneTransitionSoundProfileType => {
  const resolvedSoundProfileType = soundProfileType ?? defaultSceneTransitionSoundProfileType;
  if (
    resolvedSoundProfileType === 'bulkhead'
    || resolvedSoundProfileType === 'classic-industrial'
    || resolvedSoundProfileType === 'heavy-industrial'
    || resolvedSoundProfileType === 'harsh-industrial'
    || resolvedSoundProfileType === 'terminal'
    || resolvedSoundProfileType === 'scanline'
    || resolvedSoundProfileType === 'alert'
    || resolvedSoundProfileType === 'hologram'
    || resolvedSoundProfileType === 'classified'
    || resolvedSoundProfileType === 'silent'
  ) {
    return resolvedSoundProfileType;
  }

  throw new Error(`Unknown scene transition sound profile type "${resolvedSoundProfileType}". Expected "bulkhead", "classic-industrial", "heavy-industrial", "harsh-industrial", "terminal", "scanline", "alert", "hologram", "classified", or "silent".`);
};
