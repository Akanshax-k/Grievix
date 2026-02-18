"use client";

import { ArrowLeft, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">

        {/* Left: back arrow + logo + title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 transition-all duration-300"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-blue-700 text-sm sm:text-base">
              Public Grievance Portal
            </span>
          </div>
        </div>

        {/* Right: share button + avatar */}
        <div className="flex items-center gap-2">
          {/* Desktop share button */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-1.5 rounded-full border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-gray-600"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>

          {/* Mobile share icon */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden rounded-full hover:bg-gray-100"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Avatar with online dot */}
          <div className="relative">
            <Avatar className="w-9 h-9 border-2 border-blue-100">
              <AvatarImage src="/avatar.png" alt="User avatar" />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                U
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          </div>
        </div>

      </div>
    </header>
  );
}