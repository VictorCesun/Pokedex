import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonRow, IonImg, IonCol } from '@ionic/angular/standalone';
import { SPokemon } from 'src/app/servicio/spokemon';
import { IPokemon } from 'src/app/interfaces/ipokemon';
import { closeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.page.html',
  styleUrls: ['./pokemon-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, JsonPipe, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonRow, IonImg, IonCol]
})
export class PokemonDetailsPage {
  @Input() id!: number;
  private servicioPokemon : SPokemon = inject(SPokemon);
  private loadingCtroller: LoadingController = inject(LoadingController);
  private router: Router = inject(Router);
  pokemon!: IPokemon;

  constructor() {
    addIcons({
      closeOutline
  });
   }

  ionViewWillEnter() {
    console.log(`El id es: ${this.id}`);
    this.servicioPokemon.getPokemon(this.id)
    .then( (pokemon: IPokemon) => this.pokemon = pokemon );
  }

  goBack() {
    this.router.navigate(['/list-pokemons']);
  }

    formatStatName(name: string): string {
    return name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

}
