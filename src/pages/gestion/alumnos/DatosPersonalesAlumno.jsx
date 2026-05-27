import { Link } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  School,
  Users,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  HeartPulse,
  FileText,
  Pencil,
  ShieldCheck,
  ClipboardList,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Stethoscope,
  GraduationCap,
  FileCheck2,
  Printer,
  Download,
} from "lucide-react";
import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  ShadingType,
  VerticalAlign,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";

const COLOR_AZUL = "1E3A8A";
const COLOR_VERDE = "315F3C";
const COLOR_ROJO = "E11D2E";
const COLOR_BORDE = "CBD5E1";
const LOGO_URL = "/logo-italito.png";

function limpiarNombreArchivo(texto) {
  return String(texto || "alumno")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function valor(texto) {
  return texto || "No informado";
}

async function obtenerLogoArrayBuffer() {
  try {
    const respuesta = await fetch(LOGO_URL);
    if (!respuesta.ok) return null;
    return await respuesta.arrayBuffer();
  } catch (error) {
    console.warn("No se pudo cargar el logo para el documento.", error);
    return null;
  }
}

function celdaDocx(texto, opciones = {}) {
  const {
    bold = false,
    color = "111827",
    fill = null,
    width = 50,
    align = AlignmentType.LEFT,
  } = opciones;

  return new TableCell({
    width: {
      size: width,
      type: WidthType.PERCENTAGE,
    },
    verticalAlign: VerticalAlign.CENTER,
    shading: fill
      ? {
          type: ShadingType.CLEAR,
          color: "auto",
          fill,
        }
      : undefined,
    margins: {
      top: 90,
      bottom: 90,
      left: 120,
      right: 120,
    },
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text: String(texto ?? ""),
            bold,
            color,
            size: 20,
          }),
        ],
      }),
    ],
  });
}

