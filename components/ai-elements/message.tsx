"use client";

import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import type { UIMessage } from "ai";
import { memo, type ComponentProps, type HTMLAttributes } from "react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export function Message({ className, from, ...props }: MessageProps) {
  return (
    <div
      className={cn(
        "group flex w-full max-w-[95%] flex-col gap-2",
        from === "user" ? "ml-auto items-end" : "items-start",
        className,
      )}
      {...props}
    />
  );
}

export type MessageContentProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export function MessageContent({ className, from, ...props }: MessageContentProps) {
  return (
    <div
      className={cn(
        "w-fit min-w-0 max-w-full rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
        from === "user"
          ? "rounded-br-md bg-ink text-white"
          : "rounded-bl-md bg-slate-100 text-slate-700",
        className,
      )}
      {...props}
    />
  );
}

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

const streamdownPlugins = { cjk, code, math, mermaid };

export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
      plugins={streamdownPlugins}
      {...props}
    />
  ),
  (previous, next) =>
    previous.children === next.children &&
    previous.isAnimating === next.isAnimating,
);

MessageResponse.displayName = "MessageResponse";
