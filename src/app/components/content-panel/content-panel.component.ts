import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContentSection } from '../../models/content-section.model';

@Component({
	selector: 'app-content-panel',
	imports: [CommonModule, MatExpansionModule, MatDivider],
	templateUrl: './content-panel.component.html',
	styleUrls: ['./content-panel.component.scss']
})
export class ContentPanelComponent {
	@Input() sections: ContentSection[] = [];
}
