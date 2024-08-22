"use strict";

const api = "https://rickandmortyapi.com/api/character";
let personajes = [];

const contenedorDer = document.querySelector(".contenedorDer");
let contenedorDerContenido = contenedorDer.innerHTML; // Almacena el contenido original

async function consumirApi() {
    try {
        const response = await fetch(api);
        const data = await response.json();
        personajes = data.results;

        // Agregar una tarjeta personalizada
        const gonzagiaco = {
            name: "Gonzalo Giacomino",
            location: { name: "Tandil, Buenos Aires, Argentina" },
            origin: { name: "Earth" },
            species: "Human",
            gender: "Male",
            image: "gonza.png",
            status: "Alive"
        };
        personajes.push(gonzagiaco);
        tarjetasDinamicas(personajes);
    } catch (error) {
        console.error("Error al consumir API: ", error);
    }
}

function tarjetasDinamicas(personajes) {
    const contenedor = document.querySelector(".slider");
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de añadir nuevos bloques de tarjetas

    // Agrupar las tarjetas en bloques de 9
    const bloques = [];
    for (let i = 0; i < personajes.length; i += 9) {
        const bloque = personajes.slice(i, i + 9);
        bloques.push(bloque);
    }

    bloques.forEach(bloque => {
        const contenedorBloque = document.createElement("div");
        contenedorBloque.classList.add("contenedorTarjetas");

        bloque.forEach(personaje => {
            const { name, location, origin, species, gender, image, status } = personaje;

            // Crear la imagen del personaje
            const imagen = document.createElement("img");
            imagen.src = image;
            imagen.alt = name;
            imagen.classList.add("character-img");

            // Crear el contenedor de la información adicional
            const infoAdicional = document.createElement("div");
            infoAdicional.classList.add("info-adicional");

            // Crear el contenido adicional
            const contenidoAdicional = document.createElement("div");
            contenidoAdicional.classList.add("info-adicional-content");
            contenidoAdicional.innerHTML = `
                <div class="titulo-personaje">
                    <h2>${name} <span class="estado-punto">${status} | <span class="punto ${status === 'Alive' ? 'verde' : 'rojo'}"></span></span></h2>
                </div>
                <p><strong>Especie:</strong> ${species}</p>
                <p><strong>Género:</strong> ${gender}</p>
                <p><strong>Origen:</strong> ${origin.name}</p>
                <p><strong>Ubicación:</strong> ${location.name}</p>
            `;
            const contenedorImagenAdicional = document.createElement("div");
            contenedorImagenAdicional.classList.add("contenedorImagenAdicional");
            contenedorImagenAdicional.innerHTML = `
            <img src="${image}" alt="${name}" class="character-img-adicional">
            `

            infoAdicional.appendChild(contenidoAdicional);
            infoAdicional.appendChild(contenedorImagenAdicional);
            // Crear la tarjeta
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");

            // Añadir la imagen y la información adicional a la tarjeta
            tarjeta.appendChild(imagen);
            tarjeta.appendChild(infoAdicional);

            // Evento para mostrar la información adicional en contenedorDer al pasar el mouse
            tarjeta.addEventListener('mouseover', () => {
                const contenedorDer = document.querySelector('.contenedorDer');
                contenedorDer.innerHTML = '';
                contenedorDer.appendChild(infoAdicional.cloneNode(true));
            });

            // Evento para restaurar el contenido original al quitar el mouse
            tarjeta.addEventListener('mouseout', () => {
                const contenedorDer = document.querySelector('.contenedorDer');
                contenedorDer.innerHTML = contenedorDerContenido; // Restaurar contenido original
            });

            // Añadir la tarjeta al contenedor del bloque
            contenedorBloque.appendChild(tarjeta);
        });

        // Añadir el bloque al slider
        contenedor.appendChild(contenedorBloque);
    });

    manejarControlesSlider(bloques.length);
}

function manejarControlesSlider(totalBloques) {
    let currentIndex = 0;
    const contenedor = document.querySelector(".slider");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    function showBlock(index) {
        const translateX = -index * 100;
        contenedor.style.transform = `translateX(${translateX}%)`;
    }

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalBloques;
        showBlock(currentIndex);
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalBloques) % totalBloques;
        showBlock(currentIndex);
    });

    // Mostrar el primer bloque por defecto
    showBlock(currentIndex);
}

function filtrarResultados(filtro) {
    const resultadosFiltrados = personajes.filter(personaje => {
        const valorFiltro = filtro.toLowerCase();
        switch (criterioBusqueda) {
            case 'name':
                return personaje.name.toLowerCase().includes(valorFiltro);
            case 'origin':
                return personaje.origin.name.toLowerCase().includes(valorFiltro);
            case 'location':
                return personaje.location.name.toLowerCase().includes(valorFiltro);
            default:
                return false;
        }
    });
    tarjetasDinamicas(resultadosFiltrados);
}

document.addEventListener("DOMContentLoaded", () => {
    consumirApi();


    document.querySelector(".input-buscar").addEventListener("input", (event) => {
        const valorBusqueda = event.target.value;
        filtrarResultados(valorBusqueda);
    });

   
});
