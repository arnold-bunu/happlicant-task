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
