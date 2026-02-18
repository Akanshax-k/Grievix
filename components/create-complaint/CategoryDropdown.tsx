"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tag } from "lucide-react";

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const categories = [
  { value: "water", label: "💧 Water Supply" },
  { value: "road", label: "🛣️ Road & Pavement" },
  { value: "electricity", label: "⚡ Electricity" },
  { value: "garbage", label: "🗑️ Garbage & Waste" },
  { value: "drainage", label: "🌊 Drainage & Sewage" },
  { value: "street_light", label: "💡 Street Lighting" },
  { value: "other", label: "📋 Other" },
];

export default function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-blue-500" />
        Category <span className="text-red-400">*</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="category"
          className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-all duration-300 cursor-pointer"
        >
          <SelectValue placeholder="Select complaint category..." />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
          {categories.map((cat) => (
            <SelectItem
              key={cat.value}
              value={cat.value}
              className="rounded-lg cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-200"
            >
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}