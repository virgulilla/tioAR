import { useEffect, useRef, useState } from "react";
import tioIdleImg from "../assets/tio/tio_idle.png";
import tioBlinkingImg from "../assets/tio/tio_blinking.png";
import tioTalkingImg from "../assets/tio/tio_talking.png";

export default function TioAnimadoSimple({ audioSrc }) {
  const audioRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [talkFrameIndex, setTalkFrameIndex] = useState(0);

  // Parpadeo
  useEffect(() => {
    if (isPlayingAudio) return;

    const blinkTimer = setTimeout(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, Math.random() * 3000 + 2000);

    return () => clearTimeout(blinkTimer);
  }, [isPlayingAudio, isBlinking]);

  // Animación de boca cuando habla
  useEffect(() => {
    let timer;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setTalkFrameIndex((i) => (i + 1) % 3);
      }, 180);
    } else {
      setTalkFrameIndex(0);
    }

    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  // Reproducir audio al cargar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const start = () => {
      audio.play().catch(() => {});
    };

    setTimeout(start, 300);

    audio.addEventListener("playing", () => setIsPlayingAudio(true));
    audio.addEventListener("ended", () => setIsPlayingAudio(false));

    return () => {
      audio.removeEventListener("playing", () => {});
      audio.removeEventListener("ended", () => {});
    };
  }, []);

  // Selección de frame actual
  const currentImage = (() => {
    if (isPlayingAudio) {
      return [tioIdleImg, tioTalkingImg, tioBlinkingImg][talkFrameIndex];
    }
    return isBlinking ? tioBlinkingImg : tioIdleImg;
  })();

  return (
    <div className="tio-final-animado">
      <img src={currentImage} alt="Tió" className="tio-img" />
      <audio ref={audioRef} src={audioSrc} preload="auto" />
    </div>
  );
}
