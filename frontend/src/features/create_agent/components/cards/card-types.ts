import {
  InputIcon,
  AgentIcon,
  OrchestratorIcon,
  RouterIcon,
  AssistantIcon,
  ServiceIcon,
  ToolIcon,
  OutputIcon
} from "../icons/AgentIcons";

export const CARD_TYPES = [
  { type: "INPUT", label: "INPUT", color: "#22c55e", icon: InputIcon },
  { type: "AGENT", label: "AGENT", color: "#38bdf8", icon: AgentIcon },
  { type: "ORCHESTRATOR", label: "ORCHESTRATOR", color: "#facc15", icon: OrchestratorIcon },
  { type: "ROUTER", label: "ROUTER", color: "#2563eb", icon: RouterIcon },
  { type: "ASSISTANT", label: "ASSISTANT", color: "#a78bfa", icon: AssistantIcon },
  { type: "SERVICE", label: "SERVICE", color: "#14b8a6", icon: ServiceIcon },
  { type: "TOOL", label: "TOOL", color: "#fb923c", icon: ToolIcon },
  { type: "OUTPUT", label: "OUTPUT", color: "#ef4444", icon: OutputIcon },
];
