import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

    public articles: any[] = [];
    public search: string;
    public showNoData: boolean = false;
    public showProgress: boolean = false;

    searchTextChanged = new Subject<string>();

    constructor(private newsService: NewsService,
        private router: Router) { }

    public ngOnInit() {
        this.fetchArticles();
        this.searchTextChanged.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(search => this.getValues(search))
        ).subscribe();
    }

    private fetchArticles(search?: string): void {
        this.newsService.getArticles(search).subscribe(
            data => {
                this.articles = data.articles;
                if (!data.articles.length) {
                    this.showNoData = true;
                } else {
                    this.showNoData = false;
                }
                this.showProgress = false;
            }
        );
    }

    getValues(search) {
        this.showProgress = true;
        this.fetchArticles(search);
    }

    getSearchData() {
        this.searchTextChanged.next(this.search);
    }

    goToDetails(article) {
        sessionStorage.setItem('article', JSON.stringify(article));
        this.router.navigate(['article'], { state: article });
    }

}
