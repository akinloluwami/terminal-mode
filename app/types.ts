export interface TerminalLineProps {
  type?: "input" | "output";
  text?: string;
  command?: string;
  onCommand?: (command: string) => void;
  customStyle?: string;
  acceptValue?: boolean;
}
