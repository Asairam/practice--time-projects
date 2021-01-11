import { trigger, transition, style, query, animateChild, group, animate, state } from '@angular/animations';
export const reportAnimation = trigger('routeAnimations', [
    transition('* => Reports', [
        style({ opacity: 0 }),
        animate('1000ms ease-out', style({ opacity: 1 })),
    ]),
    transition('* => afterTableLoad', [        
        style({ opacity: 0}),
        // style({ transform: 'translateY(50px)', opacity: 0 }),
        // animate('{{index}}')
        animate(`{{index}} ease-out`, style({opacity: 1})),
    ], {params : { index: '200ms' }})
])
