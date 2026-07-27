import { useState } from 'react';
import type { ProductMedia, ProductImageInput } from '../../../lib/productMedia';

interface Category {
  id: number;
  name: string;
}

export type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  mainImage: string;
  mainVideo: string;
  videos: string[];
  images: ProductImageInput[];
  category: string;
  discountPercentage: string;
  offerStartDate: string;
  offerEndDate: string;
};

interface ProductFormProps {
  productForm: ProductFormState;
  editingProduct: ProductMedia | null;
  categories: Category[];
  onFormChange: (form: ProductFormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onOpenDescriptionBuilder: (categoryId: string) => void;
  onUploadMainImage: (file: File) => Promise<string>;
  onUploadAdditionalImages: (files: File[]) => Promise<string[]>;
  onUploadMainVideo: (file: File) => Promise<string>;
  onUploadAdditionalVideos: (files: File[]) => Promise<string[]>;
  onDeleteImage: (imageId: string) => Promise<void>;
  onSetImageAsMain: (imageId: string) => Promise<void>;
  onDeleteVideo: (videoId: string) => Promise<void>;
  onSetVideoAsMain: (videoId: string) => Promise<void>;
}

export default function ProductForm({
  productForm,
  editingProduct,
  categories,
  onFormChange,
  onSubmit,
  onCancel,
  onOpenDescriptionBuilder,
  onUploadMainImage,
  onUploadAdditionalImages,
  onUploadMainVideo,
  onUploadAdditionalVideos,
  onDeleteImage,
  onSetImageAsMain,
  onDeleteVideo,
  onSetVideoAsMain,
}: ProductFormProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Safe getters for array media
  const currentImages = Array.isArray(productForm.images) ? productForm.images : [];
  const currentVideos = Array.isArray(productForm.videos) ? productForm.videos : [];

  // Handlers for Main Image
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await onUploadMainImage(file);
      onFormChange({ ...productForm, mainImage: imageUrl });
    } catch (error) {
      console.error('Failed to upload image file:', error);
    }
  };

  // Handlers for Additional Images
  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const imageUrls = await onUploadAdditionalImages(Array.from(files));
      onFormChange({ ...productForm, images: [...currentImages, ...imageUrls] });
    } catch (error) {
      console.error('Failed to upload image files:', error);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    onFormChange({ ...productForm, images: [...currentImages, newImageUrl.trim()] });
    setNewImageUrl('');
  };

  const handleRemoveImage = async (index: number) => {
    const imageItem = currentImages[index];
    const imageUrl = typeof imageItem === 'string' ? imageItem : imageItem.imageUrl || imageItem.url || '';
    const imageId = typeof imageItem === 'object' ? imageItem.id : null;
    
    // If it's an image ID (not a URL), delete via API
    if (imageId && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      try {
        await onDeleteImage(String(imageId));
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
    const updated = currentImages.filter((_, i) => i !== index);
    onFormChange({ ...productForm, images: updated });
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentImages.length) return;
    const next = [...currentImages];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onFormChange({ ...productForm, images: next });
  };

  const handleSetImageAsMain = async (index: number) => {
    const imageItem = currentImages[index];
    const imageUrl = typeof imageItem === 'string' ? imageItem : imageItem.imageUrl || imageItem.url || '';
    const imageId = typeof imageItem === 'object' ? imageItem.id : null;
    
    // If it's an image ID (not a URL), set as main via API
    if (imageId && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      try {
        await onSetImageAsMain(String(imageId));
        onFormChange({ ...productForm, mainImage: imageUrl });
      } catch (error) {
        console.error('Failed to set image as main:', error);
      }
    } else {
      // For URLs, just update the form state
      onFormChange({ ...productForm, mainImage: imageUrl });
    }
  };

  // Handlers for Main Video
  const handleMainVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const videoUrl = await onUploadMainVideo(file);
      onFormChange({ ...productForm, mainVideo: videoUrl });
    } catch (error) {
      console.error('Failed to upload video file:', error);
    }
  };

  // Handlers for Additional Videos
  const handleAdditionalVideosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const videoUrls = await onUploadAdditionalVideos(Array.from(files));
      onFormChange({ ...productForm, videos: [...currentVideos, ...videoUrls] });
    } catch (error) {
      console.error('Failed to upload video files:', error);
    }
  };

  const handleAddVideoUrl = () => {
    if (!newVideoUrl.trim()) return;
    onFormChange({ ...productForm, videos: [...currentVideos, newVideoUrl.trim()] });
    setNewVideoUrl('');
  };

  const handleRemoveVideo = async (index: number) => {
    const videoIdOrUrl = currentVideos[index];
    // If it's a video ID (not a URL), delete via API
    if (videoIdOrUrl && !videoIdOrUrl.startsWith('http') && !videoIdOrUrl.startsWith('data:')) {
      try {
        await onDeleteVideo(videoIdOrUrl);
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
    const updated = currentVideos.filter((_, i) => i !== index);
    onFormChange({ ...productForm, videos: updated });
  };

  const handleMoveVideo = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentVideos.length) return;
    const next = [...currentVideos];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onFormChange({ ...productForm, videos: next });
  };

  const handleSetVideoAsMain = async (index: number) => {
    const videoIdOrUrl = currentVideos[index];
    // If it's a video ID (not a URL), set as main via API
    if (videoIdOrUrl && !videoIdOrUrl.startsWith('http') && !videoIdOrUrl.startsWith('data:')) {
      try {
        await onSetVideoAsMain(videoIdOrUrl);
        onFormChange({ ...productForm, mainVideo: videoIdOrUrl });
      } catch (error) {
        console.error('Failed to set video as main:', error);
      }
    } else {
      // For URLs, just update the form state
      onFormChange({ ...productForm, mainVideo: videoIdOrUrl });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-xl font-bold text-gray-800">
        {editingProduct ? 'Edit Product' : 'Add New Product'}
      </h3>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Product Name
          </label>
          <input
            type="text"
            placeholder="Product Name"
            value={productForm.name}
            onChange={(e) => onFormChange({ ...productForm, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] text-sm"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Description
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => onFormChange({ ...productForm, description: e.target.value })}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] text-sm"
            />
            <button
              type="button"
              onClick={() => onOpenDescriptionBuilder(productForm.category)}
              className="whitespace-nowrap rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-semibold text-[#00342B] transition hover:bg-emerald-100"
            >
              Build
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Price ($)
          </label>
          <input
            type="number"
            placeholder="Price"
            value={productForm.price}
            onChange={(e) => onFormChange({ ...productForm, price: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Discount (%)
          </label>
          <input
            type="number"
            placeholder="Discount %"
            value={productForm.discountPercentage}
            onChange={(e) => onFormChange({ ...productForm, discountPercentage: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Stock Quantity
          </label>
          <input
            type="number"
            placeholder="Stock Quantity"
            value={productForm.stockQuantity}
            onChange={(e) => onFormChange({ ...productForm, stockQuantity: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Category
          </label>
          <select
            value={productForm.category}
            onChange={(e) => onFormChange({ ...productForm, category: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Offer Start
          </label>
          <input
            type="datetime-local"
            value={productForm.offerStartDate}
            onChange={(e) => onFormChange({ ...productForm, offerStartDate: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">
            Offer End
          </label>
          <input
            type="datetime-local"
            value={productForm.offerEndDate}
            onChange={(e) => onFormChange({ ...productForm, offerEndDate: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00342B] text-sm"
          />
        </div>

        {productForm.discountPercentage && productForm.price && (
          <div className="flex items-center px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
            Final Price: $
            {(
              Number(productForm.price) -
              (Number(productForm.price) * Number(productForm.discountPercentage)) / 100
            ).toFixed(2)}
          </div>
        )}
      </div>

      {/* Media Management Section */}
      <div className="border-t border-gray-200 pt-6 space-y-6">
        <div>
          <h4 className="text-lg font-bold text-gray-800">Product Media Upload & Management</h4>
          <p className="text-xs text-gray-500">
            Upload or link images and videos. Preview, reorder, or remove media items before saving.
          </p>
        </div>

        {/* 1. Main Image */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Main Image (Primary Display)</span>
            {productForm.mainImage && (
              <button
                type="button"
                onClick={() => onFormChange({ ...productForm, mainImage: '' })}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Remove Main Image
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 shadow-sm transition">
              Upload Main Image
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
            </label>
            <span className="text-xs text-gray-400">or URL:</span>
            <input
              type="text"
              placeholder="Paste Main Image URL"
              value={productForm.mainImage}
              onChange={(e) => onFormChange({ ...productForm, mainImage: e.target.value })}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00342B]"
            />
          </div>

          {/* Main Image Preview */}
          {productForm.mainImage ? (
            <div className="relative w-32 h-32 rounded-xl border border-emerald-500 overflow-hidden group bg-white shadow-sm">
              <img
                src={productForm.mainImage}
                alt="Main product preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                Main Image
              </span>
            </div>
          ) : (
            <div className="w-32 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-xs bg-white">
              <span>No Main Image</span>
            </div>
          )}
        </div>

        {/* 2. Additional Images Gallery */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">
              Additional Images Gallery ({currentImages.length})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 shadow-sm transition">
              Upload Multiple Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesUpload}
                className="hidden"
              />
            </label>
            <span className="text-xs text-gray-400">or add URL:</span>
            <div className="flex-1 flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Paste Image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00342B]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 bg-[#00342B] text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Additional Images Grid with Reordering & Removing */}
          {currentImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
              {currentImages.map((imgItem, idx) => {
                const imgUrl = typeof imgItem === 'string' ? imgItem : imgItem.imageUrl || imgItem.url || '';
                return (
                <div
                  key={idx}
                  className="relative group rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm flex flex-col"
                >
                  <div className="w-full h-24 relative overflow-hidden bg-gray-100">
                    <img
                      src={imgUrl}
                      alt={`Product gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Actions & Reorder bar */}
                  <div className="p-1.5 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveImage(idx, idx - 1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[10px] hover:bg-gray-100 disabled:opacity-30"
                        title="Move left"
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        disabled={idx === currentImages.length - 1}
                        onClick={() => handleMoveImage(idx, idx + 1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[10px] hover:bg-gray-100 disabled:opacity-30"
                        title="Move right"
                      >
                        ▶
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetImageAsMain(idx)}
                        className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] hover:bg-emerald-200"
                        title="Set as main image"
                      >
                        ★
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-red-500 hover:text-red-700 text-xs px-1 font-bold"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No additional images added yet.</p>
          )}
        </div>

        {/* 3. Main Video */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Main Video (Primary Showcase)</span>
            {productForm.mainVideo && (
              <button
                type="button"
                onClick={() => onFormChange({ ...productForm, mainVideo: '' })}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Remove Main Video
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 shadow-sm transition">
              Upload Main Video
              <input
                type="file"
                accept="video/*"
                onChange={handleMainVideoUpload}
                className="hidden"
              />
            </label>
            <span className="text-xs text-gray-400">or URL:</span>
            <input
              type="text"
              placeholder="Paste Main Video URL"
              value={productForm.mainVideo}
              onChange={(e) => onFormChange({ ...productForm, mainVideo: e.target.value })}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00342B]"
            />
          </div>

          {/* Main Video Preview */}
          {productForm.mainVideo ? (
            <div className="relative w-full max-w-sm rounded-xl border border-purple-500 overflow-hidden bg-black shadow-sm">
              <video
                src={productForm.mainVideo}
                controls
                className="w-full h-40 object-cover"
              />
              <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                Main Video
              </span>
            </div>
          ) : (
            <div className="w-48 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-xs bg-white">
              <span>No Main Video</span>
            </div>
          )}
        </div>

        {/* 4. Additional Videos Gallery */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">
              Additional Videos Gallery ({currentVideos.length})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 shadow-sm transition">
              Upload Multiple Videos
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleAdditionalVideosUpload}
                className="hidden"
              />
            </label>
            <span className="text-xs text-gray-400">or add URL:</span>
            <div className="flex-1 flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Paste Video URL"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00342B]"
              />
              <button
                type="button"
                onClick={handleAddVideoUrl}
                className="px-3 py-2 bg-[#00342B] text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Additional Videos Grid */}
          {currentVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {currentVideos.map((vidUrl, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm flex flex-col"
                >
                  <div className="w-full h-32 bg-black relative">
                    <video src={vidUrl} controls className="w-full h-full object-cover" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Video #{idx + 1}
                    </span>
                  </div>

                  <div className="p-1.5 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveVideo(idx, idx - 1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[10px] hover:bg-gray-100 disabled:opacity-30"
                        title="Move left"
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        disabled={idx === currentVideos.length - 1}
                        onClick={() => handleMoveVideo(idx, idx + 1)}
                        className="px-1.5 py-0.5 bg-white border rounded text-[10px] hover:bg-gray-100 disabled:opacity-30"
                        title="Move right"
                      >
                        ▶
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetVideoAsMain(idx)}
                        className="px-1.5 py-0.5 bg-purple-100 text-purple-700 border border-purple-200 rounded text-[10px] hover:bg-purple-200"
                        title="Set as main video"
                      >
                        ★
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      className="text-red-500 hover:text-red-700 text-xs px-1 font-bold"
                      title="Remove video"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No additional videos added yet.</p>
          )}
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="pt-4 flex gap-3 border-t border-gray-100">
        <button
          onClick={onSubmit}
          className="px-6 py-2.5 bg-[#00342B] text-white rounded-xl font-medium hover:bg-emerald-800 transition-colors shadow-md shadow-emerald-900/20 cursor-pointer"
        >
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
