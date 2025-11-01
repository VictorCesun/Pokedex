import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonImg, IonText, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { CapacitorConfig } from '@capacitor/cli';
import { SPokemon } from 'src/app/servicio/spokemon';
import { IPokemon } from 'src/app/interfaces/ipokemon';
import { JsonPipe } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, JsonPipe, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonImg, IonText, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class ListPokemonsPage {

  private pokemonService: SPokemon = inject(SPokemon);
  private loadingController: LoadingController = inject(LoadingController);
  private router: Router = inject(Router);
  pokemons: IPokemon[] = [];

  constructor() { }

  goToPage(pokemon: IPokemon) {
    this.router.navigate(['/pokemon-details', pokemon.id]);
  }

  ionViewWillEnter() {
    this.getMorePokemons();
  }

  async getMorePokemons(event?: CustomEvent) {
  const promisePokemons = this.pokemonService.getPokemons();

  if (promisePokemons) {
    const loading = await this.loadingController.create({
      message: 'Cargando Pokémons...'
    });

    await loading.present();

    promisePokemons
      .then((pokemons: IPokemon[]) => {
        this.pokemons = this.pokemons.concat(pokemons);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        loading.dismiss();

        // ✅ Solo intenta completar el infinite scroll si el evento existe
        if (event) {
          (event.target as HTMLIonInfiniteScrollElement).complete();
        }
      });
  }
}




}
