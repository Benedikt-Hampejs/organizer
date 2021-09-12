import { trigger, query, style, transition, animate, animateChild, group } from '@angular/animations';

export const slider =
trigger('routeAnimations', [
  transition('left => right', slide(false)),
  transition('right => left', slide(true)),
]);

function slide(leftToRight: boolean) {
  const optional = { optional: true };
  const enterFrom = leftToRight ? -100 : 100
  const leaveTo = leftToRight ? 100 : -100
  return [
    // Set a default  style for enter and leave
    // Animate the new page in
    group([query(':enter', [
      style({
        position: 'fixed',
        left: '220px',
        height: '100%',
        width: 'calc(100% - 250px)',
        transform: 'translateX(' + enterFrom + '%)'
      })
    ], optional),
    query(':leave', [
      style({
        transform: 'translateX(0%)'
      })
    ], optional),]),
    group([
      query(':enter', [
        animate('200ms ease', style({ transform: 'translateX(0%)' })),
      ], optional),
      query(':leave', [
        animate('200ms ease', style({ transform: 'translateX(' + leaveTo + '%)' })),
      ], optional)
    ]),
  ];
}

