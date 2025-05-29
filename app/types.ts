export interface TerminalLineProps {
  id: string;
  type?: "input" | "output";
  text?: string;
  command?: string;
  onCommand?: (command: string) => void;
  customStyle?: string;
  acceptValue?: boolean;
  isLoading?: boolean;
}
