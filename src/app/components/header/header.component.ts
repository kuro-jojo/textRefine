import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterLink],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    isMenuOpen = false;

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
