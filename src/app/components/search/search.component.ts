import { Component, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faCloud, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Deck } from '../../classes/Deck';
import { DeckRepositoryService } from '../../services/deck-repository/deck-repository.service';
import { IDeckRepository } from '../../interfaces/IDeckRepository';
import { RouterModule, Router } from '@angular/router';
import { CurrentStateService } from '../../services/current-state/current-state.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  private deckRepository!: IDeckRepository
  private applicationState!: CurrentStateService

  editIcon!: IconDefinition
  deleteIcon!: IconDefinition
  publicIcon!: IconDefinition
  privateDecks!: Deck[]
  onlineDecks!: Deck[]
  showPrivateDecks!: boolean

  constructor(private injector: Injector, private router: Router) {
    this.deckRepository = this.injector.get<IDeckRepository>(DeckRepositoryService);
    this.applicationState = this.injector.get(CurrentStateService);
  }

  async ngOnInit(): Promise<void> {
    this.editIcon = faPen
    this.deleteIcon = faTrash
    this.publicIcon = faCloud
    this.showPrivateDecks = true

    await Promise.all([
      this.getPrivateDecks(),
      this.getOnlineDecks()
    ])
  }

  private async getPrivateDecks(): Promise<void> {
    //tu zmienić, wziąć skądś aktualnie zalogowanego użytkownika
    this.privateDecks = await this.deckRepository.getPrivateDecks(1)
  }

  private async getOnlineDecks(): Promise<void> {
    this.onlineDecks = await this.deckRepository.getOnlineDecks()
  }

  public logout(): void {
    this.applicationState.removeCurrentUser();
    this.router.navigate(['/login']);
  }
}