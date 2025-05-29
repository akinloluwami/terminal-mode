import type { TerminalLineProps } from "@/types";
import { useRef, useState, type FC, useEffect, useCallback } from "react";
import { PiSpinnerLight } from "react-icons/pi";

const getTextWidth = (text: string, font: string): number => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};

const TerminalLine: FC<TerminalLineProps> = ({
  type,
  text,
  onCommand,
  customStyle,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const [caretPosition, setCaretPosition] = useState(0);

  useEffect(() => {
    if (type === "input") {
      inputRef.current?.focus();
    }
  }, [type]);

  const updateCaretPosition = useCallback(() => {
    if (inputRef.current && caretRef.current) {
      const inputElement = inputRef.current;
      const computedStyle = window.getComputedStyle(inputElement);
      const fontSize = computedStyle.fontSize;
      const fontFamily = computedStyle.fontFamily;
      const font = `${fontSize} ${fontFamily}`;

      const textBeforeCaret = inputValue.substring(
        0,
        inputElement.selectionStart || 0
      );
      const width = getTextWidth(textBeforeCaret, font);
      setCaretPosition(width);
    }
  }, [inputValue]);

  useEffect(() => {
    updateCaretPosition();
  }, [inputValue]);

  useEffect(() => {
    const handleGlobalKeyDown = () => {
      if (
        type === "input" &&
        inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current.focus();

        setTimeout(() => {
          updateCaretPosition();
        }, 0);
      }
    };

    document.body.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.body.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [type, updateCaretPosition]);

  const handleInputClick = () => {
    inputRef.current?.focus();

    setTimeout(() => {
      updateCaretPosition();
    }, 0);
  };

  return (
    <div className="font-mono">
      {type === "input" && (
        <div
          className="flex items-center w-full relative"
          onClick={handleInputClick}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputValue) {
                onCommand?.(inputValue);
                setInputValue("");
              }
            }}
            className="flex items-center w-full"
          >
            <span
              className="absolute left-0 top-0 whitespace-pre"
              style={{
                visibility: "hidden",
                pointerEvents: "none",
                fontSize: window.getComputedStyle(
                  inputRef.current || document.body
                ).fontSize,
                fontFamily: window.getComputedStyle(
                  inputRef.current || document.body
                ).fontFamily,
              }}
            >
              {inputValue}
            </span>

            <input
              className="outline-0 bg-transparent text-white caret-transparent w-full absolute left-0 top-0 z-10"
              autoFocus
              value={inputValue}
              ref={inputRef}
              onChange={(e) => {
                setInputValue(e.target.value.toLowerCase());
              }}
              onKeyUp={updateCaretPosition}
              onSelect={updateCaretPosition}
              onBlur={() => setCaretPosition(-1)}
              onFocus={updateCaretPosition}
              style={{
                color: "white",
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                border: "none",
              }}
            />

            <span className="text-white z-0 relative pr-1 flex items-center">
              {" "}
              {inputValue}
              <span
                ref={caretRef}
                className="w-[5px] h-5 bg-purple-600 animate-pulse absolute top-0"
                style={{
                  left: `${caretPosition}px`,
                  transform: "translateY(-2px)",
                }}
              />
            </span>
          </form>
        </div>
      )}
      {type === "output" && (
        <span className={`text-gray-500 ${customStyle ? customStyle : ""}`}>
          $ {text}{" "}
          {isLoading && (
            <PiSpinnerLight className="inline animate-spin" size={20} />
          )}
        </span>
      )}
    </div>
  );
};
export default TerminalLine;
