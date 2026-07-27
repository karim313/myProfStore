import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { addReview } from "../../api/axios";
import { useReviewedProducts } from "../../Context/ReviewedProductsContext";
import { getPrimaryImage } from "@/lib/productMedia";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: any;
  review: any;
  productId?: number;
}

export default function ProductReviewsDialog({
  open,
  setOpen,
  product,
  review,
  productId
}: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { refreshReviewedProducts } = useReviewedProducts();

  // add review
  const handleAddReview = async () => {
    setError(null);
    try {
      console.log({
        productId,
        rating,
        comment,
      });

      const res = await addReview(productId!, {
        rating,
        comment,
      });

      console.log(res);
      await refreshReviewedProducts();
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);
        const errorMessage = error.response?.data?.message || error.response?.data || "فشل إضافة التقييم";
        setError(errorMessage);
      } else {
        console.error(error);
        setError("حدث خطأ غير متوقع");
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-right mt-5">تقييمات المنتج</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 items-center border-b pb-4">
          <img
            src={getPrimaryImage(product)}
            alt={product?.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-lg font-bold">{product?.name}</h2>
            <div className="text-gray-500 text-sm mt-1">
              ⭐ {review?.averageRating || 0} ({review?.reviewsCount || 0} Reviews)
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-3">آراء العملاء</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {review?.comments?.length > 0 ? (
              review.comments.map((item: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-semibold">{item.userName}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-yellow-500 text-sm">
                      ⭐ {item.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{item.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-gray-400 py-4">لا يوجد تقييمات لهذا المنتج</div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <h3 className="font-semibold mb-3">أضف تقييمك</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                onClick={() => setRating(star)}
                className={`cursor-pointer ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك..."
            className="w-full border rounded-lg p-3 outline-none"
          />
          <button className="mt-3 w-full bg-[#00342B] text-white py-2 rounded-lg" onClick={handleAddReview}>
            إرسال التقييم
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}