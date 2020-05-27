const domContainer: HTMLElement | null = document.querySelector('#app')

interface IPokemon {
  id: number;
  name: string;
  image: string;
  type: string;
}

let pokemons: Array<IPokemon> = []
pokemons = new Proxy(pokemons, {
  set(target, property, value, receiver) {
    renderPokemon(value)
    return true
  }
})

const fetchPokemons = (function () {
  let startFrom = 1
  let currentPage = 1
  const perPage = 10

  return function () {
    for (let i = startFrom; i <= currentPage * perPage; i++) {
      fetchPokemon(i)
    }
    startFrom = currentPage * perPage + 1
    currentPage++
  }
})()

async function fetchPokemon(id: number): Promise<void> {
  const data: Response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  const pokemonRaw: any = await data.json()
  const pokemon: IPokemon = {
    id: pokemonRaw.id,
    name: pokemonRaw.name,
    image: `${pokemonRaw.sprites.front_default}`,
    type: pokemonRaw.types.map((poke: any) => poke.type.name).join(", "),
  }

  pokemons[pokemon.id - 1] = pokemon
}

function renderPokemon(pokemon: IPokemon): void {
  // find place to insert new card
  const pokemonIds: Array<number> = Array.from(document.querySelectorAll('.card')).map(el => Number(el.dataset.id))
  const prevPokemonId: number = pokemonIds.sort((a,b) => b - a).find(e => e <= Number(pokemon.id))

  // create card DOM node
  let pokemonNode: HTMLElement | any = document.createElement('div', {})
  pokemonNode.classList.add('card')
  pokemonNode.dataset.id = pokemon.id
  pokemonNode.innerHTML = `
    <h4 class="card__id">#${pokemon.id}</h4>
    <img class="card__image" src=${pokemon.image} alt=${pokemon.name} />
    <h5 class="card__name">${pokemon.name}</h5>
    <h6 class="card__details">${pokemon.type}</h6>
  `

  // insert card into DOM
  if (!prevPokemonId) {
    domContainer.prepend(pokemonNode)
  } else {
    const prevPokemon = document.querySelector(`.card[data-id="${prevPokemonId}"]`)
    prevPokemon.after(pokemonNode)
  }
}

function runApp(): void {
  // load first pack
  fetchPokemons()

  // subscribe for lazy loading
  const loadMoreTrigger: HTMLElement | null = document.querySelector('.loadMoreTrigger')
  const loadMoreObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fetchPokemons()
      }
    });
  }, {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  });
  loadMoreObserver.observe(loadMoreTrigger);
}

runApp()