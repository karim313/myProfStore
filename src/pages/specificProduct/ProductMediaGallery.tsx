import { useState, useEffect } from 'react';
import { buildProductMediaList, type ProductMedia, type MediaGalleryItem } from '../../lib/productMedia';
import { Play, Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  // Match YouTube regular URLs, Shorts, and embed URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&mute=0&controls=0&loop=1&playlist=${match[1]}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&hl=en`;
    }
  }

  return null;
};

const isYouTubeUrl = (url: string): boolean => {
  return getYouTubeEmbedUrl(url) !== null;
};

interface ProductMediaGalleryProps {
  product?: Partial<ProductMedia> | null;
}

export default function ProductMediaGallery({ product }: ProductMediaGalleryProps) {
  const mediaList = buildProductMediaList(product);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Set initial active item to mainImage (or images[0]) if available, else first media item
  useEffect(() => {
    if (mediaList.length === 0) return;
    // Prefer mainImage item or first image item as primary default
    const mainImgIdx = mediaList.findIndex((item) => item.type === 'image' && item.isMain);
    if (mainImgIdx !== -1) {
      setActiveIndex(mainImgIdx);
    } else {
      const firstImgIdx = mediaList.findIndex((item) => item.type === 'image');
      if (firstImgIdx !== -1) {
        setActiveIndex(firstImgIdx);
      } else {
        setActiveIndex(0);
      }
    }
  }, [product]);

  const activeMedia: MediaGalleryItem | undefined = mediaList[activeIndex];
  const isYouTube = activeMedia?.type === 'video' && isYouTubeUrl(activeMedia.url);
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(activeMedia.url) : null;

  // Fullscreen keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setActiveIndex((prev) => (prev + 1) % mediaList.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setActiveIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, mediaList.length]);

  // Graceful Fallback if no media exists
  if (mediaList.length === 0) {
    return (
      <div className="w-full h-80 md:h-[450px] bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-gray-400 gap-3">
        <ImageIcon size={48} className="stroke-1 text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">لا يوجد ميديا متوفرة لهذا المنتج</p>
        <span className="text-xs text-gray-400">No images or videos available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Main Active Media View ── */}
      <div className="relative w-full h-80 md:h-[450px] bg-black/5 rounded-3xl overflow-hidden border border-gray-200 shadow-lg group flex items-center justify-center">
        {activeMedia?.type === 'video' ? (
          isYouTube && youtubeEmbedUrl ? (
            <iframe
              key={activeMedia.id}
              src={youtubeEmbedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <video
              key={activeMedia.id}
              src={activeMedia.url}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            />
          )
        ) : (
          <img
            key={activeMedia?.id}
            src={activeMedia?.url}
            alt={product?.name || 'Product'}
            onClick={() => setIsFullscreen(true)}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Media Type Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
          {activeMedia?.type === 'video' ? (
            <>
              <Play size={12} className="fill-white" />
              <span>فيديو</span>
            </>
          ) : (
            <>
              <ImageIcon size={12} />
              <span>{activeMedia?.isMain ? 'الصورة الرئيسية' : 'صورة'}</span>
            </>
          )}
        </div>

        {/* Fullscreen Trigger Button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-4 left-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
          title="معاينة ملء الشاشة"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* ── Thumbnails Strip (Video thumbnails first, then image thumbnails) ── */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-emerald-600">
        {mediaList.map((item, idx) => {
          const isSelected = idx === activeIndex;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-[#00342B] ring-2 ring-emerald-500 scale-105 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:scale-100'
              }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-slate-900 relative flex items-center justify-center">
                  <video
                    src={`${item.url}#t=0.5`}
                    preload="metadata"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                      <Play size={14} className="fill-white translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white px-1 rounded">
                    فيديو
                  </span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.label || 'Thumbnail'}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Fullscreen Preview Modal ── */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex justify-between items-center text-white z-10">
            <div className="text-sm font-medium text-gray-300">
              {activeIndex + 1} / {mediaList.length} — {activeMedia?.label}
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
              title="إغلاق"
            >
              <X size={24} />
            </button>
          </div>

          {/* Media Viewport */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length)}
              className="absolute left-2 md:left-6 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
              title="السابق"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Content */}
            <div className="max-w-5xl max-h-full flex items-center justify-center p-2">
              {activeMedia?.type === 'video' ? (
                isYouTube && youtubeEmbedUrl ? (
                  <iframe
                    src={youtubeEmbedUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
                  />
                ) : (
                  <video
                    src={activeMedia.url}
                    controls
                    autoPlay
                    className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
                  />
                )
              ) : (
                <img
                  src={activeMedia?.url}
                  alt={product?.name || 'Fullscreen Preview'}
                  className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
                />
              )}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % mediaList.length)}
              className="absolute right-2 md:right-6 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
              title="التالي"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          <div className="flex justify-center items-center gap-2 overflow-x-auto py-2">
            {mediaList.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === activeIndex
                    ? 'border-emerald-500 scale-110'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <Play size={14} className="text-white fill-white" />
                  </div>
                ) : (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
