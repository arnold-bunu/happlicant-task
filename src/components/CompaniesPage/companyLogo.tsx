/**
 * Renders a company avatar. If a valid `logo` URL is provided, the component displays the image
 * inside an Avatar. If no logo is provided (or the value is falsy), the component renders a
 * textual fallback consisting of the uppercase initials derived from the provided `name`.
 *
 * @param props.logo - URL of the company's logo image. If falsy, the component falls back to initials.
 * @param props.name - Company name used for the image alt attribute and to generate initials for the fallback.
 *                      Multiple words in the name will produce an initial for each word (e.g. "Acme Corp" -> "AC").
 * @returns A JSX element (Avatar) containing either an AvatarImage or an AvatarFallback with initials.
 *
 * @example
 * <CompanyLogo logo="https://example.com/logo.png" name="Acme Corporation" />
 *
 * @remarks
 * This component assumes that `Avatar`, `AvatarImage`, and `AvatarFallback` are available in scope.
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function CompanyLogo({ logo, name }: { logo: string; name: string }) {
  return (
    <Avatar className="h-10 w-10">
      {logo ? <AvatarImage src={logo} alt={name} /> : null}
      <AvatarFallback>
        {name
          ?.split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export default CompanyLogo;
