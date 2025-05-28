import type { TerminalLineProps } from "@/types";
import { useRef, useState, type FC } from "react";

const TerminalLine: FC<TerminalLineProps> = ({
  type,
  text,
  onCommand,
  customStyle,
}) => {
  const [inputValue, setInputValue] = useState("");

  const inpurRef = useRef<HTMLInputElement>(null);

  return (
    <div className="font-mono">
      {type === "input" && (
        <div
          className="flex items-center w-full"
          onClick={() => {
            inpurRef.current?.focus();
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector("input");
              if (input && input.value) {
                onCommand?.(input.value);
              }
            }}
          >
            <input
              className="outline-0 bg-transparent text-white caret-transparent w-0"
              autoFocus
              value={inputValue}
              ref={inpurRef}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue}
          </form>
          <span className="w-[5px] h-5 bg-purple-600 animate-pulse" />
        </div>
      )}
      {type === "output" && (
        <span className={`text-gray-500 ${customStyle ? customStyle : ""}`}>
          $ {text}
        </span>
      )}
    </div>
  );
};

export default TerminalLine;
