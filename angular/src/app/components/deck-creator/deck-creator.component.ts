import { Component, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CurrentStateService } from '../../services/current-state/current-state.service';
import { Deck, EditDeckDTO } from '../../classes/Deck';
import { IDeckRepository } from '../../interfaces/IDeckRepository';
import { DeckRepositoryService } from '../../services/deck-repository/deck-repository.service';
import { AddFlashcardDTO, Flashcard, FlashcardAnswer, FlashcardTrueFalse } from '../../classes/Flashcard';
import { MatDialog } from '@angular/material/dialog';
import { AddFlashcardFormComponent } from '../../modules/add-flashcard-form/add-flashcard-form.component';
import { EditDeckFormComponent } from '../../modules/edit-deck-form/edit-deck-form.component';
import { TestGeneratorService } from '../../services/test-generator/test-generator.service';

@Component({
  selector: 'app-deck-creator',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    EditDeckFormComponent
  ],
  templateUrl: './deck-creator.component.html',
  styleUrl: './deck-creator.component.css'
})
export class DeckCreatorComponent implements OnInit {
  private deckRepository!: IDeckRepository
  private applicationState!: CurrentStateService
  private testGenerator!: TestGeneratorService

  deck!: Deck | undefined
  editIcon!: IconDefinition
  deleteIcon!: IconDefinition
  isEditDeckDialog!: boolean

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private injector: Injector,
    private dialog: MatDialog
  ) {
    this.deckRepository = this.injector.get<IDeckRepository>(DeckRepositoryService);
    this.applicationState = this.injector.get(CurrentStateService);
    this.testGenerator = this.injector.get(TestGeneratorService);
  }

  ngOnInit(): void {
    console.log(this.applicationState.getCurrentUser())
    if (this.applicationState.getCurrentUser() == null)
      return this.logout()

    this.editIcon = faPen
    this.deleteIcon = faTrash

    const routeParams = this.route.snapshot.paramMap
    const deckId = Number(routeParams.get("deckId"));
    this.getDeck(deckId)

    this.isEditDeckDialog = false
  }

  private getDeck(deckId: number): void {
    this.deckRepository.getDeck(deckId).subscribe((deck: Deck) => { this.deck = deck })
  }

  public showEditDeckDialog(): void {
    this.isEditDeckDialog = true
  }

  public editDeck(editDeckDTO: EditDeckDTO): void {
    if (this.deck == undefined) return
    const id = this.deck.id
    this.isEditDeckDialog = false
    this.deckRepository.editDeck(id, editDeckDTO).subscribe(() => this.getDeck(id))
  }

  public addFlashcard(): void {
    if (this.deck == undefined) return
    const id = this.deck.id
    const dialogRef = this.dialog.open(AddFlashcardFormComponent);
    dialogRef.componentInstance.flashcardCreated.subscribe((addFlashcardDTO: AddFlashcardDTO) => {
      this.deckRepository.addFlashcard(id, addFlashcardDTO).subscribe(() => this.getDeck(id))
    })
    dialogRef.afterClosed().subscribe(async result => {
      console.log("AddFlashcard dialog has been closed");
    })
  }

  public async deleteFlashcard(flashcard: Flashcard): Promise<void> {
    if (this.deck == undefined) return
    const id = this.deck.id
    this.deckRepository.deleteFlashcard(id, flashcard.id).subscribe(() => this.getDeck(id))
  }

  public shareDeck() {
    if (this.deck == undefined) return
    this.deck.isPublic = !this.deck.isPublic
  }

  public goToTest(): void {
    this.router.navigate(['/test', this.deck?.id]);
  }

  public goToReview(): void {
    this.router.navigate(['/review', this.deck?.id]);
  }

  public logout(): void {
    this.applicationState.removeCurrentUser();
    this.router.navigate(['/login']);
  }
}