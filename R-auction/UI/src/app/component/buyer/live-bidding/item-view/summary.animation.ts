import { trigger, transition, style, query, animateChild, group, animate, state } from '@angular/animations';
export const summaryAnimations = trigger('summaryAnimations', [
    transition('* => up', [
        style({ transform: `translateY({{index}}px)` }),
        animate('600ms ease-out', style({ transform:  'translateY(0px)' })),
    ], {params : { index: '0' }}),
    transition('* => down', [
        style({ transform: `translateY({{index}}px)` }),
        animate('600ms ease-out', style({ transform:  'translateY(0px)' })),
    ], {params : { index: '0' }}),
    transition('* => afterTableLoad', [        
        style({ opacity: 0}),
        // style({ transform: 'translateY(50px)', opacity: 0 }),
        // animate('{{index}}')
        animate(`{{index}} ease-out`, style({opacity: 1})),
    ], {params : { index: '200ms' }})
])