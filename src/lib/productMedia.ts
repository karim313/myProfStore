import { BASE_URL } from '../api/axios';

export interface ProductImageDto {
  id?: number;
  imageUrl?: string;
  url?: string;
  isMain?: boolean;
}

export type ProductImageInput = string | ProductImageDto;

export interface ProductMedia {
  id: number;
  name: string;
  description: string;
  stockQuantity: number;
  category: string;
  originalPrice: number;
  discountPercentage: number | null;
  finalPrice: number;
  offerEndDate: string | null;
  mainVideo: string | null;
  videos: string[];
  mainImage: string | null;
  images: ProductImageInput[];
}

interface ParsedImage {
  id?: number;
  url: string;
  isMain: boolean;
}

/** Resolves a raw URL string — prepends BASE_URL for server-relative paths. */
export function resolveImageUrl(raw?: string | null): string {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const base = BASE_URL.replace(/\/$/, '');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}

/** Normalizes API image entries (string URLs or { id, imageUrl, isMain } objects). */
export function parseProductImages(images: unknown): ParsedImage[] {
  if (!Array.isArray(images)) return [];

  return images
    .map((item): ParsedImage | null => {
      if (typeof item === 'string') {
        const url = resolveImageUrl(item);
        return url ? { url, isMain: false } : null;
      }

      if (item && typeof item === 'object') {
        const dto = item as ProductImageDto;
        const url = resolveImageUrl(dto.imageUrl ?? dto.url);
        if (!url) return null;
        return { id: dto.id, url, isMain: Boolean(dto.isMain) };
      }

      return null;
    })
    .filter((item): item is ParsedImage => item !== null);
}

/**
 * Returns primary product image.
 * Priority: mainImage field → images[].isMain → images[0]
 */
export function getPrimaryImage(product?: Partial<ProductMedia> | null): string {
  if (!product) return '';

  const fromMainField = resolveImageUrl(product.mainImage);
  if (fromMainField) return fromMainField;

  const parsedImages = parseProductImages(product.images);
  const mainFromList = parsedImages.find((img) => img.isMain);
  if (mainFromList) return mainFromList.url;

  if (parsedImages.length > 0) return parsedImages[0].url;

  return '';
}

export interface MediaGalleryItem {
  id: string;
  type: 'video' | 'image';
  url: string;
  isMain?: boolean;
  label?: string;
}

/**
 * Normalizes all media items (mainVideo, videos, mainImage, images) into a unified list.
 * If mainVideo exists, it shows before the images.
 */
export function buildProductMediaList(product?: Partial<ProductMedia> | null): MediaGalleryItem[] {
  if (!product) return [];
  const mediaList: MediaGalleryItem[] = [];
  const seenUrls = new Set<string>();

  const addVideo = (url: string, isMain: boolean, idx?: number) => {
    const resolved = resolveImageUrl(url);
    if (!resolved || seenUrls.has(resolved)) return;
    seenUrls.add(resolved);
    mediaList.push({
      id: isMain ? `main-video-${resolved}` : `video-${idx ?? 0}-${resolved}`,
      type: 'video',
      url: resolved,
      isMain,
      label: isMain ? 'فيديو رئيسي' : `فيديو ${(idx ?? 0) + 1}`,
    });
  };

  const addImage = (url: string, isMain: boolean, id?: number, idx?: number) => {
    const resolved = resolveImageUrl(url);
    if (!resolved || seenUrls.has(resolved)) return;
    seenUrls.add(resolved);
    mediaList.push({
      id: id != null ? `image-${id}` : isMain ? `main-image-${resolved}` : `image-${idx ?? 0}-${resolved}`,
      type: 'image',
      url: resolved,
      isMain,
      label: isMain ? 'صورة رئيسية' : `صورة ${(idx ?? 0) + 1}`,
    });
  };

  // 1. Videos (mainVideo first, then additional videos)
  if (product.mainVideo) addVideo(product.mainVideo, true);

  if (Array.isArray(product.videos)) {
    product.videos.forEach((vid, idx) => {
      if (vid) addVideo(vid, false, idx);
    });
  }

  // 2. Images — mainImage field first, then images array (objects or strings)
  const mainFromField = resolveImageUrl(product.mainImage);
  const parsedImages = parseProductImages(product.images);
  const hasMainFromField = Boolean(mainFromField);

  if (mainFromField) {
    addImage(mainFromField, true);
  }

  parsedImages.forEach((img, idx) => {
    const isMain = !hasMainFromField && (img.isMain || (idx === 0 && !parsedImages.some((i) => i.isMain)));
    addImage(img.url, isMain, img.id, idx);
  });

  return mediaList;
}
