import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    imports: [CommonModule],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
    isFixed: boolean = false;
    isMenuOpen = false;

    constructor(
        private router: Router,
    ) {}

    ngOnInit(): void {
        // If we are on the result page, we don't want the header to be fixed
        this.router.events.pipe(
            map(() => this.router.url === '/result')
        ).subscribe(isResult => {
            this.isFixed = !isResult;
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (window.innerWidth >= 768) { // md breakpoint
            this.isMenuOpen = false;
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu() {
        this.isMenuOpen = false;
    }
}
