"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { Placeholder } from "@/components/ui/Placeholder";

const VIDEO_URL = "/images/home/home-brand-video.mp4";

/** 首页分区 6：企业宣传视频（素材位 home-brand-video.mp4；preload=none 点击播放才加载，不占首屏带宽） */
export function VideoShowcase() {
  const t = useTranslations("home.video");
  const videoRef = useRef<HTMLVideoElement>(null);
  // 0 = 探测中/未播放，1 = 可播放，2 = 文件不存在回退占位
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    void v.play();
    setPlaying(true);
  };

  return (
    <section className="relative overflow-hidden text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-white/70">{t("subtitle")}</p>
        </div>

        <div className="relative mx-auto mt-12 max-w-4xl">
          {stage === 2 ? (
            <Placeholder
              variant="dark"
              ratio="aspect-video"
              label={t("placeholder.label")}
              size={t("placeholder.size")}
              name="home-brand-video.mp4"
            />
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/15 bg-black/40">
              <video
                ref={videoRef}
                src={VIDEO_URL}
                preload="none"
                controls={playing}
                playsInline
                className="h-full w-full object-contain"
                onError={() => setStage(2)}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
              />
              {!playing && (
                <button
                  type="button"
                  onClick={handlePlay}
                  aria-label={t("play")}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 transition-colors hover:bg-black/40"
                >
                  <span className="bg-brand-blue rounded-full p-5 shadow-lg transition-transform hover:scale-105">
                    <Play className="h-8 w-8 fill-white text-white" />
                  </span>
                  <span className="text-sm text-white/70">{t("play")}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