function tablaDocx(titulo, filas, colorTitulo = COLOR_AZUL) {
  const borders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
    left: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
    right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" },
  };

  return [
    new Paragraph({
      spacing: { before: 220, after: 90 },
      children: [
        new TextRun({
          text: titulo,
          bold: true,
          color: colorTitulo,
          size: 24,
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders,
      rows: filas.map(([etiqueta, contenido]) =>
        new TableRow({
          children: [
            celdaDocx(etiqueta, {
              bold: true,
              color: "334155",
              fill: "F8FAFC",
              width: 31,
            }),
            celdaDocx(valor(contenido), {
              color: "111827",
              width: 69,
            }),
          ],
        })
      ),
    }),
  ];
}

function crearSecciones(alumno, documentos, redes) {
  return [
    {
      titulo: "1. Datos del párvulo",
      color: COLOR_AZUL,
      filas: [
        ["Nombre", alumno.nombreParvulo],
        ["RUN", alumno.rutParvulo],
        ["Fecha de nacimiento", alumno.fechaNacimientoParvulo],
        ["Edad", alumno.edadParvulo],
        ["Domicilio", `${alumno.domicilioParvulo}, ${alumno.comunaParvulo}`],
        ["Con quién vive", alumno.conQuienVive],
        ["Observaciones", alumno.observacionesParvulo],
      ],
    },
    {
      titulo: "2. Datos escolares y matrícula",
      color: COLOR_AZUL,
      filas: [
        ["Año escolar", alumno.anioEscolar],
        ["Nivel", alumno.nivel],
        ["Jornada", alumno.jornada],
        ["Fecha de matrícula", alumno.fechaMatricula],
        ["Estado", alumno.estado],
      ],
    },
    {
      titulo: "3. Datos familiares",
      color: COLOR_AZUL,
      filas: [
        ["Nombre padre", alumno.nombrePadre],
        ["RUN padre", alumno.rutPadre],
        ["Fecha nacimiento padre", alumno.fechaNacimientoPadre],
        ["Teléfono padre", alumno.telefonoPadre],
        ["Escolaridad padre", alumno.escolaridadPadre],
        ["Actividad padre", alumno.actividadPadre],
        ["Nombre madre", alumno.nombreMadre],
        ["RUN madre", alumno.rutMadre],
        ["Fecha nacimiento madre", alumno.fechaNacimientoMadre],
        ["Teléfono madre", alumno.telefonoMadre],
        ["Escolaridad madre", alumno.escolaridadMadre],
        ["Actividad madre", alumno.actividadMadre],
      ],
    },
    {
      titulo: "4. Apoderado titular",
      color: COLOR_AZUL,
      filas: [
        ["Nombre", alumno.nombreApoderado],
        ["RUN", alumno.rutApoderado],
        ["Parentesco", alumno.parentescoApoderado],
        ["Teléfono", alumno.telefonoApoderado],
        ["Email", alumno.emailApoderado],
        ["Dirección", alumno.direccionApoderado],
      ],
    },
    {
      titulo: "5. Salud complementaria",
      color: COLOR_ROJO,
      filas: [
        ["Alergias / enfermedades", alumno.alergiasEnfermedades],
        ["Alergias", alumno.alergias],
        ["Condiciones de salud", alumno.enfermedades],
        ["Medicamentos", alumno.medicamentos],
        ["Observaciones de salud", alumno.observacionesSalud],
      ],
    },
    {
      titulo: "6. Neurodesarrollo y apoyos educativos",
      color: COLOR_AZUL,
      filas: [
        ["Estado", alumno.neurodesarrolloEstado],
        ["Diagnóstico informado", alumno.neurodesarrolloDiagnostico],
        ["Profesional que acredita", alumno.neurodesarrolloProfesional],
        ["Especialidad", alumno.neurodesarrolloEspecialidad],
        ["Fecha de informe", alumno.neurodesarrolloFechaInforme],
        ["Institución o centro emisor", alumno.neurodesarrolloInstitucion],
        ["Participó anteriormente en PIE", alumno.participoPieAnterior],
        ["Establecimiento anterior con PIE", alumno.establecimientoPieAnterior],
        ["Apoyos recibidos", alumno.apoyosRecibidos],
        ["Requiere apoyos en aula", alumno.requiereApoyosAula],
        ["Adecuaciones sugeridas", alumno.adecuacionesSugeridas],
        ["Observaciones para el equipo educativo", alumno.observacionesNeurodesarrollo],
      ],
    },
    {
      titulo: "7. Autorización de imagen",
      color: COLOR_VERDE,
      filas: [
        ["Autoriza uso de imagen", alumno.autorizaImagen],
        ...redes.map((red) => [red.nombre, red.activo ? "Autorizado" : "No autorizado"]),
        ["Nombre de quien autoriza", alumno.nombreAutorizaImagen],
        ["RUN de quien autoriza", alumno.rutAutorizaImagen],
        ["Firma", alumno.firmaAutorizaImagen],
      ],
    },
    {
      titulo: "8. Personas autorizadas para retirar",
      color: COLOR_VERDE,
      filas: alumno.autorizadosRetiro.map((persona, index) => [
        `Autorizado ${index + 1}`,
        `${persona.nombre} · RUN ${persona.run} · ${persona.parentesco} · ${persona.telefono}`,
      ]),
    },
    {
      titulo: "9. Documentación recibida",
      color: COLOR_VERDE,
      filas: [
        ...documentos.map((doc) => [doc.nombre, doc.recibido ? "Recibido" : "Pendiente"]),
        ["Otros documentos", alumno.otrosDocumentos],
      ],
    },
    {
      titulo: "10. Observaciones internas",
      color: COLOR_AZUL,
      filas: [["Registro", alumno.observacionesInternas]],
    },
  ];
}

function generarHtmlFicha(alumno, documentos, redes) {
  const secciones = crearSecciones(alumno, documentos, redes);

  return `
    <div class="ficha-export">
      <style>
        .ficha-export {
          width: 760px;
          box-sizing: border-box;
          background: #ffffff;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
          padding: 24px;
          line-height: 1.35;
        }
        .export-header {
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 18px;
        }
        .export-bar {
          height: 9px;
          background: linear-gradient(90deg, #bfd64a 0%, #bfd64a 68%, #e11d2e 68%, #e11d2e 100%);
        }
        .export-header-inner {
          display: grid;
          grid-template-columns: 92px 1fr 86px;
          gap: 14px;
          align-items: center;
          padding: 16px 18px;
        }
        .export-logo {
          width: 82px;
          height: 82px;
          object-fit: contain;
        }
        .export-title {
          text-align: center;
        }
        .export-title h1 {
          margin: 0;
          font-size: 21px;
          color: #315f3c;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .export-title h2 {
          margin: 4px 0 0;
          font-size: 15px;
          color: #0f172a;
          text-transform: uppercase;
        }
        .export-title p {
          margin: 8px 0 0;
          font-size: 10.5px;
          color: #475569;
          font-weight: 600;
        }
        .export-year {
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          text-align: center;
          padding: 10px 0;
        }
        .export-year span {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
        }
        .export-year strong {
          display: block;
          font-size: 19px;
          color: #0f172a;
        }
        .student-box {
          border: 1px solid #cbd5e1;
          border-left: 6px solid #bfd64a;
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 14px;
        }
        .student-box h3 {
          margin: 0;
          font-size: 17px;
          color: #0f172a;
        }
        .student-box p {
          margin: 5px 0 0;
          font-size: 11px;
          color: #475569;
        }
        .section {
          border: 1px solid #cbd5e1;
          border-left: 5px solid #1e3a8a;
          border-radius: 10px;
          margin: 12px 0;
          overflow: hidden;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .section-title {
          background: #f8fafc;
          padding: 8px 11px;
          font-size: 13px;
          font-weight: 800;
          color: #1e3a8a;
          border-bottom: 1px solid #e2e8f0;
        }
        .section-title.red { color: #b91c1c; }
        .section-title.green { color: #315f3c; }
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }
        .info-table td {
          border-bottom: 1px solid #eef2f7;
          padding: 6px 9px;
          font-size: 10.5px;
          vertical-align: top;
        }
        .info-table tr:last-child td {
          border-bottom: none;
        }
        .label {
          width: 32%;
          background: #fbfdff;
          color: #334155;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 9px !important;
          letter-spacing: .035em;
        }
        .value {
          color: #111827;
          font-weight: 500;
        }
        .notice {
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          color: #1e3a8a;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 10.5px;
          margin: 12px 0;
        }
        .firmas {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          margin-top: 42px;
          page-break-inside: avoid;
        }
        .firma {
          text-align: center;
          border-top: 1px solid #111827;
          padding-top: 7px;
          font-size: 11px;
          font-weight: 700;
        }
        .footer {
          margin-top: 18px;
          font-size: 9.5px;
          color: #64748b;
          text-align: center;
        }
      </style>

      <div class="export-header">
        <div class="export-bar"></div>
        <div class="export-header-inner">
          <img class="export-logo" src="${LOGO_URL}" alt="Logo Italito" />
          <div class="export-title">
            <h1>Escuela de Párvulos Italito</h1>
            <h2>Ficha de matrícula y antecedentes del párvulo</h2>
            <p>Documento interno de gestión escolar · Información reservada para fines educativos, administrativos y de acompañamiento.</p>
          </div>
          <div class="export-year">
            <span>Año</span>
            <strong>${alumno.anioEscolar}</strong>
          </div>
        </div>
      </div>

      <div class="student-box">
        <h3>${alumno.nombreParvulo}</h3>
        <p><strong>RUN:</strong> ${alumno.rutParvulo} · <strong>Nivel:</strong> ${alumno.nivel} · <strong>Jornada:</strong> ${alumno.jornada} · <strong>Estado:</strong> ${alumno.estado}</p>
      </div>

      ${secciones
        .map((seccion) => {
          const clase = seccion.color === COLOR_ROJO ? "red" : seccion.color === COLOR_VERDE ? "green" : "";
          const borderColor = seccion.color === COLOR_ROJO ? "#e11d2e" : seccion.color === COLOR_VERDE ? "#bfd64a" : "#1e3a8a";
          return `
            <div class="section" style="border-left-color:${borderColor}">
              <div class="section-title ${clase}">${seccion.titulo}</div>
              ${seccion.titulo.includes("Neurodesarrollo") ? `<div class="notice">Esta información no se registra como enfermedad. Su finalidad es orientar apoyos pedagógicos, inclusión, bienestar y acompañamiento educativo.</div>` : ""}
              <table class="info-table">
                <tbody>
                  ${seccion.filas
                    .map(
                      ([etiqueta, contenido]) => `
                        <tr>
                          <td class="label">${etiqueta}</td>
                          <td class="value">${valor(contenido)}</td>
                        </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>`;
        })
        .join("")}

      <div class="notice">
        Los antecedentes de neurodesarrollo deben utilizarse únicamente para favorecer la inclusión, adaptación, participación y bienestar del párvulo. No deben presentarse como enfermedad ni utilizarse como rótulo del estudiante.
      </div>

      <div class="firmas">
        <div class="firma">Firma Apoderado/a</div>
        <div class="firma">Firma y timbre establecimiento</div>
      </div>

      <div class="footer">
        Escuela de Párvulos Italito · Ficha generada desde Italito Gestión Escolar
      </div>
    </div>
  `;
}

function DatosPersonalesAlumno() {
  const alumno = {
    nombreParvulo: "Martina Ignacia González Pérez",
    rutParvulo: "24.345.678-9",
    fechaNacimientoParvulo: "2021-05-14",
    edadParvulo: "4 años",
    domicilioParvulo: "Los Aromos 123",
    comunaParvulo: "Limache",
    alergiasEnfermedades: "No registra alergias ni enfermedades declaradas.",
    conQuienVive: "Madre y padre",
    observacionesParvulo:
      "Ficha de ejemplo. Más adelante esta información vendrá desde Firebase.",

    anioEscolar: "2026",
    nivel: "Pre-Kínder",
    jornada: "Mañana",
    fechaMatricula: "2026-03-01",
    estado: "Activo",

    nombrePadre: "Felipe González Rojas",
    rutPadre: "12.345.678-9",
    fechaNacimientoPadre: "1988-04-12",
    telefonoPadre: "+56 9 8765 4321",
    escolaridadPadre: "Enseñanza Media Completa",
    actividadPadre: "Trabajador dependiente",

    nombreMadre: "Carolina Pérez Morales",
    rutMadre: "13.456.789-0",
    fechaNacimientoMadre: "1990-08-22",
    telefonoMadre: "+56 9 1234 5678",
    escolaridadMadre: "Técnico Profesional",
    actividadMadre: "Administrativa",

    nombreApoderado: "Carolina Pérez Morales",
    rutApoderado: "13.456.789-0",
    parentescoApoderado: "Madre",
    telefonoApoderado: "+56 9 1234 5678",
    emailApoderado: "carolina@gmail.com",
    direccionApoderado: "Los Aromos 123, Limache",

    autorizaImagen: "Sí",
    autorizaInstagram: true,
    autorizaFacebook: true,
    autorizaTelegram: true,
    nombreAutorizaImagen: "Carolina Pérez Morales",
    rutAutorizaImagen: "13.456.789-0",
    firmaAutorizaImagen: "Pendiente de firma física",

    autorizadosRetiro: [
      {
        nombre: "Felipe González Rojas",
        run: "12.345.678-9",
        parentesco: "Padre",
        telefono: "+56 9 8765 4321",
      },
      {
        nombre: "María Morales Soto",
        run: "9.876.543-2",
        parentesco: "Abuela",
        telefono: "+56 9 5555 4444",
      },
      {
        nombre: "Javiera González Pérez",
        run: "18.765.432-1",
        parentesco: "Tía",
        telefono: "+56 9 3333 2222",
      },
    ],

    alergias: "No registradas",
    enfermedades: "No registradas",
    medicamentos: "No registra medicamentos permanentes.",
    observacionesSalud: "Sin observaciones relevantes.",

    neurodesarrolloEstado: "En evaluación",
    neurodesarrolloDiagnostico:
      "Antecedente de neurodesarrollo informado por la familia",
    neurodesarrolloProfesional: "Dra. Andrea Morales",
    neurodesarrolloEspecialidad: "Neuróloga infantil",
    neurodesarrolloFechaInforme: "2025-11-18",
    neurodesarrolloInstitucion: "Centro Médico Infantil Los Andes",
    participoPieAnterior: "Sí",
    establecimientoPieAnterior: "Jardín Infantil Rayito de Sol",
    apoyosRecibidos:
      "Apoyo fonoaudiológico, acompañamiento en aula y seguimiento con educadora diferencial.",
    requiereApoyosAula: "Por evaluar",
    adecuacionesSugeridas:
      "Favorecer anticipación de rutinas, instrucciones breves, apoyo visual y espacios de calma cuando sea necesario.",
    observacionesNeurodesarrollo:
      "Información reservada para acompañamiento educativo. No debe utilizarse como etiqueta del párvulo, sino como antecedente para apoyar su bienestar, participación y aprendizaje.",

    documentos: {
      certificadoNacimiento: true,
      carnetVacunas: true,
      autorizacionImagenDocumento: false,
      informePie: false,
      informeNeurodesarrollo: true,
    },

    otrosDocumentos: "No registra otros documentos.",
    observacionesInternas:
      "Vista de consulta basada en la ficha madre institucional. Luego cargará los datos reales del alumno seleccionado.",
  };

  const documentos = [
    {
      nombre: "Certificado de nacimiento",
      recibido: alumno.documentos.certificadoNacimiento,
    },
    {
      nombre: "Carnet de vacunas",
      recibido: alumno.documentos.carnetVacunas,
    },
    {
      nombre: "Autorización de imagen",
      recibido: alumno.documentos.autorizacionImagenDocumento,
    },
    {
      nombre: "Informe PIE / apoyo",
      recibido: alumno.documentos.informePie,
    },
    {
      nombre: "Informe de neurodesarrollo",
      recibido: alumno.documentos.informeNeurodesarrollo,
    },
  ];

  const redes = [
    {
      nombre: "Instagram",
      activo: alumno.autorizaInstagram,
    },
    {
      nombre: "Facebook",
      activo: alumno.autorizaFacebook,
    },
    {
      nombre: "Telegram",
      activo: alumno.autorizaTelegram,
    },
  ];

  const tieneAntecedenteNeurodesarrollo =
    alumno.neurodesarrolloEstado === "Sí" ||
    alumno.neurodesarrolloEstado === "En evaluación";

  const secciones = crearSecciones(alumno, documentos, redes);
  const nombreArchivo = `ficha_${limpiarNombreArchivo(alumno.nombreParvulo)}_${alumno.anioEscolar}`;

  const imprimirFicha = () => {
    window.print();
  };

  const descargarWord = async () => {
    try {
      const logo = await obtenerLogoArrayBuffer();
      const children = [];

      if (logo) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                type: "png",
                data: logo,
                transformation: {
                  width: 78,
                  height: 78,
                },
              }),
            ],
          })
        );
      }

      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: "ESCUELA DE PÁRVULOS ITALITO",
              bold: true,
              color: COLOR_VERDE,
              size: 30,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: `FICHA DE MATRÍCULA Y ANTECEDENTES DEL PÁRVULO ${alumno.anioEscolar}`,
              bold: true,
              color: "111827",
              size: 24,
            }),
          ],
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
            left: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
            right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDE },
          },
          rows: [
            new TableRow({
              children: [
                celdaDocx("Alumno/a", { bold: true, fill: "F8FAFC", width: 24 }),
                celdaDocx(alumno.nombreParvulo, { bold: true, width: 42 }),
                celdaDocx("RUN", { bold: true, fill: "F8FAFC", width: 12 }),
                celdaDocx(alumno.rutParvulo, { width: 22 }),
              ],
            }),
            new TableRow({
              children: [
                celdaDocx("Nivel", { bold: true, fill: "F8FAFC", width: 24 }),
                celdaDocx(alumno.nivel, { width: 42 }),
                celdaDocx("Jornada", { bold: true, fill: "F8FAFC", width: 12 }),
                celdaDocx(alumno.jornada, { width: 22 }),
              ],
            }),
          ],
        })
      );

      secciones.forEach((seccion) => {
        children.push(...tablaDocx(seccion.titulo, seccion.filas, seccion.color));
      });

      children.push(
        new Paragraph({
          spacing: { before: 240, after: 140 },
          children: [
            new TextRun({
              text: "Uso responsable de la información: ",
              bold: true,
              color: COLOR_AZUL,
              size: 21,
            }),
            new TextRun({
              text: "Los antecedentes de neurodesarrollo deben utilizarse únicamente para favorecer la inclusión, la adaptación, la participación y el bienestar del párvulo. No deben presentarse como enfermedad ni utilizarse como rótulo del estudiante.",
              size: 21,
            }),
          ],
        }),
        new Paragraph({ text: "", spacing: { before: 520 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "__________________________________          __________________________________",
              size: 21,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "Firma Apoderado/a                                    Firma y timbre establecimiento",
              bold: true,
              size: 20,
            }),
          ],
        })
      );

      const documento = new Document({
        creator: "Italito Gestión Escolar",
        title: `Ficha de matrícula ${alumno.nombreParvulo}`,
        description: "Ficha institucional del alumno",
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720,
                  right: 720,
                  bottom: 720,
                  left: 720,
                },
              },
            },
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(documento);
      saveAs(blob, `${nombreArchivo}.docx`);
    } catch (error) {
      console.error("Error al generar Word:", error);
      alert("No se pudo generar el Word. Revisa la consola para ver el detalle del error.");
    }
  };

  const descargarPDF = async () => {
    const contenedor = document.createElement("div");
    contenedor.innerHTML = generarHtmlFicha(alumno, documentos, redes);
    contenedor.style.position = "absolute";
    contenedor.style.left = "0";
    contenedor.style.top = `${window.scrollY}px`;
    contenedor.style.width = "760px";
    contenedor.style.background = "#ffffff";
    contenedor.style.zIndex = "999999";
    contenedor.style.pointerEvents = "none";
    contenedor.style.boxShadow = "0 0 0 99999px rgba(255,255,255,0.85)";
    document.body.appendChild(contenedor);

    try {
      const html2pdfWorker = html2pdf?.default || html2pdf;

      await Promise.all(
        Array.from(contenedor.querySelectorAll("img")).map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                })
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 250));

      await html2pdfWorker()
        .set({
          margin: [0.25, 0.25, 0.25, 0.25],
          filename: `${nombreArchivo}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: false,
            scrollX: 0,
            scrollY: 0,
          },
          jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "legacy"],
            avoid: [".section", ".export-header", ".student-box", ".firmas"],
          },
        })
        .from(contenedor.firstElementChild)
        .save();
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("No se pudo generar el PDF. Revisa la consola para ver el detalle del error.");
    } finally {
      document.body.removeChild(contenedor);
    }
  };

  return (
    <div className="datos-alumno-page">
      <style>{`
        .datos-alumno-page {
          width: 100%;
          min-height: 100vh;
          padding: 32px;
          box-sizing: border-box;
          color: #0f172a;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 32%),
            radial-gradient(circle at top right, rgba(14, 165, 233, 0.10), transparent 28%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
        }

        .datos-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          color: #2563eb;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
        }

        .datos-hero {
          display: grid;
          grid-template-columns: 1.4fr 0.6fr;
          gap: 22px;
          margin-bottom: 24px;
        }

        .datos-profile-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 30px;
          padding: 28px;
          box-shadow: 0 18px 46px rgba(15, 23, 42, 0.09);
          display: flex;
          gap: 22px;
          align-items: center;
        }

        .datos-avatar {
          width: 88px;
          height: 88px;
          border-radius: 28px;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          color: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 950;
          flex-shrink: 0;
          box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.10);
        }

        .datos-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.10);
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 850;
          margin-bottom: 12px;
        }

        .datos-profile-card h1 {
          margin: 0;
          font-size: 32px;
          line-height: 1.12;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .datos-profile-card p {
          margin: 10px 0 0;
          color: #64748b;
          line-height: 1.55;
          font-size: 14px;
        }

        .datos-status-card {
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: white;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 20px 52px rgba(15, 23, 42, 0.24);
          display: grid;
          align-content: space-between;
          gap: 16px;
        }

        .datos-status-card span {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 850;
          color: rgba(255,255,255,0.66);
        }

        .datos-status-card strong {
          display: block;
          margin-top: 6px;
          font-size: 25px;
          font-weight: 950;
          letter-spacing: -0.03em;
        }

        .datos-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          color: white;
          font-size: 13px;
          font-weight: 900;
        }

        .datos-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .datos-action-btn {
          min-height: 44px;
          padding: 0 15px;
          border-radius: 15px;
          border: 1px solid rgba(203, 213, 225, 0.9);
          background: white;
          color: #334155;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
          transition: all 0.2s ease;
          cursor: pointer;
          font-family: inherit;
        }

        .datos-action-btn.primary {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border-color: transparent;
        }

        .datos-action-btn.print {
          background: linear-gradient(135deg, #0f172a, #334155);
          color: white;
          border-color: transparent;
        }

        .datos-action-btn.word {
          background: linear-gradient(135deg, #315f3c, #4f7f3d);
          color: white;
          border-color: transparent;
        }

        .datos-action-btn.pdf {
          background: linear-gradient(135deg, #b91c1c, #e11d2e);
          color: white;
          border-color: transparent;
        }

        .datos-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
        }

        .datos-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .datos-section {
          background: rgba(255,255,255,0.93);
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 16px 42px rgba(15, 23, 42, 0.08);
        }

        .datos-section.full {
          grid-column: 1 / -1;
        }

        .datos-section.neuro-card {
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.10), transparent 30%),
            linear-gradient(135deg, #ffffff, #eff6ff);
          border-color: rgba(37, 99, 235, 0.18);
        }

        .datos-section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .datos-section-icon {
          width: 46px;
          height: 46px;
          border-radius: 17px;
          background: rgba(37, 99, 235, 0.10);
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .datos-section-icon.red {
          background: rgba(220, 38, 38, 0.10);
          color: #dc2626;
        }

        .datos-section-header h2 {
          margin: 0;
          font-size: 19px;
          font-weight: 950;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .datos-section-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.45;
        }

        .datos-list {
          display: grid;
          gap: 12px;
        }

        .datos-item {
          display: grid;
          grid-template-columns: 190px 1fr;
          gap: 12px;
          align-items: start;
          padding: 12px 0;
          border-bottom: 1px solid #eef2f7;
        }

        .datos-item:last-child {
          border-bottom: none;
        }

        .datos-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.045em;
        }

        .datos-value {
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.45;
        }

        .datos-contact-line {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .estado-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          width: fit-content;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.10);
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 900;
        }

        .alert-box {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 18px;
          border-radius: 20px;
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.22);
          color: #1e3a8a;
          margin-bottom: 20px;
        }

        .alert-box.warning {
          background: rgba(234, 179, 8, 0.10);
          border-color: rgba(234, 179, 8, 0.28);
          color: #713f12;
        }

        .alert-box strong {
          display: block;
          font-size: 15px;
          margin-bottom: 4px;
        }

        .alert-box p {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          font-weight: 700;
        }

        .documentos-grid,
        .redes-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }

        .redes-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .documento-card,
        .red-card {
          border-radius: 18px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid rgba(203, 213, 225, 0.95);
        }

        .documento-card.ok,
        .red-card.ok {
          background: rgba(22, 163, 74, 0.08);
          border-color: rgba(22, 163, 74, 0.25);
        }

        .documento-card.pendiente,
        .red-card.pendiente {
          background: rgba(234, 179, 8, 0.10);
          border-color: rgba(234, 179, 8, 0.28);
        }

        .documento-card strong,
        .red-card strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .documento-card span,
        .red-card span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 900;
        }

        .documento-card.ok span,
        .red-card.ok span {
          color: #15803d;
        }

        .documento-card.pendiente span,
        .red-card.pendiente span {
          color: #a16207;
        }

        .autorizados-table-wrap {
          overflow-x: auto;
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.95);
        }

        .autorizados-table {
          width: 100%;
          min-width: 850px;
          border-collapse: collapse;
          background: white;
        }

        .autorizados-table th {
          text-align: left;
          padding: 14px;
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 900;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .autorizados-table td {
          padding: 14px;
          border-bottom: 1px solid #eef2f7;
          font-size: 14px;
          font-weight: 750;
          color: #334155;
        }

        .autorizados-table tr:last-child td {
          border-bottom: none;
        }

        .print-header {
          display: none;
        }

        .datos-note {
          margin-top: 22px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: rgba(255,255,255,0.82);
          border-radius: 24px;
          padding: 22px;
          line-height: 1.6;
          font-size: 14px;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.20);
        }

        .datos-note strong {
          color: white;
        }

        @media print {
          @page {
            size: auto;
            margin: 14mm;
          }

          body * {
            visibility: hidden !important;
          }

          .datos-alumno-page,
          .datos-alumno-page * {
            visibility: visible !important;
          }

          .datos-alumno-page {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: auto;
            padding: 0 !important;
            background: white !important;
            color: #000 !important;
          }

          .print-header {
            display: block !important;
            visibility: visible !important;
            margin-bottom: 12px !important;
            border: 1px solid #cbd5e1 !important;
            background: white !important;
            page-break-inside: avoid;
          }

          .print-header-bar {
            height: 8px !important;
            background: linear-gradient(90deg, #bfd64a 0%, #bfd64a 68%, #e11d2e 68%, #e11d2e 100%) !important;
          }

          .print-header-content {
            display: grid !important;
            grid-template-columns: 82px 1fr 78px !important;
            align-items: center !important;
            gap: 14px !important;
            padding: 12px 16px !important;
          }

          .print-logo {
            width: 72px !important;
            height: 72px !important;
            object-fit: contain !important;
          }

          .print-title-block {
            text-align: center !important;
            color: #0f172a !important;
          }

          .print-title-block h2 {
            margin: 0 !important;
            font-size: 16px !important;
            line-height: 1.15 !important;
            font-weight: 950 !important;
            letter-spacing: 0.03em !important;
            text-transform: uppercase !important;
          }

          .print-title-block h3 {
            margin: 4px 0 0 !important;
            font-size: 12px !important;
            line-height: 1.2 !important;
            font-weight: 850 !important;
            color: #315f3c !important;
            text-transform: uppercase !important;
          }

          .print-title-block p {
            margin: 5px 0 0 !important;
            font-size: 9.5px !important;
            color: #475569 !important;
            font-weight: 700 !important;
          }

          .print-year-box {
            min-height: 54px !important;
            border-radius: 10px !important;
            border: 1px solid #cbd5e1 !important;
            display: grid !important;
            place-items: center !important;
            color: #0f172a !important;
          }

          .print-year-box span {
            display: block !important;
            font-size: 8px !important;
            color: #64748b !important;
            text-transform: uppercase !important;
            font-weight: 900 !important;
            letter-spacing: 0.06em !important;
          }

          .print-year-box strong {
            display: block !important;
            font-size: 16px !important;
            color: #0f172a !important;
            font-weight: 950 !important;
            line-height: 1 !important;
          }

          .datos-back-link,
          .datos-actions,
          .datos-note {
            display: none !important;
          }

          .datos-hero {
            display: block !important;
            margin-bottom: 14px !important;
          }

          .datos-profile-card,
          .datos-status-card,
          .datos-section {
            box-shadow: none !important;
            background: white !important;
            border: 1px solid #cbd5e1 !important;
            color: #000 !important;
          }

          .datos-profile-card {
            display: block !important;
            padding: 12px 14px !important;
            border-radius: 0 !important;
            border-left: 5px solid #bfd64a !important;
          }

          .datos-avatar,
          .datos-kicker,
          .datos-status-card,
          .datos-status-badge {
            display: none !important;
          }

          .datos-profile-card h1 {
            font-size: 20px !important;
            text-align: center !important;
            margin-bottom: 4px !important;
          }

          .datos-profile-card p {
            text-align: center !important;
            color: #334155 !important;
            font-size: 11px !important;
            margin: 0 !important;
          }

          .datos-grid {
            display: block !important;
          }

          .datos-section {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 10px !important;
            padding: 12px !important;
            border-radius: 0 !important;
            border-left: 4px solid #bfd64a !important;
          }

          .datos-section.neuro-card {
            border-left-color: #2563eb !important;
          }

          .datos-section-header {
            margin-bottom: 8px !important;
            padding-bottom: 6px !important;
            border-bottom: 1px solid #cbd5e1 !important;
          }

          .datos-section-icon {
            display: none !important;
          }

          .datos-section-header h2 {
            font-size: 13px !important;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #000 !important;
          }

          .datos-section-header p {
            display: none !important;
          }

          .datos-item {
            grid-template-columns: 145px 1fr !important;
            padding: 5px 0 !important;
            border-bottom: 1px solid #e5e7eb !important;
          }

          .datos-label {
            font-size: 9px !important;
            color: #334155 !important;
          }

          .datos-value {
            font-size: 10px !important;
            color: #000 !important;
            font-weight: 600 !important;
          }

          .documentos-grid,
          .redes-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }

          .documento-card,
          .red-card {
            padding: 8px !important;
            border-radius: 0 !important;
            background: white !important;
            border: 1px solid #cbd5e1 !important;
          }

          .documento-card strong,
          .red-card strong {
            font-size: 10px !important;
          }

          .documento-card span,
          .red-card span {
            font-size: 9px !important;
          }

          .alert-box {
            padding: 10px !important;
            border-radius: 0 !important;
            background: white !important;
            color: #000 !important;
            border: 1px solid #cbd5e1 !important;
          }

          .alert-box p,
          .alert-box strong {
            font-size: 10px !important;
            color: #000 !important;
          }

          .estado-pill {
            background: white !important;
            color: #000 !important;
            border: 1px solid #cbd5e1 !important;
            padding: 3px 7px !important;
            font-size: 9px !important;
          }

          .datos-contact-line {
            gap: 4px !important;
          }

          .autorizados-table {
            min-width: auto !important;
          }

          .autorizados-table th,
          .autorizados-table td {
            padding: 6px !important;
            font-size: 9px !important;
          }

          .datos-section.full:last-of-type::after {
            content: "Firma Apoderado/a: ____________________________        Firma Establecimiento: ____________________________";
            display: block;
            margin-top: 28px;
            padding-top: 20px;
            font-size: 11px;
            font-weight: 700;
            color: #000;
          }
        }

        @media (max-width: 1100px) {
          .datos-hero,
          .datos-grid {
            grid-template-columns: 1fr;
          }

          .documentos-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .redes-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .datos-alumno-page {
            padding: 22px;
          }

          .datos-profile-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .datos-profile-card h1 {
            font-size: 27px;
          }

          .datos-status-card,
          .datos-section {
            padding: 20px;
          }

          .datos-item {
            grid-template-columns: 1fr;
            gap: 4px;
          }

          .documentos-grid,
          .redes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="print-header" aria-hidden="true">
        <div className="print-header-bar" />
        <div className="print-header-content">
          <img
            className="print-logo"
            src={LOGO_URL}
            alt="Logo Escuela de Párvulos Italito"
          />

          <div className="print-title-block">
            <h2>Escuela de Párvulos Italito</h2>
            <h3>Ficha de matrícula y antecedentes del párvulo</h3>
            <p>
              Documento interno de gestión escolar · Información reservada para
              fines educativos, administrativos y de acompañamiento.
            </p>
          </div>

          <div className="print-year-box">
            <div>
              <span>Año</span>
              <strong>{alumno.anioEscolar}</strong>
            </div>
          </div>
        </div>
      </div>

      <Link to="/gestion/alumnos" className="datos-back-link">
        <ArrowLeft size={18} />
        Volver al módulo alumnos
      </Link>

      <section className="datos-hero">
        <article className="datos-profile-card">
          <div className="datos-avatar">
            {alumno.nivel === "Pre-Kínder" ? "PK" : "K"}
          </div>

          <div>
            <span className="datos-kicker">
              <UserRound size={16} />
              Ficha madre institucional
            </span>
            <h1>{alumno.nombreParvulo}</h1>
            <p>
              Vista general de la ficha madre del párvulo. Esta pantalla no crea
              alumnos nuevos; muestra la información registrada en la ficha de
              matrícula institucional.
            </p>
          </div>
        </article>

        <aside className="datos-status-card">
          <div>
            <span>Estado actual</span>
            <strong>{alumno.estado}</strong>
          </div>

          <div>
            <span>Nivel {alumno.anioEscolar}</span>
            <strong>{alumno.nivel}</strong>
          </div>

          <div className="datos-status-badge">
            <ShieldCheck size={17} />
            Ficha madre activa
          </div>
        </aside>
      </section>

      <div className="datos-actions">
        <button type="button" className="datos-action-btn print" onClick={imprimirFicha}>
          <Printer size={17} />
          Imprimir ficha
        </button>

        <button type="button" className="datos-action-btn word" onClick={descargarWord}>
          <Download size={17} />
          Descargar Word
        </button>

        <button type="button" className="datos-action-btn pdf" onClick={descargarPDF}>
          <FileText size={17} />
          Descargar PDF
        </button>

        <Link to="/gestion/alumnos/nuevo" className="datos-action-btn primary">
          <Pencil size={17} />
          Editar ficha madre
        </Link>

        <Link to="/gestion/alumnos/matricula" className="datos-action-btn">
          <School size={17} />
          Ver matrícula
        </Link>

        <Link to="/gestion/alumnos/salud" className="datos-action-btn">
          <HeartPulse size={17} />
          Ver salud
        </Link>

        <Link to="/gestion/alumnos/historial" className="datos-action-btn">
          <FileText size={17} />
          Ver historial
        </Link>
      </div>

      <main className="datos-grid">
        <section className="datos-section">
          <div className="datos-section-header">
            <div className="datos-section-icon">
              <UserRound size={24} />
            </div>
            <div>
              <h2>Datos del párvulo</h2>
              <p>Información principal del niño o niña.</p>
            </div>
          </div>

          <div className="datos-list">
            <div className="datos-item">
              <div className="datos-label">Nombre</div>
              <div className="datos-value">{alumno.nombreParvulo}</div>
            </div>

            <div className="datos-item">
              <div className="datos-label">RUN</div>
              <div className="datos-value">{alumno.rutParvulo}</div>
            </div>

            <div className="datos-item">
              <div className="datos-label">Nacimiento</div>
              <div className="datos-value">
                <span className="datos-contact-line">
                  <CalendarDays size={16} />
                  {alumno.fechaNacimientoParvulo} · {alumno.edadParvulo}
                </span>
              </div>
            </div>

            <div className="datos-item">
              <div className="datos-label">Domicilio</div>
              <div className="datos-value">
                <span className="datos-contact-line">
                  <MapPin size={16} />
                  {alumno.domicilioParvulo}, {alumno.comunaParvulo}
                </span>
              </div>
            </div>

            <div className="datos-item">
              <div className="datos-label">Con quién vive</div>
              <div className="datos-value">{alumno.conQuienVive}</div>
            </div>

            <div className="datos-item">
              <div className="datos-label">Observaciones</div>
              <div className="datos-value">{alumno.observacionesParvulo}</div>
            </div>
          </div>
        </section>

        <section className="datos-section">
          <div className="datos-section-header">
            <div className="datos-section-icon">
              <School size={24} />
            </div>
            <div>
              <h2>Datos escolares y matrícula</h2>
              <p>Información administrativa del ingreso.</p>
            </div>
          </div>

          <div className="datos-list">
            <div className="datos-item">
              <div className="datos-label">Año escolar</div>
              <div className="datos-value">{alumno.anioEscolar}</div>
            </div>

            <div className="datos-item">
              <div className="datos-label">Nivel</div>
              <div className="datos-value">{alumno.nivel}</div>
            </div>

            <div className="datos-item">
              <div className="datos-label">Jornada</div>
              <div className="datos-value">{alumno.jornada}</div>
            </div>

            <div className="datos-item">
              <div className="datos-label">Fecha matrícula</div>
              <div className="datos-value">{alumno.fechaMatricula}</div>
            </div>

            <div className="datos-item">
              <div className="datos-label">Estado</div>
              <div className="datos-value">{alumno.estado}</div>
            </div>
          </div>
        </section>

        <section className="datos-section">
          <div className="datos-section-header">
            <div className="datos-section-icon">
              <Users size={24} />
            </div>
            <div>
              <h2>Datos del padre</h2>
              <p>Antecedentes familiares registrados.</p>
            </div>
          </div>

          <div className="datos-list">
            <div className="datos-item">
              <div className="datos-label">Nombre</div>
              <div className="datos-value">{alumno.nombrePadre}</div>
            </div>
            <div className="datos-item">
              <div className="datos-label">RUN</div>
              <div className="datos-value">{alumno.rutPadre}</div>
            </div>
            <div className="datos-item">
              <div className="datos-label">Nacimiento</div>
              <div className="datos-value">{alumno.fechaNacimientoPadre}</div>
            </div>
            <div className="datos-item">
              <div className="datos-label">Teléfono</div>
              <div className="datos-value"><Phone size={16} /> {alumno.telefonoPadre}</div>
            </div>
            <div className="datos-item">
              <div className="datos-label">Escolaridad</div>
              <div className="datos-value">{alumno.escolaridadPadre}</div>
            </div>
            <div className="datos-item">
              <div className="datos-label">Actividad</div>
              <div className="datos-value">{alumno.actividadPadre}</div>
            </div>
          </div>
        </section>

        <section className="datos-section">
          <div className="datos-section-header">
            <div className="datos-section-icon">
              <Users size={24} />
            </div>
            <div>
              <h2>Datos de la madre</h2>
              <p>Antecedentes familiares registrados.</p>
            </div>
          </div>

          <div className="datos-list">
            <div className="datos-item"><div className="datos-label">Nombre</div><div className="datos-value">{alumno.nombreMadre}</div></div>
            <div className="datos-item"><div className="datos-label">RUN</div><div className="datos-value">{alumno.rutMadre}</div></div>
            <div className="datos-item"><div className="datos-label">Nacimiento</div><div className="datos-value">{alumno.fechaNacimientoMadre}</div></div>
            <div className="datos-item"><div className="datos-label">Teléfono</div><div className="datos-value"><Phone size={16} /> {alumno.telefonoMadre}</div></div>
            <div className="datos-item"><div className="datos-label">Escolaridad</div><div className="datos-value">{alumno.escolaridadMadre}</div></div>
            <div className="datos-item"><div className="datos-label">Actividad</div><div className="datos-value">{alumno.actividadMadre}</div></div>
          </div>
        </section>

        <section className="datos-section">
          <div className="datos-section-header">
            <div className="datos-section-icon"><ShieldCheck size={24} /></div>
            <div><h2>Apoderado titular</h2><p>Responsable ante el establecimiento.</p></div>
          </div>
          <div className="datos-list">
            <div className="datos-item"><div className="datos-label">Nombre</div><div className="datos-value">{alumno.nombreApoderado}</div></div>
            <div className="datos-item"><div className="datos-label">RUN</div><div className="datos-value">{alumno.rutApoderado}</div></div>
            <div className="datos-item"><div className="datos-label">Parentesco</div><div className="datos-value">{alumno.parentescoApoderado}</div></div>
            <div className="datos-item"><div className="datos-label">Teléfono</div><div className="datos-value"><Phone size={16} /> {alumno.telefonoApoderado}</div></div>
            <div className="datos-item"><div className="datos-label">Email</div><div className="datos-value"><Mail size={16} /> {alumno.emailApoderado}</div></div>
            <div className="datos-item"><div className="datos-label">Dirección</div><div className="datos-value">{alumno.direccionApoderado}</div></div>
          </div>
        </section>

        <section className="datos-section">
          <div className="datos-section-header">
            <div className="datos-section-icon red"><HeartPulse size={24} /></div>
            <div><h2>Salud del párvulo</h2><p>Antecedentes declarados por la familia.</p></div>
          </div>
          <div className="datos-list">
            <div className="datos-item"><div className="datos-label">Alergias/enfermedades</div><div className="datos-value">{alumno.alergiasEnfermedades}</div></div>
            <div className="datos-item"><div className="datos-label">Alergias</div><div className="datos-value">{alumno.alergias}</div></div>
            <div className="datos-item"><div className="datos-label">Condiciones de salud</div><div className="datos-value">{alumno.enfermedades}</div></div>
            <div className="datos-item"><div className="datos-label">Medicamentos</div><div className="datos-value">{alumno.medicamentos}</div></div>
            <div className="datos-item"><div className="datos-label">Observaciones</div><div className="datos-value">{alumno.observacionesSalud}</div></div>
          </div>
        </section>

        <section className="datos-section full neuro-card">
          <div className="datos-section-header">
            <div className="datos-section-icon"><Brain size={24} /></div>
            <div>
              <h2>Neurodesarrollo y apoyos educativos</h2>
              <p>Antecedentes informados por la familia para favorecer el acompañamiento pedagógico, la inclusión y el bienestar del párvulo.</p>
            </div>
          </div>

          <div className={tieneAntecedenteNeurodesarrollo ? "alert-box" : "alert-box warning"}>
            <Brain size={24} />
            <div>
              <strong>{tieneAntecedenteNeurodesarrollo ? "Antecedente de neurodesarrollo informado" : "Sin antecedente de neurodesarrollo informado"}</strong>
              <p>Esta información tiene finalidad educativa y de acompañamiento. No debe utilizarse como etiqueta del estudiante.</p>
            </div>
          </div>

          <div className="datos-grid">
            <div className="datos-list">
              <div className="datos-item"><div className="datos-label">Estado</div><div className="datos-value"><span className="estado-pill"><Brain size={15} /> {alumno.neurodesarrolloEstado}</span></div></div>
              <div className="datos-item"><div className="datos-label">Diagnóstico informado</div><div className="datos-value">{alumno.neurodesarrolloDiagnostico}</div></div>
              <div className="datos-item"><div className="datos-label">Profesional acredita</div><div className="datos-value"><Stethoscope size={16} /> {alumno.neurodesarrolloProfesional}</div></div>
              <div className="datos-item"><div className="datos-label">Especialidad</div><div className="datos-value">{alumno.neurodesarrolloEspecialidad}</div></div>
              <div className="datos-item"><div className="datos-label">Fecha informe</div><div className="datos-value">{alumno.neurodesarrolloFechaInforme}</div></div>
              <div className="datos-item"><div className="datos-label">Centro emisor</div><div className="datos-value">{alumno.neurodesarrolloInstitucion}</div></div>
            </div>
            <div className="datos-list">
              <div className="datos-item"><div className="datos-label">PIE anterior</div><div className="datos-value"><GraduationCap size={16} /> {alumno.participoPieAnterior}</div></div>
              <div className="datos-item"><div className="datos-label">Establecimiento PIE</div><div className="datos-value">{alumno.establecimientoPieAnterior}</div></div>
              <div className="datos-item"><div className="datos-label">Apoyos recibidos</div><div className="datos-value">{alumno.apoyosRecibidos}</div></div>
              <div className="datos-item"><div className="datos-label">Apoyos en aula</div><div className="datos-value">{alumno.requiereApoyosAula}</div></div>
              <div className="datos-item"><div className="datos-label">Adecuaciones sugeridas</div><div className="datos-value">{alumno.adecuacionesSugeridas}</div></div>
              <div className="datos-item"><div className="datos-label">Observaciones equipo</div><div className="datos-value">{alumno.observacionesNeurodesarrollo}</div></div>
            </div>
          </div>
        </section>

        <section className="datos-section full">
          <div className="datos-section-header"><div className="datos-section-icon"><Camera size={24} /></div><div><h2>Autorización de fotos y videos</h2><p>Uso de imagen en redes sociales oficiales.</p></div></div>
          <div className="datos-grid">
            <div className="datos-list">
              <div className="datos-item"><div className="datos-label">Autoriza</div><div className="datos-value">{alumno.autorizaImagen}</div></div>
              <div className="datos-item"><div className="datos-label">Nombre</div><div className="datos-value">{alumno.nombreAutorizaImagen}</div></div>
              <div className="datos-item"><div className="datos-label">RUN</div><div className="datos-value">{alumno.rutAutorizaImagen}</div></div>
              <div className="datos-item"><div className="datos-label">Firma</div><div className="datos-value">{alumno.firmaAutorizaImagen}</div></div>
            </div>
            <div className="redes-grid">
              {redes.map((red) => (
                <article key={red.nombre} className={red.activo ? "red-card ok" : "red-card pendiente"}>
                  <strong>{red.nombre}</strong>
                  <span>{red.activo ? <><CheckCircle2 size={15} /> Autorizada</> : <><AlertTriangle size={15} /> No autorizada</>}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="datos-section full">
          <div className="datos-section-header"><div className="datos-section-icon"><Users size={24} /></div><div><h2>Personas autorizadas para retirar</h2><p>Personas declaradas por el apoderado.</p></div></div>
          <div className="autorizados-table-wrap">
            <table className="autorizados-table">
              <thead><tr><th>N°</th><th>Nombre</th><th>RUN</th><th>Parentesco</th><th>Teléfono</th></tr></thead>
              <tbody>{alumno.autorizadosRetiro.map((persona, index) => (<tr key={index}><td>{index + 1}</td><td>{persona.nombre}</td><td>{persona.run}</td><td>{persona.parentesco}</td><td>{persona.telefono}</td></tr>))}</tbody>
            </table>
          </div>
        </section>

        <section className="datos-section full">
          <div className="datos-section-header"><div className="datos-section-icon"><FileText size={24} /></div><div><h2>Documentación recibida</h2><p>Control documental asociado a la matrícula.</p></div></div>
          <div className="documentos-grid">
            {documentos.map((doc) => (
              <article key={doc.nombre} className={doc.recibido ? "documento-card ok" : "documento-card pendiente"}>
                <strong>{doc.nombre}</strong>
                <span>{doc.recibido ? <><CheckCircle2 size={15} /> Recibido</> : <><AlertTriangle size={15} /> Pendiente</>}</span>
              </article>
            ))}
          </div>
          <div className="datos-list" style={{ marginTop: "18px" }}>
            <div className="datos-item"><div className="datos-label">Otros documentos</div><div className="datos-value">{alumno.otrosDocumentos}</div></div>
          </div>
        </section>

        <section className="datos-section full">
          <div className="datos-section-header"><div className="datos-section-icon"><FileCheck2 size={24} /></div><div><h2>Uso responsable de la información</h2><p>Consideraciones internas para el equipo educativo.</p></div></div>
          <div className="alert-box">
            <FileCheck2 size={24} />
            <div>
              <strong>Información reservada para acompañamiento</strong>
              <p>Los antecedentes de neurodesarrollo deben utilizarse únicamente para favorecer la inclusión, la adaptación, la participación y el bienestar del párvulo. No deben presentarse como enfermedad ni utilizarse como rótulo del estudiante.</p>
            </div>
          </div>
        </section>

        <section className="datos-section full">
          <div className="datos-section-header"><div className="datos-section-icon"><ClipboardList size={24} /></div><div><h2>Observaciones internas</h2><p>Información administrativa de uso interno.</p></div></div>
          <div className="datos-list"><div className="datos-item"><div className="datos-label">Registro</div><div className="datos-value">{alumno.observacionesInternas}</div></div></div>
        </section>
      </main>

      <section className="datos-note">
        <strong>Importante:</strong> esta pantalla debe alimentarse desde la
        ficha madre creada en <strong>NuevaFichaAlumno.jsx</strong>. Cuando
        conectemos Firebase, los datos de ejemplo se reemplazarán por el alumno
        seleccionado desde <strong>BaseAlumnos.jsx</strong>.
      </section>
    </div>
  );
}

export default DatosPersonalesAlumno;
