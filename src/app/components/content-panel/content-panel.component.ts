import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
	@Input() setup?: ContentSection;

	@ViewChild('imageDialog') private imageDialog!: ElementRef<HTMLDialogElement>;
	// Every image in the panel, in page order, so the arrows step across sections.
	images: HTMLImageElement[] = [];
	imageIndex = 0;

	// Section HTML arrives through [innerHTML], which Angular never compiles, so an <img> in it can't carry its own (click).
	openImage(event: MouseEvent): void {
		if (!(event.target instanceof HTMLImageElement))
			return;
		const panel = event.currentTarget as HTMLElement;
		this.images = Array.from(panel.querySelectorAll<HTMLImageElement>('.content-panel__body img'));
		this.imageIndex = this.images.indexOf(event.target);
		this.imageDialog.nativeElement.showModal();
	}

	stepImage(direction: number): void {
		this.imageIndex = (this.imageIndex + direction + this.images.length) % this.images.length;
	}
}
