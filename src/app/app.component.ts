import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentSection } from './models/content-section.model';
import { ContentService } from './services/content.service';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ContentPanelComponent } from './components/content-panel/content-panel.component';

@Component({
	selector: 'app-root',
	imports: [CommonModule, SideNavComponent, ContentPanelComponent],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	sections: ContentSection[] = [];
	isLoading = true;
	loadError = false;
	sectionVisibility: Record<string, boolean> = {};

	@ViewChild('contentColumn') private contentColumnRef?: ElementRef<HTMLElement>;

	private intersectionObserver?: IntersectionObserver;

	constructor(
		private readonly contentService: ContentService,
		private readonly cdr: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		// Prevent local caching by fetching every time.
		this.loadSections();
	}

	ngOnDestroy(): void {
		this.intersectionObserver?.disconnect();
	}

	onSectionSelected(sectionId: string): void {
		const target = document.getElementById(sectionId);
		target?.scrollIntoView({ behavior: 'smooth', block: 'start' });

		// Pause continuous tracking for the duration of this animated scroll.
		// The observer fires repeatedly throughout ANY scroll motion - including
		// this one - so leaving it running races against the rebuild below and
		// can overwrite correct post-scroll data with stale mid-transition state.
		this.intersectionObserver?.disconnect();

		const root = this.contentColumnRef?.nativeElement;
		if (root && 'onscrollend' in root) {
			const handleScrollEnd = () => {
				root.removeEventListener('scrollend', handleScrollEnd);
				// Rebuilding from scratch both gives an accurate baseline for the
				// new scroll position and re-arms continuous tracking for
				// whatever free-scrolling happens next.
				this.setupActiveSectionTracking();
			};
			root.addEventListener('scrollend', handleScrollEnd);
		} else {
			setTimeout(() => this.setupActiveSectionTracking(), 500);
		}
	}

	private loadSections(): void {
		this.isLoading = true;
		this.loadError = false;

		this.contentService.getSections().subscribe({
			next: (sections) => {
				this.sections = sections;
				this.isLoading = false;
				// Workaround for a known Angular 22 regression (NgModule apps with
				// standalone: false components lose automatic zone-triggered change
				// detection - see angular/angular#69530). Force a render explicitly
				// rather than relying on zone.js to notice this async update.
				this.cdr.detectChanges();
				// Wait a tick for the panels to render into the DOM before observing them.
				setTimeout(() => this.setupActiveSectionTracking(), 0);
			},
			error: () => {
				this.isLoading = false;
				this.loadError = true;
				this.cdr.detectChanges();
			}
		});
	}

	private setupActiveSectionTracking(): void {
		this.intersectionObserver?.disconnect();
		this.sectionVisibility = {};

		const root = this.contentColumnRef?.nativeElement;
		if (!root || this.sections.length === 0) {
			return;
		}
		
		this.intersectionObserver = new IntersectionObserver(
			(entries) => {
				// entries only contains sections whose visibility just crossed a
				// threshold since the last callback - NOT every currently-visible
				// section. Update just those entries on the existing map rather
				// than replacing the whole thing, or already-visible sections that
				// didn't change this time around get wrongly dropped.
				
				const updated = { ...this.sectionVisibility };
				for (const entry of entries) {
					updated[entry.target.id] = entry.isIntersecting;
				}
				this.sectionVisibility = updated;
				this.cdr.detectChanges();
			},
			{
				root,
				threshold: [0.25, 0.5, 0.75]
			}
		);

		this.sections.forEach((section) => {
			if (!section.id) // Dividers are sections but have no id and shouldn't be observed anyway.
				return;
			
			const el = document.getElementById(section.id);

			if (el) 
				this.intersectionObserver?.observe(el);
			
		});
	}
}