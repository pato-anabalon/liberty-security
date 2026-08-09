export const PRELOADER_COMPLETE_EVENT = "liberty:preloader-complete";

export function afterPreloaderComplete(start: () => void) {
  let started = false;
  let startTimer: number | undefined;
  const startOnce = () => {
    if (started) return;
    started = true;
    start();
  };

  window.addEventListener(PRELOADER_COMPLETE_EVENT, startOnce, { once: true });
  if (!document.querySelector("[data-testid='liberty-preloader']")) {
    startTimer = window.setTimeout(startOnce, 0);
  }

  return () => {
    window.removeEventListener(PRELOADER_COMPLETE_EVENT, startOnce);
    if (startTimer !== undefined) window.clearTimeout(startTimer);
  };
}
