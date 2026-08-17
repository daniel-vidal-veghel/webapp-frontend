import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentSection } from '../../models/content-section.model';

/**
 * Print rendering of the content -  independent from ContentPanelComponent's;
 * keeps styling separate from angular stuff 
 *
 * Always present in the DOM (CSS-hidden on screen, shown only under
 * @media print - see print-view.component.scss) so window.print() has
 * something to print without any on-demand construction/timing logic.
 */
@Component({
	selector: 'app-print-view',
	imports: [CommonModule],
	templateUrl: './print-view.component.html',
	styleUrls: ['./print-view.component.scss']
})
export class PrintViewComponent {
	@Input() sections: ContentSection[] = [];

	// These are the sections that are visible in the content panel. Other sections may exist.
	get inlineSections(): ContentSection[] {
		return this.sections.filter(
			(section) => section.type === 'divider' || section.type === 'expansion' || section.type === 'header'
		);
	}
}
