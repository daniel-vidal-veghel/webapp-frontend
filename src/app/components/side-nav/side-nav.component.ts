import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ContentSection } from '../../models/content-section.model';

export type SiteLanguage = 'nl' | 'en';

@Component({
	selector: 'app-side-nav',
	imports: [CommonModule, MatDivider, MatIconModule],
	templateUrl: './side-nav.component.html',
	styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
	@Input() sections: ContentSection[] = [];
	@Input() sectionVisibility: Record<string, boolean> = {};
	@Input() showCtrlBtns = false;
	@Input() currentLang: SiteLanguage = 'nl';

	// CLick events	
	@Output() sectionSelected = new EventEmitter<string>();
	@Output() languageSwitchRequested = new EventEmitter<void>();

	onButtonClick(sectionId: string): void {
		this.sectionSelected.emit(sectionId);
	}

	onDownloadClick(): void {
		// The print-only view (app-print-view) is always present in the DOM,
		// CSS-hidden on screen.
		window.print();
	}

	onLanguageSwitchClick(): void {
		this.languageSwitchRequested.emit();
	}
}