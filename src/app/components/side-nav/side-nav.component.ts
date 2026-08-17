import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ContentSection } from '../../models/content-section.model';

@Component({
	selector: 'app-side-nav',
	imports: [CommonModule, MatDivider, MatIconModule],
	templateUrl: './side-nav.component.html',
	styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
	@Input() sections: ContentSection[] = [];
	@Input() sectionVisibility: Record<string, boolean> = {};
	@Input() showDownloadBtn = false;

	@Output() sectionSelected = new EventEmitter<string>();

	onButtonClick(sectionId: string): void {
		this.sectionSelected.emit(sectionId);
	}

	onDownloadClick(): void {
		// The print-only view (app-print-view) is always present in the DOM,
		// CSS-hidden on screen.
		window.print();
	}
}