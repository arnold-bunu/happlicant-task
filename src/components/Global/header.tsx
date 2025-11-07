/**
 * Header component that renders the application's top bar.
 *
 * Renders a sticky header containing a user icon and two lines of text (name and subtitle).
 * The component consults the current pathname via `usePathname()` and will render nothing
 * when the pathname is not "/companies".
 *
 * @remarks
 * - When rendered, the header is styled to be sticky at the top, with a semi-transparent
 *   white background, shadow, and backdrop blur.
 * - If visibility control or additional accessibility attributes are required, consider
 *   enhancing the element with ARIA attributes or passing props.
 *
 * @returns {JSX.Element | undefined} The header JSX when on the "/companies" route; otherwise `undefined`.
 *
 * @example
 * <Header />
 *
 * @see usePathname
 */

'use client";';
import { Building2, User } from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  if (pathname !== "/companies") {
    return;
  }

  return (
    <div className="sticky top-0 z-50 flex items-center gap-4 bg-white/90 px-6 py-4 shadow-md backdrop-blur-sm">
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
        <User className="text-primary h-6 w-6" />
      </div>
      <div>
        <h1 className="text-foreground text-3xl font-bold">Arnold Bunu</h1>
        <p className="text-muted-foreground">
          Happlicant Task - Company Management
        </p>
      </div>
    </div>
  );
}
