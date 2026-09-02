import { useState, useEffect } from 'react';
import { buildProductMediaList, type ProductMedia, type MediaGalleryItem } from '../../lib/productMedia';
import { Play, Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${match[1]}&modestbranding=1&rel=0&disablekb=1&fs=0&playsinline=1`;
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
      <motion.div 
        className="relative w-full h-80 md:h-[450px] bg-black/5 rounded-3xl overflow-hidden border border-gray-200 shadow-lg group flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence mode="wait">
          {activeMedia?.type === 'video' ? (
            isYouTube && youtubeEmbedUrl ? (
              <motion.iframe
                key={activeMedia.id}
                src={youtubeEmbedUrl}
                title="YouTube product preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full object-contain bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.video
                key={activeMedia.id}
                src={activeMedia.url}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                className="w-full h-full object-contain bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )
          ) : (
            <motion.img
              key={activeMedia?.id}
              src={activeMedia?.url}
              alt={product?.name || 'Product'}
              onClick={() => setIsFullscreen(true)}
              className="w-full h-full object-cover cursor-pointer"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            />
          )}
        </AnimatePresence>

        {/* Media Type Badge */}
        <motion.div 
          className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>

        {/* Fullscreen Trigger Button */}
        <motion.button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-4 left-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2.5 rounded-full shadow-lg cursor-pointer"
          title="معاينة ملء الشاشة"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Maximize2 size={18} />
        </motion.button>
      </motion.div>

      {/* ── Thumbnails Strip (Video thumbnails first, then image thumbnails) ── */}
      <motion.div 
        className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-emerald-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {mediaList.map((item, idx) => {
          const isSelected = idx === activeIndex;

          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 cursor-pointer ${
                isSelected
                  ? 'border-[#00342B] ring-2 ring-emerald-500 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: isSelected ? 1 : 0.7, 
                scale: isSelected ? 1.05 : 1 
              }}
              whileHover={{ scale: 1.05, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-slate-900 relative flex items-center justify-center">
                  {!isYouTubeUrl(item.url) ? (
                    <video
                      src={`${item.url}#t=0.5`}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-60"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900/85 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                        <Play size={16} className="fill-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20" />
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
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Fullscreen Preview Modal ── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top Bar */}
            <motion.div 
              className="flex justify-between items-center text-white z-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-sm font-medium text-gray-300">
                {activeIndex + 1} / {mediaList.length} — {activeMedia?.label}
              </div>
              <motion.button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full cursor-pointer"
                title="إغلاق"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </motion.div>

            {/* Media Viewport */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {/* Prev Button */}
              <motion.button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length)}
                className="absolute left-2 md:left-6 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full cursor-pointer"
                title="السابق"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={28} />
              </motion.button>

              {/* Content */}
              <motion.div 
                className="max-w-5xl max-h-full flex items-center justify-center p-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={activeIndex}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>

              {/* Next Button */}
              <motion.button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % mediaList.length)}
                className="absolute right-2 md:right-6 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full cursor-pointer"
                title="التالي"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={28} />
              </motion.button>
            </div>

            {/* Bottom Thumbnails Strip in Lightbox */}
            <motion.div 
              className="flex justify-center items-center gap-2 overflow-x-auto py-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {mediaList.map((item, idx) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer ${
                    idx === activeIndex
                      ? 'border-emerald-500'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: idx === activeIndex ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <Play size={14} className="text-white fill-white" />
                    </div>
                  ) : (
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
