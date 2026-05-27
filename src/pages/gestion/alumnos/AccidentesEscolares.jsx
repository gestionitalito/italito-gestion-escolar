import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import {
  ArrowLeft,
  Download,
  School,
  UserRound,
  CalendarDays,
  Stethoscope,
  ShieldAlert,
  RotateCcw,
  Search,
  CheckCircle2,
  Database,
  Hash,
} from "lucide-react";

const STORAGE_REPORTES = "italito_accidentes_escolares_reportes";
const STORAGE_FOLIO = "italito_accidentes_escolares_siguiente_folio";

function obtenerFechaActual() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = String(hoy.getFullYear());
  return { dia, mes, anio, iso: `${anio}-${mes}-${dia}` };
}

function obtenerSiguienteFolio() {
  if (typeof window === "undefined") return 1;
  const guardado = Number(localStorage.getItem(STORAGE_FOLIO));
  if (!guardado || Number.isNaN(guardado) || guardado < 1) {
    localStorage.setItem(STORAGE_FOLIO, "1");
    return 1;
  }
  return guardado;
}

function obtenerReportesGuardados() {
  if (typeof window === "undefined") return [];
  try {
    const guardados = JSON.parse(localStorage.getItem(STORAGE_REPORTES) || "[]");
    return Array.isArray(guardados) ? guardados : [];
  } catch {
    return [];
  }
}

function crearEstadoInicial(folio = obtenerSiguienteFolio()) {
  const hoy = obtenerFechaActual();
  return {
    numeroDeclaracion: String(folio),
    nombreEstablecimiento: "ESCUELA DE PÁRVULOS ITALITO",
    ciudadEstablecimiento: "LIMACHE",
    comunaEstablecimiento: "LIMACHE",
    cursoNivel: "",
    horario: "",
    fechaRegistroDia: hoy.dia,
    fechaRegistroMes: hoy.mes,
    fechaRegistroAnio: hoy.anio,
    tipoEstablecimiento: "2",
    runAlumno: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombresAlumno: "",
    sexo: "",
    anioNacimiento: "",
    edad: "",
    calle: "",
    numero: "",
    poblacionVilla: "",
    comunaResidencia: "",
    ciudadResidencia: "",
    codigoComuna: "",
    horaAccidente: "",
    minutoAccidente: "",
    anioAccidente: hoy.anio,
    mesAccidente: hoy.mes,
    diaAccidente: hoy.dia,
    diaSemana: "",
    lugarAccidente: "",
    testigoUnoNombre: "",
    testigoUnoRun: "",
    testigoDosNombre: "",
    testigoDosRun: "",
    circunstanciaAccidente: "",
    nombreRectorRepresentante: "",
    cargoRectorRepresentante: "",
    fechaEmision: hoy.iso,
    establecimientoAsistencial: "",
    codigoServicioSalud: "",
    codigoEstablecimiento: "",
    diagnosticoMedico: "",
    parteCuerpoAfectada: "",
    hospitalizacion: "",
    totalDiasHospitalizacion: "",
    incapacidad: "",
    totalDiasIncapacidad: "",
    tipoIncapacidad: "",
    causaCierreCaso: "",
    fechaCierreAnio: "",
    fechaCierreMes: "",
    fechaCierreDia: "",
    alumnoId: "",
    apoderadoNombre: "",
    apoderadoTelefono: "",
  };
}

// Base temporal. Luego la reemplazamos por la lectura real desde Firebase / ficha madre.
const alumnosRegistrados = [
  {
    id: "alumno-001",
    runAlumno: "24.345.678-9",
    apellidoPaterno: "González",
    apellidoMaterno: "Pérez",
    nombresAlumno: "Martina Ignacia",
    nombreCompleto: "Martina Ignacia González Pérez",
    sexo: "2",
    anioNacimiento: "2021",
    edad: "4",
    cursoNivel: "Pre-Kínder",
    horario: "Mañana",
    calle: "Los Aromos",
    numero: "123",
    poblacionVilla: "",
    comunaResidencia: "Limache",
    ciudadResidencia: "Limache",
    codigoComuna: "",
    apoderadoNombre: "Carolina Pérez Morales",
    apoderadoTelefono: "+56 9 1234 5678",
  },
  {
    id: "alumno-002",
    runAlumno: "25.111.222-3",
    apellidoPaterno: "Rojas",
    apellidoMaterno: "Muñoz",
    nombresAlumno: "Benjamín Alonso",
    nombreCompleto: "Benjamín Alonso Rojas Muñoz",
    sexo: "1",
    anioNacimiento: "2020",
    edad: "5",
    cursoNivel: "Kínder",
    horario: "Mañana",
    calle: "Los Castaños",
    numero: "456",
    poblacionVilla: "Villa Primavera",
    comunaResidencia: "Limache",
    ciudadResidencia: "Limache",
    codigoComuna: "",
    apoderadoNombre: "Paula Muñoz Herrera",
    apoderadoTelefono: "+56 9 9876 5432",
  },
];

const opcionesDiaSemana = [
  { valor: "", texto: "Seleccionar" },
  { valor: "1", texto: "Lunes" },
  { valor: "2", texto: "Martes" },
  { valor: "3", texto: "Miércoles" },
  { valor: "4", texto: "Jueves" },
  { valor: "5", texto: "Viernes" },
  { valor: "6", texto: "Sábado" },
  { valor: "7", texto: "Domingo" },
];

const opcionesLugarAccidente = [
  { valor: "", texto: "Seleccionar" },
  { valor: "1", texto: "De trayecto" },
  { valor: "2", texto: "En la escuela" },
];

const opcionesSexo = [
  { valor: "", texto: "Seleccionar" },
  { valor: "1", texto: "Masculino" },
  { valor: "2", texto: "Femenino" },
];

