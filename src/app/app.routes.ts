import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-pokemons',
    pathMatch: 'full',
  },
  {
    path: 'list-pokemons',
    loadComponent: () => import('./pages/list-pokemons/list-pokemons.page').then( m => m.ListPokemonsPage)
  },
  {
    path: 'pokemon-details/:id',
    loadComponent: () => import('./pages/pokemon-details/pokemon-details.page').then( m => m.PokemonDetailsPage)
  }
];
