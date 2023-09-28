import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

type TooltipIconProps = {
	children: React.ReactNode;
	tooltipText: string;
};

export const TooltipIcon = ({ children, tooltipText }: TooltipIconProps) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent>
				<p>{tooltipText}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);
