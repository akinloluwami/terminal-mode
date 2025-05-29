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
      id: "6c3e3556-30f2-4d9a-817d-9ac758f15ec5",
      type: "output",
      text: "Welcome to the terminal!",
    },
    {
      id: "1f2cb41d-43e5-44b7-b3c8-d8a9dcbdcc31",
      type: "output",
      text: "run `ssh help` to see available commands",
    },
    {
      id: "e32e8125-ae1d-4977-81be-dfcbdb0b97af",
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
            id: crypto.randomUUID(),
            type: "output",
            text: "ssh signup - Create a new account",
            customStyle: "!text-blue-400",
          },
          {
            id: crypto.randomUUID(),

            type: "output",
            text: "ssh login - Log in to your account",
            customStyle: "!text-blue-400",
          },
          {
            id: crypto.randomUUID(),

            type: "output",
            text: "ssh logout - Log out of your account",
            customStyle: "!text-blue-400",
          },
          {
            id: crypto.randomUUID(),

            type: "output",
            text: "ssh status - Check the status of your account",
            customStyle: "!text-blue-400",
          },
          {
            id: crypto.randomUUID(),
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
            id: crypto.randomUUID(),
            type: "output",
            text: "Enter your username:",
          },
          {
            id: crypto.randomUUID(),

            type: "input",
            acceptValue: true,
            onCommand: (username) => {
              const pendingId = crypto.randomUUID();
              setStack((prev) => [
                ...prev.filter((item) => item.type !== "input"),
                {
                  id: pendingId,
                  type: "output",
                  text: `Creating account for ${username}...`,
                  isLoading: true,
                },
              ]);
              setTimeout(() => {
                setStack((prev) => [
                  ...prev.filter((item) => item.id !== pendingId),
                  {
                    id: crypto.randomUUID(),
                    type: "output",
                    text: `Account created successfully for ${username}!`,
                    customStyle: "!text-green-500",
                  },
                  {
                    id: crypto.randomUUID(),
                    type: "input",
                    acceptValue: true,
                    onCommand: handleCommand,
                  },
                ]);
              }, 2000);
            },
          },
        ]);
      },
    },
    {
      command: "clear",
      action: () => {
        setStack([
          {
            id: crypto.randomUUID(),
            type: "output",
            text: "Welcome to the terminal!",
          },
          {
            id: crypto.randomUUID(),
            type: "input",
            acceptValue: true,
            onCommand: handleCommand,
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

      updated.push({
        id: crypto.randomUUID(),
        type: "output",
        text: command,
      });

      if (action) {
        return updated;
      }

      updated.push({
        id: crypto.randomUUID(),
        type: "output",
        text: `Command not found: ${command}`,
        customStyle: "!text-red-500",
      });

      updated.push({
        id: crypto.randomUUID(),
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
    <div className="py-7 lg:px-12 px-8 flex flex-col gap-2">
      {stack.map((line, index) => (
        <TerminalLine
          id={line.id}
          key={index}
          type={line.type}
          text={line.text}
          onCommand={line.acceptValue ? line.onCommand : handleCommand}
          customStyle={line.customStyle}
          acceptValue={line.acceptValue}
          isLoading={line.isLoading}
        />
      ))}
    </div>
  );
}
