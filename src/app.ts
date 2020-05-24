const domContainer: HTMLElement | any = document.querySelector('#app')
const loadMoreTrigger: HTMLElement | any = document.querySelector('.loadMoreTrigger')

interface IPokemon {
  id: number;
  name: string;
  image: string;
  type: string;
}

let pokemons: Array<IPokemon> = []
pokemons = new Proxy(pokemons, {
  set (target, property, value, receiver) {
    renderPokemon(value)
    return true
  }
})

const fetchPokemons = (function (){
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

function renderPokemon(pokemon:IPokemon): void {
  const prevPokemon = document.querySelector(`.card[data-id="${pokemon.id - 1}"]`)
  let pokemonNode: HTMLElement | any = document.createElement('div', {  })
  pokemonNode.classList.add('card')
  pokemonNode.dataset.id = pokemon.id
  pokemonNode.innerHTML = `
    <h4>#${pokemon.id}</h4>
    <img class="card--image" src=${pokemon.image} alt=${pokemon.name} />
    <h5 class="card--name">${pokemon.name}</h5>
    <h6 class="card--details">${pokemon.type}</h6>
  `

  if (!prevPokemon) {
    domContainer.appendChild(pokemonNode)
  } else {
    prevPokemon.after(pokemonNode)
  }
}

function runApp(): void {
  fetchPokemons()
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