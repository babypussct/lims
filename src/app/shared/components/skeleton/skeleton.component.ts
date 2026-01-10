
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse bg-slate-200 rounded relative overflow-hidden" 
         [class.rounded-full]="shape() === 'circle'"
         [class.rounded-lg]="shape() === 'rect'"
         [class.rounded-md]="shape() === 'text'"
         [style.width]="width()" 
         [style.height]="height()">
         <!-- Shimmer effect -->
         <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"></div>
    </div>
  `,
  styles: [`
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `]
})
export class SkeletonComponent {
  width = input<string>('100%');
  height = input<string>('1rem');
  shape = input<'text' | 'circle' | 'rect'>('text');
}
