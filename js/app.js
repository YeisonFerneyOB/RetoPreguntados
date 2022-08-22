//variables de las preguntas aleatorias
let preguntas_aleatorias = true;
//mostrar el mddal de juego terminado 
let mostrar_pantalla_juego_términado = true;
//reiniciar los pubntos
let reiniciar_puntos_al_reiniciar_el_juego = true;




//ejecuta apenas se abre nuestra pagina
window.onload = function () {
  base_preguntas = readText("base-preguntas.json"); // todas las preguntas las leo con mi funcion sincrona
  interprete_bp = JSON.parse(base_preguntas); // nuestra base de preguntas
  escogerPreguntaAleatoria();
};

let pregunta;

let posibles_respuestas;
// boton a cada pregunta 
btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];
//arreglo donde guardo todas mis preguntas
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;


// elijo las preguntas de forma aleatorias con Math.floor
function escogerPreguntaAleatoria() {
 let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }

  //aqui realizo la suma de las preguntas correctas
  while (npreguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
    if (npreguntas.length == interprete_bp.length) {
      //Aquí es donde el juego se reinicia y uso la libreria
      if (mostrar_pantalla_juego_términado) {
        //sweetalert2.all.min.js libreria usada para mostrar el modal
        swal.fire({
          title: "Juego finalizado", //puntuacion en el modal con la libreria
          text:
          //suma de las preguntas correctas menos preguntas echas
            "Puntuación: " + preguntas_correctas + "/" + (preguntas_hechas - 1),
          icon: "success"
        });
      }
      if (reiniciar_puntos_al_reiniciar_el_juego) {
        preguntas_correctas = 0
        preguntas_hechas = 0
      }
      npreguntas = [];
    }
  }
  //le hago push de las respuestas en el html
  npreguntas.push(n);
//las preguntas ya hechas 
  preguntas_hechas++;

  escogerPregunta(n);
}

// imprimir las preguntas que estan en el Json 
function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  //mostramos la pregunta categoria
  select_id("categoria").innerHTML = pregunta.categoria;
  //mostrar la pregunta pregunta
  select_id("pregunta").innerHTML = pregunta.pregunta;
  //index de cada pregunta que aparece al lado derecho del html
  select_id("numero").innerHTML = n;
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
  } else {
    select_id("puntaje").innerHTML = "";
  }
  // objec fit para darle estilo a la imagen la
  style("imagen").objectFit = pregunta.objectFit;
  desordenarRespuestas(pregunta);
  if (pregunta.imagen) {
    select_id("imagen").setAttribute("src", pregunta.imagen);
    style("imagen").height = "200px";
    style("imagen").width = "100%";
  } else {
    style("imagen").height = "0px";
    style("imagen").width = "0px";
    setTimeout(() => {
      select_id("imagen").setAttribute("src", "");
    }, 500);
  }
}
// elijo mi respuesta , donde inserto el texto en los botones
function desordenarRespuestas(pregunta) {
  posibles_respuestas = [ // arreglo con las respuestas le asigno su valor

    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  // desordeno el arreglo con funcion sort cn el Math.random a
  posibles_respuestas.sort(() => Math.random() - 0.5);


  //le paso a los botones las respuestas 
  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];
}

let suspender_botones = false;


//funcion para oprimir los botones donde cuando presiono el boton y si es el la respuesta correcta 
//si la possible respuesta es == em la posicion i correcto y marca en verde y listo al completar le dice su puntaje es tal
// se reinia nuevamente a blanco cada 3 segundos con un settime Up
function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "lightgreen";
  } else {
    btn_correspondiente[i].style.background = "pink";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "lightgreen";
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 3000);
}


function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }
  escogerPreguntaAleatoria();
}

// seleciono el id de cada objeto segun el query
function select_id(id) {
  return document.getElementById(id);
}
//selecciono el objeto de stylo
function style(id) {
  return select_id(id).style;
}




//leo la base de datos de preguntas con una funcion sincrona
function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}
