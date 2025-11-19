import {
  ArrowDownCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  WrenchIcon,
  ArrowUpCircleIcon
} from '@heroicons/react/24/solid';


export const InputIcon = (props: any) => <ArrowDownCircleIcon className="w-5 h-5" {...props} />;
export const AgentIcon = (props: any) => <UserIcon className="w-5 h-5" {...props} />;
export const OrchestratorIcon = (props: any) => <Cog6ToothIcon className="w-5 h-5" {...props} />;
export const RouterIcon = (props: any) => <ShareIcon className="w-5 h-5" {...props} />;
export const AssistantIcon = (props: any) => <ChatBubbleLeftRightIcon className="w-5 h-5" {...props} />;
export const ServiceIcon = (props: any) => <WrenchScrewdriverIcon className="w-5 h-5" {...props} />;
export const ToolIcon = (props: any) => <WrenchIcon className="w-5 h-5" {...props} />;
export const OutputIcon = (props: any) => <ArrowUpCircleIcon className="w-5 h-5" {...props} />;
