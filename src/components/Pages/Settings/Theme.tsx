import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const Theme = () => {
	const { theme, handleThemeChange } = useContext(ThemeContext);
	const themes = ['light', 'dark', 'system'];

	return (
		<section className='flex justify-between border-b border-b-gray pb-10'>
			<div>
				<p className='text-xl'>Theme:</p>
				<p className='text-sm text-muted-foreground'>Set the color scheme</p>
			</div>
			<div className='flex gap-4'>
				<RadioGroup
					defaultValue='system'
					value={theme}
					onValueChange={handleThemeChange}>
					<div className='flex items-center gap-8'>
						{themes.map((themeOption) => (
							<div
								className='flex flex-col items-center gap-3'
								key={themeOption}>
								<Label htmlFor={themeOption} className='cursor-pointer'>
									<span>
										{themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
									</span>
								</Label>
								<RadioGroupItem id={themeOption} value={themeOption} />
							</div>
						))}
					</div>
				</RadioGroup>
			</div>
		</section>
	);
};

export default Theme;
