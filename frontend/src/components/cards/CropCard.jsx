import { motion } from "framer-motion";
import Button from "../ui/Button";
export default function CropCard({ crop, rank }) {
  const imageUrl =
    crop.image_url || `https://source.unsplash.com/featured/?${encodeURIComponent(crop.name)}`;
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <img src={imageUrl} alt={crop.name} className="h-36 w-full object-cover" />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {rank ? `${rank}. ` : ""}
            {crop.name}
          </h3>
          {crop.suitability_score && (
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700">
              {crop.suitability_score}%
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {crop.description || crop.fertilizer_recommendation}
        </p>
        <div className="mt-4 text-sm">
          <b>Yield:</b> {crop.yield_per_acre || "Region dependent"}
        </div>
        {crop.suitability_score && (
          <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-primary-600"
              style={{ width: `${crop.suitability_score}%` }}
            />
          </div>
        )}
        <Button className="mt-4 w-full" variant="secondary">
          View Crop
        </Button>
      </div>
    </motion.div>
  );
}
