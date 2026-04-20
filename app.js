let data = [];

const app = document.getElementById("app");

function clearApp(){
    app.innerHTML = "";
}

function addButton(text, onClick){
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.innerText = text;
    btn.onclick = onClick;
    app.appendChild(btn);
}

function addBackButton(){
    const btn = document.createElement("button");
    btn.className = "back";
    btn.innerText = "⬅ Volver";
    btn.onclick = renderMenu;
    app.appendChild(btn);
}

fetch("AKC.xlsx")
.then(res => res.arrayBuffer())
.then(buffer => {
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(sheet);
    renderMenu();
});

function renderMenu(){
    clearApp();
    addButton("Fuerza", renderFuerza);
    addButton("Preventivos", renderPreventivos);
    addButton("Orientación", renderOrientacion);
    addButton("Reporte", renderReporte);
}

function renderFuerza(){
    clearApp();
    addBackButton();

    const semanas = [...new Set(data.filter(e=>e.Tipo==="Fuerza").map(e => e.Semana))].sort((a,b)=>a-b);

    semanas.forEach(sem => {
        addButton("Semana " + sem, () => {
            mostrarEjercicios(data.filter(e => e.Tipo==="Fuerza" && e.Semana===sem));
        });
    });
}

function renderPreventivos(){
    clearApp();
    addBackButton();
    addButton("Por semana", renderPreventivosSemanas);
    addButton("Por segmento", renderPreventivosSegmento);
}

function renderPreventivosSemanas(){
    clearApp();
    addBackButton();

    const semanas = [...new Set(data.filter(e=>e.Tipo==="Preventivo").map(e => e.Semana))].sort((a,b)=>a-b);

    semanas.forEach(sem => {
        addButton("Semana " + sem, () => {
            mostrarEjercicios(data.filter(e => e.Tipo==="Preventivo" && e.Semana===sem));
        });
    });
}

function renderPreventivosSegmento(){
    clearApp();
    addBackButton();

    const segmentos = [...new Set(data.filter(e=>e.Tipo==="Preventivo").map(e => e.Segmento).filter(e=>e))].sort();

    segmentos.forEach(seg => {
        addButton(seg, () => {
            mostrarEjercicios(data.filter(e => e.Tipo==="Preventivo" && e.Segmento===seg));
        });
    });
}

function renderOrientacion(){
    clearApp();
    addBackButton();
    addButton("Por semana", renderOrientacionSemanas);
    addButton("Por aparato", renderOrientacionAparato);
}

function renderOrientacionSemanas(){
    clearApp();
    addBackButton();

    const semanas = [...new Set(data.filter(e=>e.Tipo==="Orientación").map(e => e.Semana))].sort((a,b)=>a-b);

    semanas.forEach(sem => {
        addButton("Semana " + sem, () => {
            mostrarEjercicios(data.filter(e => e.Tipo==="Orientación" && e.Semana===sem));
        });
    });
}

function renderOrientacionAparato(){
    clearApp();
    addBackButton();

    const aparatos = [...new Set(data.filter(e=>e.Tipo==="Orientación").map(e => e.Aparato).filter(e=>e))].sort();

    aparatos.forEach(ap => {
        addButton(ap, () => {
            mostrarEjercicios(data.filter(e => e.Tipo==="Orientación" && e.Aparato===ap));
        });
    });
}

function mostrarEjercicios(lista){
    clearApp();
    addBackButton();

    lista.forEach(e => {
        const div = document.createElement("div");
        div.className = "card";

        const check = document.createElement("div");
        check.className = "check";
        check.innerText = "✔";
        check.onclick = () => check.classList.toggle("done");

        const btn = document.createElement("button");
        btn.className = "btn";
        btn.innerText = e.Nombre || "Ejercicio";
        btn.onclick = () => {
            clearApp();
            addBackButton();

            const iframe = document.createElement("iframe");
            iframe.className = "video";
            iframe.src = e.Link;
            app.appendChild(iframe);
        };

        div.appendChild(check);
        div.appendChild(btn);
        app.appendChild(div);
    });
}

function renderReporte(){
    clearApp();
    addBackButton();

    const atleta = localStorage.getItem("atleta") || "Sin atleta";

    const titulo = document.createElement("h3");
    titulo.innerText = "Reporte de: " + atleta;
    app.appendChild(titulo);

    const ejercicios = data.filter(e => e.Tipo==="Fuerza");

    ejercicios.forEach(e => {
        const div = document.createElement("div");
        div.className = "card";

        const check = document.createElement("div");
        check.className = "check";
        check.innerText = "✔";

        check.onclick = () => {
            check.classList.toggle("done");

            if(atleta){
                db.collection("reportes").add({
                    atleta,
                    ejercicio: e.Nombre,
                    fecha: new Date()
                });
            }
        };

        const txt = document.createElement("div");
        txt.innerText = e.Nombre;

        div.appendChild(check);
        div.appendChild(txt);
        app.appendChild(div);
    });
}
