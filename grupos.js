/* grupos.js - carga CSV de grupos usando PapaParse */
async function cargarGrupos() {
    // Cargar PapaParse desde CDN si no existe
    if (!window.Papa) {
        await new Promise(resolve => {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    //const url = "grupos.csv";
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkneeX1i0L31vjRvWlSYpDhzng_pjm8nTK0z52FMptoMAgo7Ed_FbQ6VxR9Dm-J3Hf0xxShkNuVLvW/pub?gid=781867427&single=true&output=csv";

    Papa.parse(url, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const datos = results.data.map(e => ({
                Grupo: e.Grupo,
                Numero: e.Número,
                Equipo: e.Equipo,
                PJ: Number(e.PJ),
                V: Number(e.V),
                E: Number(e.E),
                D: Number(e.D),
                GF: Number(e.GF),
                GC: Number(e.GC),
                DG: Number(e.DG),
                PTS: Number(e.PTS)
            }));

            pintarGrupo("A", datos);
            pintarGrupo("B", datos);
            pintarGrupo("C", datos);
        }
    });
}

function pintarGrupo(letra, datos) {
    const tabla = document.querySelector(`#grupo${letra} tbody`);
    if (!tabla) return;

    tabla.innerHTML = "";

    datos
        .filter(e => e.Grupo === letra)
        .sort((a, b) =>
            b.PTS - a.PTS ||
            b.DG - a.DG ||
            b.GF - a.GF
        )
        .forEach(e => {
            const fila = `
                <tr>
                    <td class="team">${e.Equipo}</td>
                    <td class="center">${e.PJ}</td>
                    <td class="center">${e.V}</td>
                    <td class="center">${e.E}</td>
                    <td class="center">${e.D}</td>
                    <td class="center">${e.GF}</td>
                    <td class="center">${e.GC}</td>
                    <td class="center">${e.DG}</td>
                    <td class="pts">${e.PTS}</td>
                </tr>
            `;
            tabla.insertAdjacentHTML("beforeend", fila);
        });
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarGrupos);