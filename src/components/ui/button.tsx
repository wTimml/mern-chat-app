import * as React from "react";
import { cn } from "@/lib/utils";

function Button({ className, type, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="input"
      className={cn(
        "rounded-full border-none p-2 text-[1em] bg-primary text-white cursor-pointer hover:bg-primary-hover transition-all duration-300",
        className
      )}
      {...props}
    />
  );
}

export { Button };
