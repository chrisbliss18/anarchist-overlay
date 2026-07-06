// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import '../styles/overlay.scss';
import '../styles/text-crawl.scss';
import '../styles/scene-transition.scss';

import type { AnarchistOverlayApi, AnarchistOverlayModule } from './types';
import { setupSocket } from './socket';
import { closeAllOverlays, closeOverlay, createOverlay, setupOverlaySocket } from './overlay';
import { playSceneTransition, setupSceneTransitionSocket } from './sceneTransition';
import { moduleId } from "./constants";
import {createTextCrawlHtml} from "./textCrawl";

Hooks.once('socketlib.ready', () => {
  const module = (game as ReadyGame).modules.get(moduleId) as unknown as AnarchistOverlayModule | undefined;
  if (!module) {
    throw new Error(`Unable to initialize ${moduleId}: module data was not found.`);
  }

  const socket = setupSocket();
  setupOverlaySocket(socket);
  setupSceneTransitionSocket(socket);

  const api: AnarchistOverlayApi = {
    createOverlay: createOverlay(socket),
    createTextCrawlHtml,
    closeAllOverlays: closeAllOverlays(socket),
    closeOverlay: closeOverlay(socket),
    playSceneTransition: playSceneTransition(socket)
  };

  module.api = api;
  module.createOverlay = api.createOverlay;
  module.createTextCrawlHtml = api.createTextCrawlHtml;
  module.closeAllOverlays = api.closeAllOverlays;
  module.closeOverlay = api.closeOverlay;
  module.playSceneTransition = api.playSceneTransition;
});
