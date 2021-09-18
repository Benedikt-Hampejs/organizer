import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import{trigger,style, animate, state, transition, AnimationBuilder, AnimationPlayer, AnimationMetadata}from'@angular/animations'


@Directive({
  selector: '[alert-directive]' 
})
export class AnimateAlertDirective implements OnInit {



  constructor(private builder: AnimationBuilder, private el: ElementRef) {}

  ngOnInit(): void {
    this.playAnimation(this.fadeIn);
    setTimeout(() => {
      this.playAnimation(this.fadeOut);
    }, 2400);
  }

  private playAnimation(callback: () => AnimationMetadata[]) {

    const factory = this.builder.build(callback());
    const player = factory.create(this.el.nativeElement);

    player.play();
  }

  private fadeIn(): AnimationMetadata[] {
    return [
      style({ opacity: 0 }),
      animate('400ms ease-in', style({ opacity: 1 })),
    ];
  }

  private fadeOut(): AnimationMetadata[] {
    return [
      style({ opacity: '*' }),
      animate('400ms ease-in', style({ opacity: 0 })),
    ];
  }

}
