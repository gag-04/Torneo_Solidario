async function cargarPartidos() {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkneeX1i0L31vjRvWlSYpDhzng_pjm8nTK0z52FMptoMAgo7Ed_FbQ6VxR9Dm-J3Hf0xxShkNuVLvW/pub?gid=1231036718&single=true&output=csv";

    Papa.parse(url, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const partidos = results.data.filter(p => p.Fase === "Fase de Grupos");
            pintarPartidos(partidos);
        }
    });
}

function pintarPartidos(partidos) {
    const contenedor = document.getElementById("partidos");
    contenedor.innerHTML = "";

    // Agrupar por jornada
    const jornadas = {};

    partidos.forEach(p => {
        if (!jornadas[p.Jornada]) jornadas[p.Jornada] = [];
        jornadas[p.Jornada].push(p);
    });

    Object.keys(jornadas).sort().forEach(jornada => {
        const titulo = document.createElement("div");
        titulo.className = "match-info";
        titulo.textContent = `Jornada ${jornada}`;
        contenedor.appendChild(titulo);

        jornadas[jornada].forEach(p => {
            const marcador =
                p.GolesL && p.GolesV
                    ? `${p.GolesL} - ${p.GolesV}`
                    : "-";

            const div = document.createElement("div");
            div.className = "match-card";
            div.innerHTML = `
                <span>${p.Local}</span>
                <span class="score">${marcador}</span>
                <span>${p.Visitante}</span>
            `;
            contenedor.appendChild(div);
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    cargarPartidos();
});