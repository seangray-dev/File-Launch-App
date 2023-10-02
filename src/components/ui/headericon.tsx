import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

type HeaderIconProps = {
	tooltipText: string;
	onClick?: () => void;
	children: React.ReactNode;
};

export const HeaderIcon = ({
	children,
	tooltipText,
	onClick,
}: HeaderIconProps) => (
	<li onClick={onClick}>
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<span className='hover:text-primary transition-all duration-300 cursor-pointer'>
						{children}
					</span>
				</TooltipTrigger>
				<TooltipContent>
					<p>{tooltipText}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</li>
);
