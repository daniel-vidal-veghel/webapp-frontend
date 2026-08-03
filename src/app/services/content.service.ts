import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContentSection } from '../models/content-section.model';

/**
Fetches the current section list from the .NET backend.
Constructor is gone because it uses new pattern (injects)
*/
@Service()
export class ContentService {
	private readonly baseUrl = `${environment.apiBaseUrl}/content`;
	private readonly http = inject(HttpClient);
	
	getSections(): Observable<ContentSection[]> {
		return this.http.get<ContentSection[]>(this.baseUrl);
	}
}
