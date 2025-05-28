import TerminalLine from "../components/terminal-line";
import type { TerminalLineProps } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [stack, setStack] = useState<TerminalLineProps[]>([
    {
      type: "output",
      text: "Welcome to the terminal!",
    },
    {
      type: "output",
      text: "run `ssh help` to see available commands",
    },
    {
      type: "input",
    },
  ]);

  const commandsActions = [
    {
      command: "ssh help",
      action: () => {
        setStack((prev) => [
          ...prev,
          {
            type: "output",
            text: "ssh signup - Create a new account",
            customStyle: "!text-blue-400",
          },
          {
            type: "output",
            text: "ssh login - Log in to your account",
            customStyle: "!text-blue-400",
          },
          {
            type: "output",
            text: "ssh logout - Log out of your account",
            customStyle: "!text-blue-400",
          },
          {
            type: "output",
            text: "ssh status - Check the status of your account",
            customStyle: "!text-blue-400",
          },
          {
            type: "input",
          },
        ]);
      },
    },
    {
      command: "ssh signup",
      action: () => {
        setStack((prev) => [
          ...prev,
          {
            type: "output",
            text: "Enter your username:",
          },
          {
            type: "input",
            acceptValue: true,
            onCommand: (username) => {
              setStack((prev) => [
                ...prev.filter((item) => item.type !== "input"),
                { type: "output", text: `Username ${username} created!` },
                {
                  type: "input",
                  acceptValue: true,
                  onCommand: handleCommand,
                },
              ]);
            },
          },
        ]);
      },
    },
  ];

  const handleCommand = (command: string) => {
    const normalized = command.trim().toLowerCase();

    const action = commandsActions.find((c) => c.command === normalized);

    setStack((prev) => {
      const updated = [...prev];

      const lastInputIndex = [...updated]
        .reverse()
        .findIndex((item) => item.type === "input");
      if (lastInputIndex !== -1) {
        updated.splice(updated.length - 1 - lastInputIndex, 1);
      }

      updated.push({ type: "output", text: command });

      if (action) {
        return updated;
      }

      updated.push({
        type: "output",
        text: `Command not found: ${command}`,
        customStyle: "!text-red-500",
      });

      updated.push({
        type: "input",
        acceptValue: true,
        onCommand: handleCommand,
      });

      return updated;
    });

    if (action) {
      setTimeout(() => {
        action.action();
      }, 0);
    }
  };

  return (
    <div className="py-7 lg:px-12 px-8">
      {stack.map((line, index) => (
        <TerminalLine
          key={index}
          type={line.type}
          text={line.text}
          onCommand={line.acceptValue ? line.onCommand : handleCommand}
          customStyle={line.customStyle}
          acceptValue={line.acceptValue}
        />
      ))}
    </div>
  );
}
