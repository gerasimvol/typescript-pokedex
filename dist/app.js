"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var domContainer = document.querySelector('#app');
var pokemons = [];
pokemons = new Proxy(pokemons, {
    set: function (target, property, value, receiver) {
        renderPokemon(value);
        return true;
    }
});
var fetchPokemons = (function () {
    var startFrom = 1;
    var currentPage = 1;
    var perPage = 10;
    return function () {
        for (var i = startFrom; i <= currentPage * perPage; i++) {
            fetchPokemon(i);
        }
        startFrom = currentPage * perPage + 1;
        currentPage++;
    };
})();
function fetchPokemon(id) {
    return __awaiter(this, void 0, void 0, function () {
        var data, pokemonRaw, pokemon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://pokeapi.co/api/v2/pokemon/" + id)];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, data.json()];
                case 2:
                    pokemonRaw = _a.sent();
                    pokemon = {
                        id: pokemonRaw.id,
                        name: pokemonRaw.name,
                        image: "" + pokemonRaw.sprites.front_default,
                        type: pokemonRaw.types.map(function (poke) { return poke.type.name; }).join(", "),
                    };
                    pokemons[pokemon.id - 1] = pokemon;
                    return [2 /*return*/];
            }
        });
    });
}
function renderPokemon(pokemon) {
    // find place to insert new card
    var pokemonIds = Array.from(document.querySelectorAll('.card')).map(function (el) { return Number(el.dataset.id); });
    var prevPokemonId = pokemonIds.sort(function (a, b) { return b - a; }).find(function (e) { return e <= Number(pokemon.id); });
    // create card DOM node
    var pokemonNode = document.createElement('div', {});
    pokemonNode.classList.add('card');
    pokemonNode.dataset.id = pokemon.id;
    pokemonNode.innerHTML = "\n    <h4 class=\"card__id\">#" + pokemon.id + "</h4>\n    <img class=\"card__image\" src=" + pokemon.image + " alt=" + pokemon.name + " />\n    <h5 class=\"card__name\">" + pokemon.name + "</h5>\n    <h6 class=\"card__details\">" + pokemon.type + "</h6>\n  ";
    // insert card into DOM
    if (!prevPokemonId) {
        domContainer.prepend(pokemonNode);
    }
    else {
        var prevPokemon = document.querySelector(".card[data-id=\"" + prevPokemonId + "\"]");
        prevPokemon.after(pokemonNode);
    }
}
function runApp() {
    // load first pack
    fetchPokemons();
    // subscribe for lazy loading
    var loadMoreTrigger = document.querySelector('.loadMoreTrigger');
    var loadMoreObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                fetchPokemons();
            }
        });
    }, {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    });
    loadMoreObserver.observe(loadMoreTrigger);
}
runApp();
