import { Building2 } from "lucide-react";
import React from "react";

export function Header() {
  return (
    <div className="sticky top-0 z-50 flex items-center gap-4 bg-white/90 px-6 py-4 shadow-md backdrop-blur-sm">
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
        <Building2 className="text-primary h-6 w-6" />
      </div>
      <div>
        <h1 className="text-foreground text-3xl font-bold">
          Company Management
        </h1>
        <p className="text-muted-foreground">
          Manage and organize your company portfolio
        </p>
      </div>
    </div>
  );
}
