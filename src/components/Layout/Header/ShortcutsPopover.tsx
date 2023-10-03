import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/shortcuts-table';
import {
	ArrowBigDown,
	ArrowBigLeft,
	ArrowBigRight,
	ArrowBigUp,
	CornerDownLeft,
	HelpCircle,
	Minus,
	Plus,
	Space,
} from 'lucide-react';
import { ReactNode } from 'react';

interface ShortcutRowProps {
	icon: ReactNode;
	functionDescription: string;
}

const ShortcutRow: React.FC<ShortcutRowProps> = ({
	icon,
	functionDescription,
}) => (
	<TableRow>
		<TableCell className='p-2'>{icon}</TableCell>
		<TableCell className='text-right'>{functionDescription}</TableCell>
	</TableRow>
);

const ShortcutsPopover = () => {
	const shortcuts = [
		{ icon: <CornerDownLeft size={18} />, function: 'Restart Track' },
		{ icon: <Space size={18} />, function: 'Play/Pause' },
		{ icon: <ArrowBigUp size={18} />, function: 'Play prev. track' },
		{ icon: <ArrowBigDown size={18} />, function: 'Play next track' },
		{ icon: <ArrowBigLeft size={18} />, function: 'Back 15 Seconds' },
		{ icon: <ArrowBigRight size={18} />, function: 'Skip 15 Seconds' },
		{ icon: 'M', function: 'Toggle mute' },
		{ icon: 'R', function: 'Toggle repeat' },
		{ icon: <Plus size={18} />, function: 'Increase volume' },
		{ icon: <Minus size={18} />, function: 'Decrease volume' },
	];

	return (
		<Popover>
			<PopoverTrigger>
				<HelpCircle className='-mb-1' />
			</PopoverTrigger>
			<PopoverContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Shortcut</TableHead>
							<TableHead className='text-right'>Function</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{shortcuts.map((shortcut, index) => (
							<ShortcutRow
								key={index}
								icon={shortcut.icon}
								functionDescription={shortcut.function}
							/>
						))}
					</TableBody>
				</Table>
			</PopoverContent>
		</Popover>
	);
};

export default ShortcutsPopover;
