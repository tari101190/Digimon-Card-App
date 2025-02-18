import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {englishCards} from "../../../../assets/cardlists/eng/english";
import {ICard} from "../../../../models";
import {changeCardCount, setViewCardDialog} from "../../../store/digimon.actions";
import {selectCardSize, selectCollectionMinimum, selectDeck} from "../../../store/digimon.selectors";

@Component({
  selector: 'digimon-full-card',
  templateUrl: './full-card.component.html',
  styleUrls: ['./full-card.component.scss']
})
export class FullCardComponent implements OnInit, OnDestroy {
  @Input() card: ICard = englishCards[0];
  @Input() count: number;

  @Input() width?: string;
  @Input() compact?: boolean = false;
  @Input() collectionMode?: boolean = false;
  @Input() deckBuilder?: boolean = false;
  @Input() biggerCards?: boolean = false;

  viewCardDialog = false;

  faPlus = faPlus;
  faMinus = faMinus;

  cardWidth = 7 + 'vmin';
  cardBorder = '2px solid black';
  cardRadius = '5px'

  aa = new Map<string, string>([
    ['Red', 'assets/images/banner/ico_card_detail_red.png'],
    ['Blue', 'assets/images/banner/ico_card_detail_blue.png'],
    ['Yellow', 'assets/images/banner/ico_card_detail_yellow.png'],
    ['Green', 'assets/images/banner/ico_card_detail_green.png'],
    ['Black', 'assets/images/banner/ico_card_detail_black.png'],
    ['Purple', 'assets/images/banner/ico_card_detail_purple.png'],
    ['White', 'assets/images/banner/ico_card_detail_white.png'],
    ['Multi', 'assets/images/banner/ico_card_detail_multi.png'],
  ]);

  collectionMinimum = 0;

  countInDeck = 0;

  private onDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(selectCardSize).pipe(takeUntil(this.onDestroy$))
      .subscribe(cardSize => this.setCardSize(cardSize));
    this.store.select(selectCollectionMinimum).pipe(takeUntil(this.onDestroy$))
      .subscribe(minimum => this.collectionMinimum = minimum);
    this.store.select(selectDeck).pipe(takeUntil(this.onDestroy$))
      .subscribe(deck => this.countInDeck = deck.cards.find(value => value.id === this.card.id)?.count ?? 0);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }

  changeCardCount(event: any, id: string) {
    const count = event.value;
    this.store.dispatch(changeCardCount({id, count}))
  }

  setCardSize(size: number) {
    if(this.biggerCards) {
      this.cardWidth = '20vw';
      return;
    }
    if(this.deckBuilder) {
      this.cardWidth = '5vw';
      return;
    }
    if(this.compact) {
      this.cardWidth = this.rangeToRange(100) + 'vmin'
      return;
    }
    this.cardWidth = this.rangeToRange(size) + 'vmin';
  }

  rangeToRange = (input: number) => {
    //(((OldValue - OldMin) * NewRange) / OldRange) + NewMin
    return (input - 5) * (30 - 20) / (100 - 5) + 20;
  }

  showCardDetails() {
    if(this.deckBuilder) {return;}
    this.store.dispatch(setViewCardDialog({show: true, card: this.card}));
  }
}
