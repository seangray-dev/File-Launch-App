import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilterDropdownProps } from '@/types';

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
	lastModifiedFilters,
	fileTypeFilters,
	setLastModifiedFilters,
	setFileTypeFilters,
	clearAllFilters,
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>Filters</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuLabel>Last Modified</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem
					checked={lastModifiedFilters.oneDay}
					onCheckedChange={() =>
						setLastModifiedFilters({
							...lastModifiedFilters,
							oneDay: !lastModifiedFilters.oneDay,
						})
					}>
					1 day
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={lastModifiedFilters.threeDays}
					onCheckedChange={() =>
						setLastModifiedFilters({
							...lastModifiedFilters,
							threeDays: !lastModifiedFilters.threeDays,
						})
					}>
					3 days
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={lastModifiedFilters.sevenDays}
					onCheckedChange={() =>
						setLastModifiedFilters({
							...lastModifiedFilters,
							sevenDays: !lastModifiedFilters.sevenDays,
						})
					}>
					7 days
				</DropdownMenuCheckboxItem>
				<DropdownMenuLabel>File Type</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem
					checked={fileTypeFilters.mp3}
					onCheckedChange={() =>
						setFileTypeFilters({
							...fileTypeFilters,
							mp3: !fileTypeFilters.mp3,
						})
					}>
					.mp3
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={fileTypeFilters.wav}
					onCheckedChange={() =>
						setFileTypeFilters({
							...fileTypeFilters,
							wav: !fileTypeFilters.wav,
						})
					}>
					.wav
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={fileTypeFilters.mp4}
					onCheckedChange={() =>
						setFileTypeFilters({
							...fileTypeFilters,
							mp4: !fileTypeFilters.mp4,
						})
					}>
					.mp4
				</DropdownMenuCheckboxItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={clearAllFilters}>
					Clear All Filters
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
