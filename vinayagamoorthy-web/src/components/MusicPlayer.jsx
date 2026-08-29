import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '../i18n/LanguageContext';

const SRC = '/assets/music.mp3';
const KEY = 'music_on';
const VOLUME = 0.35;

function readPref() {
  try {
    const v = localStorage.getItem(KEY);
    return v === null ? true : v === '1'; // default: on
  } catch {
    return true;
  }
}

// App-wide background music. Lives above the router so it keeps playing
// across page changes. Browsers block autoplay until a user gesture, so if
// play() is refused we start on the first click / keypress instead.
export default function MusicPlayer() {
  const t = useT();
  const audioRef = useRef(null);
  const [on, setOn] = useState(readPref);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = VOLUME;

    if (!on) {
      a.pause();
      return;
    }

    let cleanup;
    a.play().catch(() => {
      const kick = () => {
        if (readPref()) a.play().catch(() => {});
        window.removeEventListener('pointerdown', kick);
        window.removeEventListener('keydown', kick);
      };
      window.addEventListener('pointerdown', kick, { once: true });
      window.addEventListener('keydown', kick, { once: true });
      cleanup = () => {
        window.removeEventListener('pointerdown', kick);
        window.removeEventListener('keydown', kick);
      };
    });
    return () => cleanup?.();
  }, [on]);

  const toggle = useCallback(() => {
    setOn((prev) => {
      const next = !prev;
      try { localStorage.setItem(KEY, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  }, []);

  if (!available) return null;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="auto"
        onError={() => setAvailable(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? t('music.off') : t('music.on')}
        title={on ? t('music.off') : t('music.on')}
        className="music-toggle"
      >
        ♫
      </button>
    </>
  );
}
