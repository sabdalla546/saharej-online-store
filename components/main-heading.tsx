import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
interface HeaderProps {
  lebel: string;
  description: string;
}

export const MainHeader = ({ lebel, description }: HeaderProps) => {
  return (
    <div>
      <h1 className={cn("text-3xl font-bold tracking-tigh", font.className)}>
        {lebel}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
