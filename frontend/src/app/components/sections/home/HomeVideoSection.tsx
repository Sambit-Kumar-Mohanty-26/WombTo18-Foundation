import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { PlayCircle, PauseCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YouTubePlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
};

const YOUTUBE_VIDEO_ID = "Ql8lz_RrK7k";
const PLAYER_ID = "home-story-video-player";

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<void>((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    let resolved = false;
    const finish = () => {
      if (resolved || !window.YT?.Player) {
        return;
      }
      resolved = true;
      resolve();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.addEventListener("load", () => {
        window.setTimeout(finish, 0);
      });
      document.body.appendChild(script);
    } else {
      existingScript.addEventListener("load", () => {
        window.setTimeout(finish, 0);
      });
    }

    const previousHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousHandler?.();
      finish();
    };

    const readinessPoll = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(readinessPoll);
        finish();
      }
    }, 200);
  });

  return youtubeApiPromise;
}

export function HomeVideoSection() {
  const { t } = useTranslation('home');
  const sectionRef = useRef<HTMLElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const manualPauseRef = useRef(false);
  const internalPauseRef = useRef(false);
  const hasStartedPlaybackRef = useRef(false);
  const isInView = useInView(sectionRef, { amount: 0.6, margin: "-10% 0px -10% 0px" });
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    loadYouTubeApi().then(() => {
      if (isCancelled || !window.YT?.Player || playerRef.current) {
        return;
      }

      playerRef.current = new window.YT.Player(PLAYER_ID, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            if (!isCancelled) {
              setPlayerReady(true);
            }
          },
          onStateChange: (event) => {
            if (!window.YT?.PlayerState) {
              return;
            }

            if (event.data === window.YT.PlayerState.PLAYING) {
              internalPauseRef.current = false;
              manualPauseRef.current = false;
              hasStartedPlaybackRef.current = true;
              setIsPlaying(true);
            }

            if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              if (internalPauseRef.current) {
                internalPauseRef.current = false;
              } else if (hasStartedPlaybackRef.current) {
                manualPauseRef.current = true;
              }
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              manualPauseRef.current = false;
              hasStartedPlaybackRef.current = false;
            }
          },
        },
      });
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!playerReady || !playerRef.current) {
      return;
    }

    if (isInView && !manualPauseRef.current) {
      playerRef.current.playVideo();
      return;
    }

    if (!isInView) {
      internalPauseRef.current = true;
      playerRef.current.pauseVideo();
    }
  }, [isInView, playerReady]);

  useEffect(() => {
    if (!isInteractive) {
      return;
    }

    const releaseInteraction = () => {
      setIsInteractive(false);
    };

    window.addEventListener("wheel", releaseInteraction, { passive: true });
    window.addEventListener("touchmove", releaseInteraction, { passive: true });
    window.addEventListener("keydown", releaseInteraction);

    return () => {
      window.removeEventListener("wheel", releaseInteraction);
      window.removeEventListener("touchmove", releaseInteraction);
      window.removeEventListener("keydown", releaseInteraction);
    };
  }, [isInteractive]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf7_0%,#f5f1ea_100%)] py-20 sm:py-24"
    >
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle_at_top_left,_var(--womb-forest)_0%,_transparent_35%),radial-gradient(circle_at_bottom_right,_var(--journey-saffron)_0%,_transparent_32%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--womb-forest)]/15 bg-white/90 px-4 py-1.5 text-sm font-semibold text-[var(--womb-forest)] shadow-sm">
            {t('video.badge')}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {t('video.heading')}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg italic font-medium">
            {t('video.desc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="overflow-hidden rounded-[2rem] border border-white/70 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--womb-forest)]">
                {t('common:homeFilm', { defaultValue: 'Home Film' })}
              </p>
              <p className="text-sm text-gray-500">{t('common:ytChannel', { defaultValue: 'WOMBTO18 Foundation on YouTube' })}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
              {isPlaying ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
              <span>{isPlaying ? t('common:playing', { defaultValue: 'Playing in view' }) : t('common:paused', { defaultValue: 'Paused' })}</span>
            </div>
          </div>

          <div className="relative aspect-video w-full bg-black">
            <div
              id={PLAYER_ID}
              className={`h-full w-full ${isInteractive ? "" : "[&_iframe]:pointer-events-none"}`}
            />

            {!isInteractive && (
              <button
                type="button"
                onClick={() => setIsInteractive(true)}
                className="absolute inset-0 flex items-end justify-end bg-transparent p-4 text-left"
                aria-label="Enable video interaction"
              >
                <span className="max-w-xs rounded-full border border-white/15 bg-black/65 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-sm sm:text-sm">
                  {t('common:clickInteract', { defaultValue: 'Click to interact with video' })}
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
