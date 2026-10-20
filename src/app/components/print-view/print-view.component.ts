import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentSection } from '../../models/content-section.model';

// A grid column in print is about 9 cm wide, so 1000 px prints at roughly 300 ppi.
const maxPrintImageWidth = 800;

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
export class PrintViewComponent implements OnInit {
	@Input() sections: ContentSection[] = [];

	constructor(private readonly host: ElementRef<HTMLElement>) { }

	// These are the sections that are visible in the content panel. Other sections may exist.
	get inlineSections(): ContentSection[] {
		return this.sections.filter(
			(section) => section.type === 'divider' || section.type === 'expansion' || section.type === 'header'
		);
	}

	// Each time an image inside the print view finishes loading (including new ones after a language switch), prepareImageForPrint links it to its full-size original and scales it down for the PDF.
	// load doesn't bubble up from an image to its parents, so the listener uses the capture phase (the true), in which the event passes through this element on its way down to the image.
	ngOnInit(): void {
		this.host.nativeElement.addEventListener('load', (event) => this.prepareImageForPrint(event.target), true);
	}

	// Linking comes first: once scaled down, src holds the small copy instead of the original's URL.
	private prepareImageForPrint(target: EventTarget | null): void {
		if (!(target instanceof HTMLImageElement))
			return;

		this.linkToOriginal(target);
		this.scaleDownImage(target);
	}

	// Make image clickable. Opens browser.
	private linkToOriginal(image: HTMLImageElement): void {
		if (image.closest('a'))
			return;

		const link = document.createElement('a');
		link.href = image.src;
		image.replaceWith(link);
		link.append(image);
	}

	// Scale down to reduce file size.
	private scaleDownImage(image: HTMLImageElement): void {
		if (image.naturalWidth <= maxPrintImageWidth)
			return;

		const canvas = document.createElement('canvas');
		canvas.width = maxPrintImageWidth;
		canvas.height = Math.round(image.naturalHeight * maxPrintImageWidth / image.naturalWidth);
		const context = canvas.getContext('2d');
		if (!context)
			return;

		context.imageSmoothingQuality = 'high';
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		// Fires load again; by then the image is linked and small enough, so both steps skip it.
		image.src = canvas.toDataURL('image/jpg', 0.85);
	}
}
