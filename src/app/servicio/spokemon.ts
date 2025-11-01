import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { IPokemon } from '../interfaces/ipokemon';

@Injectable({
  providedIn: 'root'
})
export class SPokemon {
  private readonly URL_BASE = 'https://pokeapi.co/api/v2/pokemon';
  private nextUrl = `${this.URL_BASE}?limit=20&offset=0`;


getPokemons(){
 if (this.nextUrl) {
  return CapacitorHttp.get({ url: this.nextUrl, params: {} })
    .then(async (response: HttpResponse) => {
      console.log("La respuesta es: ");
      console.log(response);
      const pokemons: IPokemon[] = [];

      // Confirma si tiene al atributo data
      if (response.data) {
        const result: [] = response.data.results; // almacena el arreglo de pokemons
        this.nextUrl = response.data.next; // almacena el url para el siguiente grupo
        const promises: Promise<HttpResponse>[] = []; // Se crea un arreglo de promesas

        result.forEach((result: any) => { // se itera sobre cada elemento
          const urlPokemon = result.url; // se almacena la url de inf. del pokemon
          // Se crea una promesa para cada elemento y se almacena en el arreglo de promesas
          promises.push(CapacitorHttp.get({ url: urlPokemon, params: {} }));
        });
        await Promise.all(promises).then((responses: any) => {
          const arrayResponses:[] = responses;

          arrayResponses.forEach( (respoPokemon:any)=>{
            const pokemon = this.processPokemon( respoPokemon.data );
            pokemons.push(pokemon);
          });
        })
      }
      return pokemons;
    
    });
}
return null;
}
  private processPokemon( pokemonData: any ) {
    const pokemon: IPokemon = {
      id: pokemonData.id,
      name: pokemonData.name,
      type1: pokemonData.types[0]?.type?.name,
      sprite: pokemonData.sprites.front_default,
      height: (pokemonData.height/10).toString(),
      weight: (pokemonData.weight/10).toString(),
      stats: pokemonData.stats.map( (stat: any) => {
        return {
          name: stat.stat.name,
          value: stat.base_stat
        }
    }),
    abilities: pokemonData.abilities
      .filter( (ability: any) => !ability.is_hidden )
      .map( (ability: any) => ability.ability.name )
  };

  if(pokemonData.types[1]){
  pokemon.type2 = pokemonData.types[1].type.name;
}

const hiddenAbility = pokemonData.abilities
  .find((ability: any) => ability.is_hidden);

if(hiddenAbility){
  pokemon.hiddenAbility = hiddenAbility.ability.name;
}
return pokemon;
}

getPokemon(id: number): Promise<IPokemon> {
  const ruta = `${this.URL_BASE}/${id}`;
  return CapacitorHttp.get({ url: ruta, params: {} })
    .then((response: HttpResponse) => {
      return this.processPokemon(response.data);
    });
}

}