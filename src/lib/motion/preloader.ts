export const PRELOADER_SESSION_KEY = "liberty-preloader-seen";

type ReadableStorage = Pick<Storage, "getItem">;

type CoverCircleInput = {
  viewportWidth: number;
  viewportHeight: number;
  centerX: number;
  centerY: number;
};

type AssetWaitOptions = {
  images: Array<HTMLImageElement | null>;
  fontsReady?: PromiseLike<unknown>;
  timeoutMs: number;
  signal?: AbortSignal;
};

export function shouldBypassPreloader(storage: ReadableStorage | null, reducedMotion: boolean, replaySeenSession = false) {
  if (reducedMotion) return true;
  if (!storage) return true;

  try {
    const seen = storage.getItem(PRELOADER_SESSION_KEY) === "true";
    return seen && !replaySeenSession;
  } catch {
    return true;
  }
}

export function createCompletionGate() {
  let completed = false;

  return {
    run(complete: () => void) {
      if (completed) return false;
      completed = true;
      complete();
      return true;
    },
  };
}

export function calculateCoverRadius({
  viewportWidth,
  viewportHeight,
  centerX,
  centerY,
}: CoverCircleInput) {
  const farthestX = Math.max(centerX, viewportWidth - centerX);
  const farthestY = Math.max(centerY, viewportHeight - centerY);

  return Math.hypot(farthestX, farthestY) * 1.02;
}

export function waitForImage(image: HTMLImageElement | null, signal?: AbortSignal) {
  if (!image || image.complete || signal?.aborted) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const finish = () => {
      image.removeEventListener("load", finish);
      image.removeEventListener("error", finish);
      signal?.removeEventListener("abort", finish);
      resolve();
    };

    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
    signal?.addEventListener("abort", finish, { once: true });
  });
}

export async function waitForPreloaderAssets({
  images,
  fontsReady,
  timeoutMs,
  signal,
}: AssetWaitOptions) {
  if (signal?.aborted) return;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let abortHandler: (() => void) | undefined;

  const timeout = new Promise<void>((resolve) => {
    timeoutId = setTimeout(resolve, timeoutMs);
  });
  const aborted = new Promise<void>((resolve) => {
    abortHandler = resolve;
    signal?.addEventListener("abort", abortHandler, { once: true });
  });
  const fonts = fontsReady ? Promise.resolve(fontsReady).catch(() => undefined) : Promise.resolve();
  const assets = Promise.all([...images.map((image) => waitForImage(image, signal)), fonts]).then(() => undefined);

  try {
    await Promise.race([assets, timeout, aborted]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    if (abortHandler) signal?.removeEventListener("abort", abortHandler);
  }
}