const opcionesSiNo = [
  { valor: "", texto: "Seleccionar" },
  { valor: "1", texto: "Sí" },
  { valor: "2", texto: "No" },
];

const opcionesTipoIncapacidad = [
  { valor: "", texto: "Seleccionar" },
  { valor: "1", texto: "Leve" },
  { valor: "2", texto: "Temporal" },
  { valor: "3", texto: "Invalidez parcial" },
  { valor: "4", texto: "Invalidez total" },
  { valor: "5", texto: "Gran invalidez" },
  { valor: "6", texto: "Muerte" },
];

const opcionesCausaCierre = [
  { valor: "", texto: "Seleccionar" },
  { valor: "1", texto: "Alta médica" },
  { valor: "2", texto: "Invalidez" },
  { valor: "3", texto: "Abandono de tratamiento" },
  { valor: "4", texto: "Muerte" },
];

function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapar(texto) {
  return String(texto || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function limpiarNombreArchivo(texto) {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function celda(valor, ancho = "26px") {
  return `<span class="box" style="width:${ancho};">${escapar(valor)}</span>`;
}

function linea(label, valor) {
  return `
    <div class="linea">
      <strong>${escapar(label)}:</strong>
      <span>${escapar(valor)}</span>
    </div>
  `;
}

function obtenerImagenBase64(ruta) {
  return fetch(ruta)
    .then((respuesta) => {
      if (!respuesta.ok) throw new Error("No se pudo cargar la imagen");
      return respuesta.blob();
    })
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    )
    .catch(() => "");
}

function generarPlantillaPDF(datos, logoIslBase64 = "") {
  const logoHtml = logoIslBase64
    ? `<img src="${logoIslBase64}" alt="Logo ISL Gobierno de Chile" />`
    : `<div class="logo-fallback">ISL<br/>Gobierno de Chile</div>`;

  return `
    <div class="pdf-accidente">
      <style>
        .pdf-accidente {
          width: 190mm;
          min-height: 277mm;
          box-sizing: border-box;
          padding: 7mm;
          background: #ffffff;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9.8px;
        }

        .pdf-border {
          border: 1.5px solid #111827;
          padding: 7mm;
          min-height: 263mm;
          box-sizing: border-box;
          background: #ffffff;
        }

        .pdf-header {
          display: grid;
          grid-template-columns: 76px 1fr 80px;
          gap: 10px;
          align-items: start;
          margin-bottom: 8px;
        }

        .logo-box {
          width: 72px;
          height: 90px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          overflow: hidden;
          background: #ffffff;
        }

        .logo-box img {
          width: 72px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .logo-fallback {
          width: 72px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #ffffff;
          background: linear-gradient(90deg, #0047bb 0 55%, #e30613 55% 100%);
          font-size: 8px;
          line-height: 1.25;
          font-weight: 800;
        }

        .title {
          text-align: center;
          padding-top: 37px;
        }

        .title h1 {
          margin: 0;
          font-size: 14px;
          letter-spacing: .02em;
          font-weight: 900;
        }

        .title p {
          margin: 7px 0 0;
          font-size: 9px;
          font-weight: 700;
          color: #111827;
          text-align: left;
        }

        .numero {
          padding-top: 28px;
          text-align: right;
          font-size: 13px;
          font-weight: 900;
        }

        .numero span {
          display: inline-block;
          min-width: 44px;
          border-bottom: 1px solid #111827;
          text-align: center;
        }

        .section {
          margin-top: 7px;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .section-title {
          background: #f1f5f9;
          border: 1px solid #111827;
          padding: 4px 6px;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 9.6px;
          letter-spacing: .02em;
        }

        .sub-title {
          font-weight: 900;
          text-transform: uppercase;
          margin-top: 6px;
          margin-bottom: 3px;
        }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 5px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; margin-top: 5px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-top: 5px; }

        .linea {
          min-height: 16px;
          border-bottom: 1px solid #6b7280;
          padding-bottom: 1px;
          line-height: 1.25;
        }

        .linea strong { font-weight: 800; }
        .linea span { margin-left: 4px; }

        .small-label {
          font-size: 7.2px;
          color: #374151;
          font-weight: 700;
          text-transform: uppercase;
          margin-top: 1px;
          line-height: 1.2;
        }

        .box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 17px;
          border: 1px solid #111827;
          margin: 0 1px;
          font-weight: 800;
          background: #ffffff;
        }

        .textarea-box {
          border: 1px solid #111827;
          min-height: 45px;
          padding: 6px;
          margin-top: 5px;
          line-height: 1.25;
          white-space: pre-wrap;
        }

        .testigos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 5px;
        }

        .firma {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-top: 14px;
          align-items: end;
        }

        .firma-line {
          border-top: 1px solid #111827;
          text-align: center;
          padding-top: 4px;
          font-size: 8.5px;
          font-weight: 800;
        }

        .note {
          margin-top: 8px;
          padding: 5px 6px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          font-size: 7.6px;
          line-height: 1.25;
          color: #374151;
        }

        .footer {
          margin-top: 7px;
          text-align: center;
          font-size: 7.5px;
          color: #64748b;
        }
      </style>

      <div class="pdf-border">
        <div class="pdf-header">
          <div class="logo-box">${logoHtml}</div>

          <div class="title">
            <h1>DECLARACIÓN INDIVIDUAL DE ACCIDENTE ESCOLAR</h1>
            <p>Antes de registrar los datos lea las instrucciones al reverso.</p>
          </div>

          <div class="numero">N° <span>${escapar(datos.numeroDeclaracion)}</span></div>
        </div>

        <div class="section">
          <div class="section-title">A. Individualización del establecimiento</div>
          <div class="grid-3">
            <div>${linea("Nombre establecimiento", datos.nombreEstablecimiento)}</div>
            <div>${linea("Ciudad", datos.ciudadEstablecimiento)}</div>
            <div>${linea("Comuna", datos.comunaEstablecimiento)}</div>
          </div>
          <div class="grid-4">
            <div>${linea("Curso / Nivel", datos.cursoNivel)}</div>
            <div>${linea("Horario", datos.horario)}</div>
            <div>
              <strong>Fecha registro:</strong>
              ${celda(datos.fechaRegistroDia)} ${celda(datos.fechaRegistroMes)} ${celda(datos.fechaRegistroAnio, "38px")}
              <div class="small-label">Día / Mes / Año</div>
            </div>
            <div>
              <strong>Tipo:</strong> ${celda(datos.tipoEstablecimiento)}
              <div class="small-label">Fiscal 0 / Municipal 1 / Particular 2</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">B. Datos del alumno o alumna</div>
          <div class="grid-4">
            <div>${linea("R.U.N.", datos.runAlumno)}</div>
            <div>${linea("Apellido paterno", datos.apellidoPaterno)}</div>
            <div>${linea("Apellido materno", datos.apellidoMaterno)}</div>
            <div>${linea("Nombres", datos.nombresAlumno)}</div>
          </div>
          <div class="grid-4">
            <div>
              <strong>Sexo:</strong> ${celda(datos.sexo)}
              <div class="small-label">M=1 / F=2</div>
            </div>
            <div>${linea("Año nacimiento", datos.anioNacimiento)}</div>
            <div>${linea("Edad", datos.edad)}</div>
            <div>${linea("Código comuna", datos.codigoComuna)}</div>
          </div>

          <div class="sub-title">Residencia habitual</div>
          <div class="grid-3">
            <div>${linea("Calle", datos.calle)}</div>
            <div>${linea("Número", datos.numero)}</div>
            <div>${linea("Población / Villa", datos.poblacionVilla)}</div>
          </div>
          <div class="grid-2">
            <div>${linea("Comuna", datos.comunaResidencia)}</div>
            <div>${linea("Ciudad", datos.ciudadResidencia)}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">C. Informe sobre el accidente</div>
          <div class="grid-4">
            <div>
              <strong>Hora:</strong> ${celda(datos.horaAccidente)} ${celda(datos.minutoAccidente)}
              <div class="small-label">Hora / Min.</div>
            </div>
            <div>
              <strong>Fecha:</strong> ${celda(datos.diaAccidente)} ${celda(datos.mesAccidente)} ${celda(datos.anioAccidente, "38px")}
              <div class="small-label">Día / Mes / Año</div>
            </div>
            <div>
              <strong>Día accidente:</strong> ${celda(datos.diaSemana)}
              <div class="small-label">Lun 1 / Mar 2 / Mié 3 / Jue 4 / Vie 5 / Sáb 6 / Dom 7</div>
            </div>
            <div>
              <strong>Accidente:</strong> ${celda(datos.lugarAccidente)}
              <div class="small-label">Trayecto 1 / Escuela 2</div>
            </div>
          </div>

          <div class="testigos">
            <div>
              ${linea("Testigo 1 nombre", datos.testigoUnoNombre)}
              ${linea("C. nac. identidad", datos.testigoUnoRun)}
            </div>
            <div>
              ${linea("Testigo 2 nombre", datos.testigoDosNombre)}
              ${linea("C. nac. identidad", datos.testigoDosRun)}
            </div>
          </div>

          <div style="margin-top:6px;">
            <strong>Circunstancia del accidente:</strong>
            <div class="textarea-box">${escapar(datos.circunstanciaAccidente)}</div>
          </div>

          <div class="firma">
            <div></div>
            <div><div class="firma-line">Firma y timbre<br/>Rector/a o representante</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">D. Naturaleza y consecuencia del accidente</div>
          <div class="grid-3">
            <div>${linea("Establecimiento asistencial", datos.establecimientoAsistencial)}</div>
            <div>${linea("Código S.S.", datos.codigoServicioSalud)}</div>
            <div>${linea("Código establecimiento", datos.codigoEstablecimiento)}</div>
          </div>
          <div class="grid-2">
            <div>${linea("Diagnóstico médico", datos.diagnosticoMedico)}</div>
            <div>${linea("Parte del cuerpo afectada", datos.parteCuerpoAfectada)}</div>
          </div>
          <div class="grid-4">
            <div>
              <strong>Hospitalización:</strong> ${celda(datos.hospitalizacion)}
              <div class="small-label">Sí 1 / No 2</div>
            </div>
            <div>${linea("Total días hosp.", datos.totalDiasHospitalizacion)}</div>
            <div>
              <strong>Incapacidad:</strong> ${celda(datos.incapacidad)}
              <div class="small-label">Sí 1 / No 2</div>
            </div>
            <div>${linea("Total días incapacidad", datos.totalDiasIncapacidad)}</div>
          </div>
          <div class="grid-3">
            <div>
              <strong>Tipo incapacidad:</strong> ${celda(datos.tipoIncapacidad)}
              <div class="small-label">Leve 1 / Temporal 2 / Inv. parcial 3 / Inv. total 4 / Gran inv. 5 / Muerte 6</div>
            </div>
            <div>
              <strong>Causa cierre:</strong> ${celda(datos.causaCierreCaso)}
              <div class="small-label">Alta 1 / Invalidez 2 / Abandono 3 / Muerte 4</div>
            </div>
            <div>
              <strong>Fecha cierre:</strong> ${celda(datos.fechaCierreDia)} ${celda(datos.fechaCierreMes)} ${celda(datos.fechaCierreAnio, "38px")}
              <div class="small-label">Día / Mes / Año</div>
            </div>
          </div>

          <div class="firma">
            <div><div class="firma-line">Firma del apoderado/a o declarante</div></div>
            <div><div class="firma-line">Firma del estadístico / establecimiento asistencial</div></div>
          </div>
        </div>

        <div class="note">
          Documento generado digitalmente por Italito Gestión Escolar. Los datos deben ser revisados antes de su presentación o archivo.
        </div>
        <div class="footer">Escuela de Párvulos Italito · Declaración Individual de Accidente Escolar</div>
      </div>
    </div>
  `;
}

function AccidentesEscolares() {
  const [siguienteFolio, setSiguienteFolio] = useState(obtenerSiguienteFolio());
  const [formulario, setFormulario] = useState(() => crearEstadoInicial(obtenerSiguienteFolio()));
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [reportes, setReportes] = useState(obtenerReportesGuardados);
  const [generando, setGenerando] = useState(false);

  const coincidencias = useMemo(() => {
    const termino = normalizar(busquedaAlumno);
    if (termino.length < 2) return [];

    return alumnosRegistrados.filter((alumno) => {
      const run = normalizar(alumno.runAlumno);
      const nombre = normalizar(alumno.nombreCompleto);
      const nombres = normalizar(alumno.nombresAlumno);
      const paterno = normalizar(alumno.apellidoPaterno);
      const materno = normalizar(alumno.apellidoMaterno);
      return (
        run.includes(termino) ||
        nombre.includes(termino) ||
        nombres.includes(termino) ||
        paterno.includes(termino) ||
        materno.includes(termino)
      );
    });
  }, [busquedaAlumno]);

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const cargarAlumnoEnFormulario = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setBusquedaAlumno(alumno.nombreCompleto);
    setFormulario((prev) => ({
      ...prev,
      alumnoId: alumno.id,
      runAlumno: alumno.runAlumno,
      apellidoPaterno: alumno.apellidoPaterno,
      apellidoMaterno: alumno.apellidoMaterno,
      nombresAlumno: alumno.nombresAlumno,
      sexo: alumno.sexo,
      anioNacimiento: alumno.anioNacimiento,
      edad: alumno.edad,
      cursoNivel: alumno.cursoNivel,
      horario: alumno.horario,
      calle: alumno.calle,
      numero: alumno.numero,
      poblacionVilla: alumno.poblacionVilla,
      comunaResidencia: alumno.comunaResidencia,
      ciudadResidencia: alumno.ciudadResidencia,
      codigoComuna: alumno.codigoComuna,
      apoderadoNombre: alumno.apoderadoNombre,
      apoderadoTelefono: alumno.apoderadoTelefono,
    }));
  };

  const manejarBusquedaAlumno = (valor) => {
    setBusquedaAlumno(valor);
    const termino = normalizar(valor);

    if (termino.length < 2) {
      setAlumnoSeleccionado(null);
      return;
    }

    const resultados = alumnosRegistrados.filter((alumno) => {
      const run = normalizar(alumno.runAlumno);
      const nombre = normalizar(alumno.nombreCompleto);
      const nombres = normalizar(alumno.nombresAlumno);
      const paterno = normalizar(alumno.apellidoPaterno);
      const materno = normalizar(alumno.apellidoMaterno);
      return (
        run.includes(termino) ||
        nombre.includes(termino) ||
        nombres.includes(termino) ||
        paterno.includes(termino) ||
        materno.includes(termino)
      );
    });

    const coincidenciaExactaRun = resultados.find(
      (alumno) => normalizar(alumno.runAlumno) === termino
    );

    if (coincidenciaExactaRun) {
      cargarAlumnoEnFormulario(coincidenciaExactaRun);
      return;
    }

    if (termino.length >= 4 && resultados.length === 1) {
      cargarAlumnoEnFormulario(resultados[0]);
    }
  };

  const limpiarFormulario = () => {
    const confirmar = window.confirm("¿Seguro que deseas iniciar un nuevo formulario de accidente escolar?");
    if (!confirmar) return;
    const folioActual = obtenerSiguienteFolio();
    setSiguienteFolio(folioActual);
    setFormulario(crearEstadoInicial(folioActual));
    setBusquedaAlumno("");
    setAlumnoSeleccionado(null);
  };

  const guardarReporteLocal = (datosPdf) => {
    const folioNumerico = Number(datosPdf.numeroDeclaracion);
    const nuevoReporte = {
      id: `accidente-${datosPdf.numeroDeclaracion}-${Date.now()}`,
      folio: datosPdf.numeroDeclaracion,
      fechaGuardado: new Date().toISOString(),
      alumno: `${datosPdf.nombresAlumno} ${datosPdf.apellidoPaterno} ${datosPdf.apellidoMaterno}`.trim(),
      runAlumno: datosPdf.runAlumno,
      cursoNivel: datosPdf.cursoNivel,
      fechaAccidente: `${datosPdf.diaAccidente}-${datosPdf.mesAccidente}-${datosPdf.anioAccidente}`,
      horaAccidente: `${datosPdf.horaAccidente}:${datosPdf.minutoAccidente}`,
      circunstanciaAccidente: datosPdf.circunstanciaAccidente,
      datos: datosPdf,
    };

    const sinDuplicado = reportes.filter(
      (reporte) => String(reporte.folio) !== String(datosPdf.numeroDeclaracion)
    );
    const actualizados = [nuevoReporte, ...sinDuplicado];
    localStorage.setItem(STORAGE_REPORTES, JSON.stringify(actualizados));
    setReportes(actualizados);

    const folioActualGuardado = obtenerSiguienteFolio();
    if (folioNumerico && !Number.isNaN(folioNumerico) && folioNumerico >= folioActualGuardado) {
      const nuevoSiguiente = folioNumerico + 1;
      localStorage.setItem(STORAGE_FOLIO, String(nuevoSiguiente));
      setSiguienteFolio(nuevoSiguiente);
    }
  };

  const esperarRender = () => new Promise((resolve) => setTimeout(resolve, 700));

  const descargarPDF = async () => {
    if (!formulario.runAlumno || !formulario.nombresAlumno) {
      alert("Primero debes cargar o ingresar los datos del alumno.");
      return;
    }

    if (!formulario.circunstanciaAccidente) {
      alert("Debes registrar la circunstancia del accidente antes de generar el PDF.");
      return;
    }

    let contenedor = null;

    try {
      setGenerando(true);

      const datosPdf = {
        ...formulario,
        numeroDeclaracion: formulario.numeroDeclaracion || String(siguienteFolio),
      };

      const logoIslBase64 = await obtenerImagenBase64("/logo-isl-accidente.png");

      contenedor = document.createElement("div");
      contenedor.innerHTML = generarPlantillaPDF(datosPdf, logoIslBase64);
      contenedor.style.position = "fixed";
      contenedor.style.left = "0";
      contenedor.style.top = "0";
      contenedor.style.width = "210mm";
      contenedor.style.minHeight = "297mm";
      contenedor.style.background = "#ffffff";
      contenedor.style.zIndex = "999999";
      contenedor.style.pointerEvents = "none";
      document.body.appendChild(contenedor);

      await esperarRender();

      const elementoPDF = contenedor.querySelector(".pdf-accidente");
      if (!elementoPDF) throw new Error("No se encontró la plantilla PDF.");

      const nombreAlumno = limpiarNombreArchivo(
        `${datosPdf.apellidoPaterno}_${datosPdf.apellidoMaterno}_${datosPdf.nombresAlumno}`
      );

      const opciones = {
        margin: 0,
        filename: `folio_${datosPdf.numeroDeclaracion}_accidente_escolar_${nombreAlumno}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1123,
          windowHeight: 1588,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(opciones).from(elementoPDF).save();

      guardarReporteLocal(datosPdf);

      const folioActual = Number(datosPdf.numeroDeclaracion);
      const nuevoFolio = folioActual && !Number.isNaN(folioActual) ? folioActual + 1 : obtenerSiguienteFolio() + 1;
      localStorage.setItem(STORAGE_FOLIO, String(nuevoFolio));
      setSiguienteFolio(nuevoFolio);
      setFormulario(crearEstadoInicial(nuevoFolio));
      setBusquedaAlumno("");
      setAlumnoSeleccionado(null);

      alert(`Declaración de accidente escolar folio N° ${datosPdf.numeroDeclaracion} generada y guardada correctamente.`);
    } catch (error) {
      console.error("Error al generar PDF de accidente escolar:", error);
      alert("No se pudo generar el PDF. Revisa la consola para más detalle.");
    } finally {
      if (contenedor && document.body.contains(contenedor)) {
        document.body.removeChild(contenedor);
      }
      setGenerando(false);
    }
  };

  return (
    <div className="accidentes-page">
      <style>{`
        .accidentes-page {
          width: 100%;
          min-height: 100vh;
          padding: 32px;
          box-sizing: border-box;
          color: #0f172a;
          background:
            radial-gradient(circle at top left, rgba(220, 38, 38, 0.10), transparent 32%),
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.10), transparent 30%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
        }
        .accidentes-back-link { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 18px; color: #2563eb; font-weight: 800; font-size: 14px; text-decoration: none; }
        .accidentes-hero { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 22px; margin-bottom: 24px; }
        .accidentes-card { background: rgba(255,255,255,0.94); border: 1px solid rgba(148, 163, 184, 0.28); border-radius: 30px; padding: 28px; box-shadow: 0 18px 46px rgba(15, 23, 42, 0.09); }
        .accidentes-kicker { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 999px; background: rgba(220, 38, 38, 0.10); color: #dc2626; font-size: 13px; font-weight: 850; margin-bottom: 12px; }
        .accidentes-card h1 { margin: 0; font-size: 33px; line-height: 1.1; font-weight: 950; letter-spacing: -0.04em; }
        .accidentes-card p { margin: 12px 0 0; color: #64748b; line-height: 1.6; font-size: 14px; }
        .accidentes-info { background: linear-gradient(135deg, #0f172a, #1e3a8a); color: white; border-radius: 30px; padding: 26px; box-shadow: 0 20px 52px rgba(15, 23, 42, 0.24); display: grid; align-content: space-between; gap: 16px; }
        .accidentes-info span { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 850; color: rgba(255,255,255,0.66); }
        .accidentes-info strong { display: block; margin-top: 6px; font-size: 23px; font-weight: 950; letter-spacing: -0.03em; }
        .folio-box { display: inline-flex; align-items: center; gap: 8px; width: fit-content; padding: 9px 13px; border-radius: 999px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.16); color: white; font-size: 13px; font-weight: 900; }
        .accidentes-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
        .accidentes-btn { min-height: 46px; padding: 0 16px; border-radius: 15px; border: 1px solid rgba(203, 213, 225, 0.9); background: white; color: #334155; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 900; box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08); transition: all 0.2s ease; cursor: pointer; font-family: inherit; }
        .accidentes-btn.primary { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; border-color: transparent; }
        .accidentes-btn.secondary { background: #0f172a; color: white; border-color: transparent; }
        .accidentes-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14); }
        .accidentes-form { display: grid; gap: 22px; }
        .accidentes-section { background: rgba(255,255,255,0.94); border: 1px solid rgba(148, 163, 184, 0.28); border-radius: 28px; padding: 24px; box-shadow: 0 16px 42px rgba(15, 23, 42, 0.08); }
        .accidentes-section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
        .accidentes-section-icon { width: 48px; height: 48px; border-radius: 17px; background: rgba(220, 38, 38, 0.10); color: #dc2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .accidentes-section-icon.blue { background: rgba(37, 99, 235, 0.10); color: #2563eb; }
        .accidentes-section-header h2 { margin: 0; font-size: 20px; font-weight: 950; color: #0f172a; letter-spacing: -0.02em; }
        .accidentes-section-header p { margin: 4px 0 0; color: #64748b; font-size: 13px; line-height: 1.5; }
        .accidentes-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
        .accidentes-field { display: grid; gap: 7px; }
        .accidentes-field.full { grid-column: 1 / -1; }
        .accidentes-field label { font-size: 12px; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.045em; }
        .accidentes-field input, .accidentes-field select, .accidentes-field textarea { width: 100%; min-height: 46px; border: 1px solid rgba(203, 213, 225, 0.95); border-radius: 15px; padding: 0 14px; font-size: 14px; color: #0f172a; background: #f8fafc; outline: none; box-sizing: border-box; transition: all 0.2s ease; font-family: inherit; }
        .accidentes-field textarea { min-height: 105px; padding: 13px 14px; resize: vertical; }
        .accidentes-field input:focus, .accidentes-field select:focus, .accidentes-field textarea:focus { background: white; border-color: rgba(37, 99, 235, 0.55); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.10); }
        .search-wrap { position: relative; }
        .search-input { width: 100%; min-height: 50px; border: 1px solid rgba(203, 213, 225, 0.95); border-radius: 18px; padding: 0 16px 0 46px; font-size: 15px; font-weight: 750; color: #0f172a; background: #f8fafc; outline: none; box-sizing: border-box; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b; }
        .resultados-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 16px; }
        .alumno-card { border: 1px solid rgba(203, 213, 225, 0.95); border-radius: 20px; background: #f8fafc; padding: 16px; display: flex; justify-content: space-between; align-items: center; gap: 14px; }
        .alumno-card h3 { margin: 0; font-size: 16px; font-weight: 950; color: #0f172a; }
        .alumno-card p { margin: 6px 0 0; color: #64748b; font-size: 13px; font-weight: 750; }
        .alumno-card button { border: none; border-radius: 14px; min-height: 42px; padding: 0 14px; background: #2563eb; color: white; font-weight: 900; cursor: pointer; font-family: inherit; white-space: nowrap; }
        .alumno-seleccionado { margin-top: 16px; display: flex; align-items: center; gap: 12px; border-radius: 18px; padding: 14px; background: rgba(22, 163, 74, 0.08); border: 1px solid rgba(22, 163, 74, 0.25); color: #14532d; font-weight: 850; }
        .historial-table-wrap { overflow-x: auto; border-radius: 20px; border: 1px solid rgba(226, 232, 240, 0.95); }
        .historial-table { width: 100%; min-width: 900px; border-collapse: collapse; background: white; }
        .historial-table th { text-align: left; padding: 14px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 900; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .historial-table td { padding: 14px; border-bottom: 1px solid #eef2f7; font-size: 14px; font-weight: 750; color: #334155; }
        .historial-table tr:last-child td { border-bottom: none; }
        .accidentes-note { margin-top: 22px; background: linear-gradient(135deg, #7f1d1d, #991b1b); color: rgba(255,255,255,0.84); border-radius: 24px; padding: 22px; line-height: 1.6; font-size: 14px; box-shadow: 0 18px 44px rgba(127, 29, 29, 0.20); }
        .accidentes-note strong { color: white; }
        @media (max-width: 1200px) { .accidentes-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .resultados-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) { .accidentes-hero { grid-template-columns: 1fr; } }
        @media (max-width: 720px) { .accidentes-page { padding: 22px; } .accidentes-card, .accidentes-info, .accidentes-section { padding: 20px; } .accidentes-card h1 { font-size: 27px; } .accidentes-grid { grid-template-columns: 1fr; } .accidentes-btn { width: 100%; justify-content: center; } .alumno-card { flex-direction: column; align-items: flex-start; } .alumno-card button { width: 100%; } }
      `}</style>

      <Link to="/gestion/alumnos" className="accidentes-back-link">
        <ArrowLeft size={18} /> Volver al módulo alumnos
      </Link>

      <section className="accidentes-hero">
        <article className="accidentes-card">
          <span className="accidentes-kicker"><ShieldAlert size={16} /> Accidentes escolares</span>
          <h1>Declaración individual de accidente escolar</h1>
          <p>
            Busca al párvulo por RUN o nombre, carga sus datos personales desde la ficha madre
            y completa solo los antecedentes del accidente. Cada informe se guarda con folio
            correlativo desde el N° 1.
          </p>
        </article>

        <aside className="accidentes-info">
          <div>
            <span>Siguiente folio</span>
            <strong>N° {siguienteFolio}</strong>
          </div>
          <div>
            <span>Folio de este formulario</span>
            <div className="folio-box"><Hash size={16} /> N° {formulario.numeroDeclaracion}</div>
          </div>
        </aside>
      </section>

      <div className="accidentes-actions">
        <button type="button" className="accidentes-btn primary" onClick={descargarPDF} disabled={generando}>
          <Download size={18} /> {generando ? "Generando PDF..." : "Guardar y descargar PDF"}
        </button>
        <button type="button" className="accidentes-btn secondary" onClick={limpiarFormulario}>
          <RotateCcw size={18} /> Nuevo formulario
        </button>
      </div>

      <form className="accidentes-form">
        <section className="accidentes-section">
          <div className="accidentes-section-header">
            <div className="accidentes-section-icon blue"><Search size={25} /></div>
            <div>
              <h2>Buscar alumno desde ficha madre</h2>
              <p>Ingresa RUN, nombre o apellido. Si hay una coincidencia única, los datos se cargan automáticamente.</p>
            </div>
          </div>
          <div className="search-wrap">
            <Search size={19} className="search-icon" />
            <input className="search-input" value={busquedaAlumno} onChange={(e) => manejarBusquedaAlumno(e.target.value)} placeholder="Buscar por RUN, nombre o apellido..." />
          </div>
          {alumnoSeleccionado && (
            <div className="alumno-seleccionado">
              <CheckCircle2 size={20} /> Datos cargados: {alumnoSeleccionado.nombreCompleto} · RUN {alumnoSeleccionado.runAlumno} · {alumnoSeleccionado.cursoNivel}
            </div>
          )}
          {busquedaAlumno && coincidencias.length > 1 && (
            <div className="resultados-grid">
              {coincidencias.map((alumno) => (
                <article key={alumno.id} className="alumno-card">
                  <div>
                    <h3>{alumno.nombreCompleto}</h3>
                    <p>RUN {alumno.runAlumno} · {alumno.cursoNivel} · {alumno.horario}</p>
                  </div>
                  <button type="button" onClick={() => cargarAlumnoEnFormulario(alumno)}>Cargar datos</button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="accidentes-section">
          <div className="accidentes-section-header"><div className="accidentes-section-icon blue"><School size={25} /></div><div><h2>A. Individualización del establecimiento</h2><p>Datos del establecimiento y fecha de registro.</p></div></div>
          <div className="accidentes-grid">
            <Campo label="N° declaración" value={formulario.numeroDeclaracion} onChange={(v) => actualizarCampo("numeroDeclaracion", v)} />
            <Campo label="Nombre establecimiento" value={formulario.nombreEstablecimiento} onChange={(v) => actualizarCampo("nombreEstablecimiento", v)} />
            <Campo label="Ciudad" value={formulario.ciudadEstablecimiento} onChange={(v) => actualizarCampo("ciudadEstablecimiento", v)} />
            <Campo label="Comuna" value={formulario.comunaEstablecimiento} onChange={(v) => actualizarCampo("comunaEstablecimiento", v)} />
            <Campo label="Curso / nivel" value={formulario.cursoNivel} onChange={(v) => actualizarCampo("cursoNivel", v)} />
            <Campo label="Horario" value={formulario.horario} onChange={(v) => actualizarCampo("horario", v)} />
            <Campo label="Día registro" value={formulario.fechaRegistroDia} onChange={(v) => actualizarCampo("fechaRegistroDia", v)} />
            <Campo label="Mes registro" value={formulario.fechaRegistroMes} onChange={(v) => actualizarCampo("fechaRegistroMes", v)} />
            <Campo label="Año registro" value={formulario.fechaRegistroAnio} onChange={(v) => actualizarCampo("fechaRegistroAnio", v)} />
            <CampoSelect label="Tipo establecimiento" value={formulario.tipoEstablecimiento} onChange={(v) => actualizarCampo("tipoEstablecimiento", v)} opciones={[{ valor: "0", texto: "Fiscal" }, { valor: "1", texto: "Municipal" }, { valor: "2", texto: "Particular" }]} />
          </div>
        </section>

        <section className="accidentes-section">
          <div className="accidentes-section-header"><div className="accidentes-section-icon"><UserRound size={25} /></div><div><h2>B. Datos del alumno o alumna</h2><p>Estos datos se cargan desde la ficha madre, pero quedan editables.</p></div></div>
          <div className="accidentes-grid">
            <Campo label="RUN" value={formulario.runAlumno} onChange={(v) => actualizarCampo("runAlumno", v)} />
            <Campo label="Apellido paterno" value={formulario.apellidoPaterno} onChange={(v) => actualizarCampo("apellidoPaterno", v)} />
            <Campo label="Apellido materno" value={formulario.apellidoMaterno} onChange={(v) => actualizarCampo("apellidoMaterno", v)} />
            <Campo label="Nombres" value={formulario.nombresAlumno} onChange={(v) => actualizarCampo("nombresAlumno", v)} />
            <CampoSelect label="Sexo" value={formulario.sexo} onChange={(v) => actualizarCampo("sexo", v)} opciones={opcionesSexo} />
            <Campo label="Año nacimiento" value={formulario.anioNacimiento} onChange={(v) => actualizarCampo("anioNacimiento", v)} />
            <Campo label="Edad" value={formulario.edad} onChange={(v) => actualizarCampo("edad", v)} />
            <Campo label="Código comuna" value={formulario.codigoComuna} onChange={(v) => actualizarCampo("codigoComuna", v)} />
            <Campo label="Calle" value={formulario.calle} onChange={(v) => actualizarCampo("calle", v)} />
            <Campo label="Número" value={formulario.numero} onChange={(v) => actualizarCampo("numero", v)} />
            <Campo label="Población / villa" value={formulario.poblacionVilla} onChange={(v) => actualizarCampo("poblacionVilla", v)} />
            <Campo label="Comuna residencia" value={formulario.comunaResidencia} onChange={(v) => actualizarCampo("comunaResidencia", v)} />
            <Campo label="Ciudad residencia" value={formulario.ciudadResidencia} onChange={(v) => actualizarCampo("ciudadResidencia", v)} />
          </div>
        </section>

        <section className="accidentes-section">
          <div className="accidentes-section-header"><div className="accidentes-section-icon"><CalendarDays size={25} /></div><div><h2>C. Informe sobre el accidente</h2><p>Fecha, hora, lugar, testigos y circunstancia del accidente.</p></div></div>
          <div className="accidentes-grid">
            <Campo label="Hora" value={formulario.horaAccidente} onChange={(v) => actualizarCampo("horaAccidente", v)} />
            <Campo label="Minuto" value={formulario.minutoAccidente} onChange={(v) => actualizarCampo("minutoAccidente", v)} />
            <Campo label="Día accidente" value={formulario.diaAccidente} onChange={(v) => actualizarCampo("diaAccidente", v)} />
            <Campo label="Mes accidente" value={formulario.mesAccidente} onChange={(v) => actualizarCampo("mesAccidente", v)} />
            <Campo label="Año accidente" value={formulario.anioAccidente} onChange={(v) => actualizarCampo("anioAccidente", v)} />
            <CampoSelect label="Día de la semana" value={formulario.diaSemana} onChange={(v) => actualizarCampo("diaSemana", v)} opciones={opcionesDiaSemana} />
            <CampoSelect label="Lugar accidente" value={formulario.lugarAccidente} onChange={(v) => actualizarCampo("lugarAccidente", v)} opciones={opcionesLugarAccidente} />
            <Campo label="Testigo 1 nombre" value={formulario.testigoUnoNombre} onChange={(v) => actualizarCampo("testigoUnoNombre", v)} />
            <Campo label="Testigo 1 RUN" value={formulario.testigoUnoRun} onChange={(v) => actualizarCampo("testigoUnoRun", v)} />
            <Campo label="Testigo 2 nombre" value={formulario.testigoDosNombre} onChange={(v) => actualizarCampo("testigoDosNombre", v)} />
            <Campo label="Testigo 2 RUN" value={formulario.testigoDosRun} onChange={(v) => actualizarCampo("testigoDosRun", v)} />
            <div className="accidentes-field full"><label>Circunstancia del accidente</label><textarea value={formulario.circunstanciaAccidente} onChange={(e) => actualizarCampo("circunstanciaAccidente", e.target.value)} placeholder="Describa cómo ocurrió el accidente." /></div>
          </div>
        </section>

        <section className="accidentes-section">
          <div className="accidentes-section-header"><div className="accidentes-section-icon"><Stethoscope size={25} /></div><div><h2>D. Naturaleza y consecuencia del accidente</h2><p>Campos asistenciales y resultado del caso.</p></div></div>
          <div className="accidentes-grid">
            <Campo label="Establecimiento asistencial" value={formulario.establecimientoAsistencial} onChange={(v) => actualizarCampo("establecimientoAsistencial", v)} />
            <Campo label="Código servicio salud" value={formulario.codigoServicioSalud} onChange={(v) => actualizarCampo("codigoServicioSalud", v)} />
            <Campo label="Código establecimiento" value={formulario.codigoEstablecimiento} onChange={(v) => actualizarCampo("codigoEstablecimiento", v)} />
            <Campo label="Diagnóstico médico" value={formulario.diagnosticoMedico} onChange={(v) => actualizarCampo("diagnosticoMedico", v)} />
            <Campo label="Parte del cuerpo afectada" value={formulario.parteCuerpoAfectada} onChange={(v) => actualizarCampo("parteCuerpoAfectada", v)} />
            <CampoSelect label="Hospitalización" value={formulario.hospitalizacion} onChange={(v) => actualizarCampo("hospitalizacion", v)} opciones={opcionesSiNo} />
            <Campo label="Total días hospitalización" value={formulario.totalDiasHospitalizacion} onChange={(v) => actualizarCampo("totalDiasHospitalizacion", v)} />
            <CampoSelect label="Incapacidad" value={formulario.incapacidad} onChange={(v) => actualizarCampo("incapacidad", v)} opciones={opcionesSiNo} />
            <Campo label="Total días incapacidad" value={formulario.totalDiasIncapacidad} onChange={(v) => actualizarCampo("totalDiasIncapacidad", v)} />
            <CampoSelect label="Tipo incapacidad" value={formulario.tipoIncapacidad} onChange={(v) => actualizarCampo("tipoIncapacidad", v)} opciones={opcionesTipoIncapacidad} />
            <CampoSelect label="Causa cierre caso" value={formulario.causaCierreCaso} onChange={(v) => actualizarCampo("causaCierreCaso", v)} opciones={opcionesCausaCierre} />
            <Campo label="Día cierre" value={formulario.fechaCierreDia} onChange={(v) => actualizarCampo("fechaCierreDia", v)} />
            <Campo label="Mes cierre" value={formulario.fechaCierreMes} onChange={(v) => actualizarCampo("fechaCierreMes", v)} />
            <Campo label="Año cierre" value={formulario.fechaCierreAnio} onChange={(v) => actualizarCampo("fechaCierreAnio", v)} />
          </div>
        </section>

        <section className="accidentes-section">
          <div className="accidentes-section-header"><div className="accidentes-section-icon blue"><Database size={25} /></div><div><h2>Informes guardados localmente</h2><p>Registro temporal de declaraciones generadas. Luego esto pasará al historial documental del alumno en Firebase.</p></div></div>
          <div className="historial-table-wrap">
            <table className="historial-table">
              <thead><tr><th>Folio</th><th>Alumno</th><th>RUN</th><th>Curso</th><th>Fecha accidente</th><th>Hora</th></tr></thead>
              <tbody>
                {reportes.length === 0 ? (
                  <tr><td colSpan="6">Aún no existen declaraciones de accidente escolar guardadas.</td></tr>
                ) : (
                  reportes.slice(0, 8).map((reporte) => (
                    <tr key={reporte.id}><td>N° {reporte.folio}</td><td>{reporte.alumno}</td><td>{reporte.runAlumno}</td><td>{reporte.cursoNivel}</td><td>{reporte.fechaAccidente}</td><td>{reporte.horaAccidente}</td></tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </form>

      <section className="accidentes-note">
        <strong>Importante:</strong> este módulo genera solamente PDF y guarda los informes con folio correlativo desde el N° 1. Actualmente el guardado es local en el navegador. Cuando conectemos Firebase, el folio, el PDF y el registro del accidente quedarán asociados al historial documental del párvulo.
      </section>
    </div>
  );
}

function Campo({ label, value, onChange }) {
  return (
    <div className="accidentes-field">
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function CampoSelect({ label, value, onChange, opciones }) {
  return (
    <div className="accidentes-field">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
        ))}
      </select>
    </div>
  );
}

export default AccidentesEscolares;
