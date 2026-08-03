import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ContentSection } from '../../models/content-section.model';

@Component({
	selector: 'app-side-nav',
	imports: [CommonModule, MatDivider],
	templateUrl: './side-nav.component.html',
	styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
	@Input() sections: ContentSection[] = [];
	@Input() sectionVisibility: Record<string, boolean> = {};

	@Output() sectionSelected = new EventEmitter<string>();

	onButtonClick(sectionId: string): void {
		this.sectionSelected.emit(sectionId);
	}
}