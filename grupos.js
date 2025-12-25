
async function cargarGrupos() {
    try {

        if (!window.Papa) {
            await new Promise(resolve => {
                const script = document.createElement('script');
                script.src = "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
                script.onload = resolve;
                script.onerror = () => {
                    console.error("Error al cargar PapaParse desde CDN.");
                    resolve();
                };
                document.head.appendChild(script);
            });
            if (!window.Papa) {
                console.error("PapaParse no está disponible después de intentar cargarlo.");
                return;
            }
        }


        const urlGoogleSheets = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkneeX1i0L31vjRvWlSYpDhzng_pjm8nTK0z52FMptoMAgo7Ed_FbQ6VxR9Dm-J3Hf0xxShkNuVLvW/pub?gid=781867427&single=true&output=csv";

        let csvData = null;

        try {
            csvData = await fetchCsv(urlGoogleSheets);
        } catch (error) {
            console.warn("No se pudo cargar CSV desde Google Sheets. Error:", error);
        }

        const parseResult = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            delimiter: "",
        });

        if (parseResult.errors.length > 0) {
            console.error("Errores al parsear CSV:", parseResult.errors);
            return;
        }

        const datos = parseResult.data.map(e => ({
            Grupo: e.Grupo,
            Numero: e.Número || e.Numero,
            Equipo: e.Equipo,
            PJ: Number(e.PJ) || 0,
            V: Number(e.V) || 0,
            E: Number(e.E) || 0,
            D: Number(e.D) || 0,
            GF: Number(e.GF) || 0,
            GC: Number(e.GC) || 0,
            DG: Number(e.DG) || 0,
            PTS: Number(e.PTS) || 0
        }));

        pintarGrupo("A", datos);
        pintarGrupo("B", datos);
        pintarGrupo("C", datos);

    } catch (error) {
        console.error("Error inesperado en cargarGrupos:", error);
    }
}

async function fetchCsv(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error al cargar CSV desde ${url}, status: ${response.status}`);
    }
    return await response.text();
}

function pintarGrupo(letra, datos) {
    const tabla = document.querySelector(`#grupo${letra} tbody`);
    if (!tabla) {
        console.warn(`No se encontró la tabla para el grupo ${letra}`);
        return;
    }

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

document.addEventListener("DOMContentLoaded", () => {
    cargarGrupos();

    setInterval(cargarGrupos, 10000);
});