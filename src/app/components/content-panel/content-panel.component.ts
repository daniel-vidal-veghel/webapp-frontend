import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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

	constructor(private readonly sanitizer: DomSanitizer) {}

	/**
	 * The XML file is trusted, server-side, editor-controlled content (not
	 * arbitrary user input), so it is rendered as sanitized HTML here to
	 * allow rich formatting (paragraphs, lists, links, etc.) inside a panel.
	 */
	asHtml(section: ContentSection): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(section.html);
	}
}
