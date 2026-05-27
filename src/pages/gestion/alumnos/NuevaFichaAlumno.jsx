import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UserRound,
  School,
  Users,
  HeartPulse,
  ClipboardList,
  Camera,
  ShieldCheck,
  Brain,
  FileCheck2,
} from "lucide-react";

import {
  db,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "../../../firebase";

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return "";

  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  if (Number.isNaN(edad) || edad < 0) return "";
  return edad;
}

const formularioInicial = {
  nombreParvulo: "",
  rutParvulo: "",
  fechaNacimientoParvulo: "",
  domicilioParvulo: "",
  comunaParvulo: "",
  alergiasEnfermedades: "",
  conQuienVive: "",
  observacionesParvulo: "",

  anioEscolar: "2026",
  nivel: "Pre-Kínder",
  jornada: "Mañana",
  fechaMatricula: "",
  estado: "Activo",

  nombrePadre: "",
  rutPadre: "",
  fechaNacimientoPadre: "",
  telefonoPadre: "",
  escolaridadPadre: "",
  actividadPadre: "",

  nombreMadre: "",
  rutMadre: "",
  fechaNacimientoMadre: "",
  telefonoMadre: "",
  escolaridadMadre: "",
  actividadMadre: "",

  nombreApoderado: "",
  rutApoderado: "",
  parentescoApoderado: "",
  telefonoApoderado: "",
  emailApoderado: "",
  direccionApoderado: "",

  autorizaImagen: "Sí",
  autorizaInstagram: true,
  autorizaFacebook: true,
  autorizaTelegram: true,
  nombreAutorizaImagen: "",
  rutAutorizaImagen: "",
  firmaAutorizaImagen: "",

  autorizadosRetiro: [
    { nombre: "", run: "", parentesco: "", telefono: "" },
    { nombre: "", run: "", parentesco: "", telefono: "" },
    { nombre: "", run: "", parentesco: "", telefono: "" },
  ],

  alergias: "",
  enfermedades: "",
  medicamentos: "",
  observacionesSalud: "",

  neurodesarrolloEstado: "No informado",
  neurodesarrolloDiagnostico: "",
  neurodesarrolloProfesional: "",
  neurodesarrolloEspecialidad: "",
  neurodesarrolloFechaInforme: "",
  neurodesarrolloInstitucion: "",
  participoPieAnterior: "No informado",
  establecimientoPieAnterior: "",
  apoyosRecibidos: "",
  requiereApoyosAula: "No informado",
  adecuacionesSugeridas: "",
  observacionesNeurodesarrollo: "",

  certificadoNacimiento: false,
  carnetVacunas: false,
  autorizacionImagenDocumento: false,
  informePie: false,
  informeNeurodesarrollo: false,
  otrosDocumentos: "",

  observacionesInternas: "",
};

function NuevaFichaAlumno() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const alumnoId = searchParams.get("id");

  const [formulario, setFormulario] = useState(formularioInicial);
  const [cargando, setCargando] = useState(false);
  const [cargandoAlumno, setCargandoAlumno] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const edadParvulo = useMemo(
    () => calcularEdad(formulario.fechaNacimientoParvulo),
    [formulario.fechaNacimientoParvulo]
  );

  useEffect(() => {
    const cargarAlumnoParaEditar = async () => {
      if (!alumnoId) return;

      try {
        setCargandoAlumno(true);
        setError("");

        const alumnoRef = doc(db, "alumnos", alumnoId);
        const alumnoSnap = await getDoc(alumnoRef);

        if (!alumnoSnap.exists()) {
          setError("No se encontró el alumno seleccionado para editar.");
          return;
        }

        const datos = alumnoSnap.data();

        setFormulario({
          ...formularioInicial,
          ...(datos.fichaCompleta || {}),
          nombreParvulo: datos.nombreParvulo || datos.nombreCompleto || "",
          rutParvulo: datos.rutParvulo || datos.rut || "",
          fechaNacimientoParvulo:
            datos.fechaNacimientoParvulo || datos.fechaNacimiento || "",
          domicilioParvulo: datos.domicilioParvulo || datos.domicilio || "",
          comunaParvulo: datos.comunaParvulo || "",
          alergiasEnfermedades: datos.alergiasEnfermedades || "",
          conQuienVive: datos.conQuienVive || "",
          observacionesParvulo: datos.observacionesParvulo || "",
          anioEscolar: String(datos.anioEscolar || 2026),
          nivel: datos.nivel || "Pre-Kínder",
          jornada: datos.jornada || "Mañana",
          fechaMatricula: datos.fechaMatricula || "",
          estado: datos.estado || "Activo",
          nombreApoderado:
            datos.nombreApoderado || datos.apoderadoTitular || "",
          rutApoderado: datos.rutApoderado || "",
          telefonoApoderado: datos.telefonoApoderado || datos.telefono || "",
          emailApoderado: datos.emailApoderado || datos.correoApoderado || "",
        });
      } catch (err) {
        console.error("Error al cargar alumno:", err);
        setError("No se pudo cargar la ficha del alumno.");
      } finally {
        setCargandoAlumno(false);
      }
    };

    cargarAlumnoParaEditar();
  }, [alumnoId]);

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const actualizarAutorizadoRetiro = (index, campo, valor) => {
    setFormulario((prev) => {
      const copia = [...prev.autorizadosRetiro];

      copia[index] = {
        ...copia[index],
        [campo]: valor,
      };

      return {
        ...prev,
        autorizadosRetiro: copia,
      };
    });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!formulario.nombreParvulo.trim()) {
      setError("Debes ingresar el nombre del párvulo.");
      return;
    }

    if (!formulario.rutParvulo.trim()) {
      setError("Debes ingresar el RUT del párvulo.");
      return;
    }

    if (!formulario.nivel) {
      setError("Debes seleccionar el nivel del alumno.");
      return;
    }

    try {
      setCargando(true);

      const nombreCompleto = formulario.nombreParvulo.trim();
      const rutAlumno = formulario.rutParvulo.trim();

      const datosAlumno = {
        nombreCompleto,
        nombres: nombreCompleto,
        apellidos: "",
        rut: rutAlumno,
        rutParvulo: rutAlumno,
        nombreParvulo: nombreCompleto,

        fechaNacimiento: formulario.fechaNacimientoParvulo || "",
        fechaNacimientoParvulo: formulario.fechaNacimientoParvulo || "",
        edad: edadParvulo || "",

        nivel: formulario.nivel || "",
        jornada: formulario.jornada || "",
        anioEscolar: Number(formulario.anioEscolar) || 2026,
        fechaMatricula: formulario.fechaMatricula || "",
        estado: formulario.estado || "Activo",

        domicilio: formulario.domicilioParvulo || "",
        domicilioParvulo: formulario.domicilioParvulo || "",
        comunaParvulo: formulario.comunaParvulo || "",
        conQuienVive: formulario.conQuienVive || "",
        observacionesParvulo: formulario.observacionesParvulo || "",

        padre: {
          nombre: formulario.nombrePadre || "",
          rut: formulario.rutPadre || "",
          fechaNacimiento: formulario.fechaNacimientoPadre || "",
          telefono: formulario.telefonoPadre || "",
          escolaridad: formulario.escolaridadPadre || "",
          actividad: formulario.actividadPadre || "",
        },

        madre: {
          nombre: formulario.nombreMadre || "",
          rut: formulario.rutMadre || "",
          fechaNacimiento: formulario.fechaNacimientoMadre || "",
          telefono: formulario.telefonoMadre || "",
          escolaridad: formulario.escolaridadMadre || "",
          actividad: formulario.actividadMadre || "",
        },

        apoderadoTitular: formulario.nombreApoderado || "",
        nombreApoderado: formulario.nombreApoderado || "",
        rutApoderado: formulario.rutApoderado || "",
        parentescoApoderado: formulario.parentescoApoderado || "",
        telefonoApoderado: formulario.telefonoApoderado || "",
        telefono: formulario.telefonoApoderado || "",
        correoApoderado: formulario.emailApoderado || "",
        emailApoderado: formulario.emailApoderado || "",
        correo: formulario.emailApoderado || "",
        direccionApoderado: formulario.direccionApoderado || "",

        autorizacionImagen: {
          autorizaImagen: formulario.autorizaImagen || "Sí",
          autorizaInstagram: formulario.autorizaInstagram || false,
          autorizaFacebook: formulario.autorizaFacebook || false,
          autorizaTelegram: formulario.autorizaTelegram || false,
          nombreAutorizaImagen: formulario.nombreAutorizaImagen || "",
          rutAutorizaImagen: formulario.rutAutorizaImagen || "",
          firmaAutorizaImagen: formulario.firmaAutorizaImagen || "",
        },

        autorizadosRetiro: formulario.autorizadosRetiro || [],

        datosSalud: {
          alergiasEnfermedades: formulario.alergiasEnfermedades || "",
          alergias: formulario.alergias || "",
          enfermedades: formulario.enfermedades || "",
          medicamentos: formulario.medicamentos || "",
          observacionesSalud: formulario.observacionesSalud || "",
        },

        neurodesarrollo: {
          estado: formulario.neurodesarrolloEstado || "No informado",
          diagnostico: formulario.neurodesarrolloDiagnostico || "",
          profesional: formulario.neurodesarrolloProfesional || "",
          especialidad: formulario.neurodesarrolloEspecialidad || "",
          fechaInforme: formulario.neurodesarrolloFechaInforme || "",
          institucion: formulario.neurodesarrolloInstitucion || "",
          participoPieAnterior:
            formulario.participoPieAnterior || "No informado",
          establecimientoPieAnterior:
            formulario.establecimientoPieAnterior || "",
          apoyosRecibidos: formulario.apoyosRecibidos || "",
          requiereApoyosAula:
            formulario.requiereApoyosAula || "No informado",
          adecuacionesSugeridas: formulario.adecuacionesSugeridas || "",
          observaciones: formulario.observacionesNeurodesarrollo || "",
        },

        documentos: {
          certificadoNacimiento: formulario.certificadoNacimiento || false,
          carnetVacunas: formulario.carnetVacunas || false,
          autorizacionImagenDocumento:
            formulario.autorizacionImagenDocumento || false,
          informePie: formulario.informePie || false,
          informeNeurodesarrollo: formulario.informeNeurodesarrollo || false,
          otrosDocumentos: formulario.otrosDocumentos || "",
        },

        observacionesInternas: formulario.observacionesInternas || "",
        fichaCompleta: { ...formulario },
        actualizadoEn: serverTimestamp(),
      };

      if (alumnoId) {
        await updateDoc(doc(db, "alumnos", alumnoId), datosAlumno);
        setMensaje("Ficha actualizada correctamente.");
      } else {
        await addDoc(collection(db, "alumnos"), {
          ...datosAlumno,
          fechaRegistro: serverTimestamp(),
          creadoEn: serverTimestamp(),
        });
        setMensaje("Ficha guardada correctamente en Firebase.");
      }

      setTimeout(() => {
        navigate("/gestion/alumnos/base");
      }, 900);
    } catch (err) {
      console.error("Error al guardar ficha:", err);
      setError(
        "No se pudo guardar la ficha en Firebase. Revisa la conexión o las reglas de Firestore."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="nueva-ficha-page">
      <style>{`
        .nueva-ficha-page {
          width: 100%;
          min-height: 100vh;
          padding: 32px;
          box-sizing: border-box;
          color: #0f172a;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
        }

        .ficha-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          color: #2563eb;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
        }

        .ficha-hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 24px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(148, 163, 184, 0.26);
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 18px 46px rgba(15, 23, 42, 0.09);
          backdrop-filter: blur(14px);
        }

        .ficha-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.10);
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .ficha-hero h1 {
          margin: 0;
          font-size: 34px;
          line-height: 1.1;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .ficha-hero p {
          max-width: 820px;
          margin: 12px 0 0;
          color: #475569;
          line-height: 1.6;
          font-size: 15px;
        }

        .ficha-mini-card {
          min-width: 220px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: white;
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.22);
        }

        .ficha-mini-card span {
          display: block;
          font-size: 12px;
          font-weight: 800;
          color: rgba(255,255,255,0.68);
          margin-bottom: 6px;
        }

        .ficha-mini-card strong {
          display: block;
          font-size: 24px;
          font-weight: 950;
          letter-spacing: -0.03em;
        }

        .ficha-form {
          display: grid;
          gap: 22px;
        }

        .ficha-section {
          background: rgba(255,255,255,0.93);
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 16px 42px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .ficha-section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .ficha-section-icon {
          width: 48px;
          height: 48px;
          border-radius: 17px;
          background: rgba(37, 99, 235, 0.10);
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ficha-section-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 950;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .ficha-section-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .ficha-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .ficha-grid.two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .ficha-field {
          display: grid;
          gap: 7px;
        }

        .ficha-field.full {
          grid-column: 1 / -1;
        }

        .ficha-field label {
          font-size: 12px;
          font-weight: 900;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.045em;
        }

        .ficha-field input,
        .ficha-field select,
        .ficha-field textarea {
          width: 100%;
          min-height: 46px;
          border: 1px solid rgba(203, 213, 225, 0.95);
          border-radius: 15px;
          padding: 0 14px;
          font-size: 14px;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .ficha-field textarea {
          min-height: 96px;
          padding: 13px 14px;
          resize: vertical;
        }

        .ficha-field input:focus,
        .ficha-field select:focus,
        .ficha-field textarea:focus {
          background: white;
          border-color: rgba(37, 99, 235, 0.55);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.10);
        }

        .readonly-box {
          min-height: 46px;
          border: 1px solid rgba(203, 213, 225, 0.95);
          border-radius: 15px;
          padding: 0 14px;
          font-size: 14px;
          color: #334155;
          background: #eef2ff;
          display: flex;
          align-items: center;
          font-weight: 900;
        }

        .radio-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .radio-card,
        .check-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 52px;
          background: #f8fafc;
          border: 1px solid rgba(203, 213, 225, 0.95);
          border-radius: 16px;
          padding: 12px 14px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 850;
          color: #334155;
          transition: all 0.2s ease;
          user-select: none;
        }

        .radio-card input,
        .check-card input {
          width: 18px;
          height: 18px;
          accent-color: #2563eb;
        }

        .radio-card:hover,
        .check-card:hover {
          background: #eff6ff;
          border-color: rgba(37, 99, 235, 0.35);
        }

        .documentos-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .ficha-info-box {
          margin-bottom: 18px;
          padding: 16px;
          border-radius: 18px;
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.18);
          color: #1e3a8a;
          font-size: 13px;
          line-height: 1.55;
          font-weight: 750;
        }

        .autorizados-table-wrap {
          overflow-x: auto;
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.95);
        }

        .autorizados-table {
          width: 100%;
          min-width: 900px;
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
          padding: 12px;
          border-bottom: 1px solid #eef2f7;
        }

        .autorizados-table tr:last-child td {
          border-bottom: none;
        }

        .autorizados-table input {
          width: 100%;
          min-height: 42px;
          border: 1px solid rgba(203, 213, 225, 0.95);
          border-radius: 13px;
          padding: 0 12px;
          font-size: 14px;
          background: #f8fafc;
          outline: none;
          box-sizing: border-box;
        }

        .ficha-message {
          margin-bottom: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 850;
        }

        .ficha-message.ok {
          background: rgba(22, 163, 74, 0.10);
          color: #15803d;
          border: 1px solid rgba(22, 163, 74, 0.20);
        }

        .ficha-message.error {
          background: rgba(220, 38, 38, 0.10);
          color: #b91c1c;
          border: 1px solid rgba(220, 38, 38, 0.20);
        }

        .ficha-message.info {
          background: rgba(37, 99, 235, 0.10);
          color: #1d4ed8;
          border: 1px solid rgba(37, 99, 235, 0.20);
        }

        .ficha-actions {
          position: sticky;
          bottom: 18px;
          z-index: 5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background: rgba(15, 23, 42, 0.92);
          color: white;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 18px;
          box-shadow: 0 20px 52px rgba(15, 23, 42, 0.28);
          backdrop-filter: blur(14px);
        }

        .ficha-actions p {
          margin: 0;
          color: rgba(255,255,255,0.74);
          font-size: 13px;
          line-height: 1.5;
        }

        .ficha-actions strong {
          color: white;
        }

        .ficha-actions-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .btn-ficha {
          border: none;
          border-radius: 15px;
          min-height: 46px;
          padding: 0 18px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-ficha.primary {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          box-shadow: 0 14px 30px rgba(37, 99, 235, 0.25);
        }

        .btn-ficha.secondary {
          background: rgba(255,255,255,0.10);
          color: white;
          border: 1px solid rgba(255,255,255,0.16);
        }

        .btn-ficha:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-ficha:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        @media (max-width: 1200px) {
          .ficha-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .documentos-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .nueva-ficha-page {
            padding: 22px;
          }

          .ficha-hero {
            flex-direction: column;
            padding: 22px;
          }

          .ficha-hero h1 {
            font-size: 28px;
          }

          .ficha-mini-card {
            width: 100%;
            box-sizing: border-box;
          }

          .ficha-grid,
          .ficha-grid.two,
          .documentos-grid {
            grid-template-columns: 1fr;
          }

          .ficha-section {
            padding: 20px;
          }

          .ficha-actions {
            position: static;
            flex-direction: column;
            align-items: stretch;
          }

          .ficha-actions-buttons {
            justify-content: stretch;
          }

          .btn-ficha {
            width: 100%;
          }
        }
      `}</style>

      <Link to="/gestion/alumnos" className="ficha-back-link">
        <ArrowLeft size={18} />
        Volver al módulo alumnos
      </Link>

      <section className="ficha-hero">
        <div>
          <span className="ficha-kicker">
            <ClipboardList size={16} />
            Ficha de matrícula 2026
          </span>
          <h1>
            {alumnoId
              ? "Editar ficha madre del alumno"
              : "Nueva ficha madre del alumno"}
          </h1>
          <p>
            Formulario digital basado en la ficha institucional de matrícula de
            Italito. Esta será la ficha madre desde donde se alimentarán la base
            de alumnos, matrícula, salud, certificados, informes e historial
            documental.
          </p>
        </div>

        <div className="ficha-mini-card">
          <span>Edad del párvulo</span>
          <strong>{edadParvulo !== "" ? `${edadParvulo} años` : "—"}</strong>
        </div>
      </section>

      <form className="ficha-form" onSubmit={manejarSubmit}>
        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <UserRound size={25} />
            </div>
            <div>
              <h2>Datos del párvulo</h2>
              <p>Información principal del niño o niña matriculado.</p>
            </div>
          </div>

          <div className="ficha-grid">
            <div className="ficha-field">
              <label>Nombre del párvulo</label>
              <input
                value={formulario.nombreParvulo}
                onChange={(e) =>
                  actualizarCampo("nombreParvulo", e.target.value)
                }
                placeholder="Nombre completo"
              />
            </div>

            <div className="ficha-field">
              <label>RUN</label>
              <input
                value={formulario.rutParvulo}
                onChange={(e) => actualizarCampo("rutParvulo", e.target.value)}
                placeholder="Ej: 24.345.678-9"
              />
            </div>

            <div className="ficha-field">
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                value={formulario.fechaNacimientoParvulo}
                onChange={(e) =>
                  actualizarCampo("fechaNacimientoParvulo", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Edad</label>
              <div className="readonly-box">
                {edadParvulo !== ""
                  ? `${edadParvulo} años`
                  : "Se calcula automáticamente"}
              </div>
            </div>

            <div className="ficha-field">
              <label>Domicilio</label>
              <input
                value={formulario.domicilioParvulo}
                onChange={(e) =>
                  actualizarCampo("domicilioParvulo", e.target.value)
                }
                placeholder="Calle, número, sector"
              />
            </div>

            <div className="ficha-field">
              <label>Comuna</label>
              <input
                value={formulario.comunaParvulo}
                onChange={(e) =>
                  actualizarCampo("comunaParvulo", e.target.value)
                }
                placeholder="Ej: Limache"
              />
            </div>

            <div className="ficha-field">
              <label>Con quién vive el párvulo</label>
              <input
                value={formulario.conQuienVive}
                onChange={(e) => actualizarCampo("conQuienVive", e.target.value)}
                placeholder="Madre, padre, ambos, abuelos, tutor..."
              />
            </div>

            <div className="ficha-field">
              <label>Alergias y enfermedades</label>
              <input
                value={formulario.alergiasEnfermedades}
                onChange={(e) =>
                  actualizarCampo("alergiasEnfermedades", e.target.value)
                }
                placeholder="Indicar si corresponde"
              />
            </div>

            <div className="ficha-field full">
              <label>Observaciones</label>
              <textarea
                value={formulario.observacionesParvulo}
                onChange={(e) =>
                  actualizarCampo("observacionesParvulo", e.target.value)
                }
                placeholder="Observaciones generales del párvulo."
              />
            </div>
          </div>
        </section>

        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <School size={25} />
            </div>
            <div>
              <h2>Datos escolares y matrícula</h2>
              <p>Información académica y administrativa del ingreso.</p>
            </div>
          </div>

          <div className="ficha-grid">
            <div className="ficha-field">
              <label>Año escolar</label>
              <input
                value={formulario.anioEscolar}
                onChange={(e) => actualizarCampo("anioEscolar", e.target.value)}
              />
            </div>

            <div className="ficha-field">
              <label>Nivel</label>
              <select
                value={formulario.nivel}
                onChange={(e) => actualizarCampo("nivel", e.target.value)}
              >
                <option>Pre-Kínder</option>
                <option>Kínder</option>
              </select>
            </div>

            <div className="ficha-field">
              <label>Jornada</label>
              <select
                value={formulario.jornada}
                onChange={(e) => actualizarCampo("jornada", e.target.value)}
              >
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Jornada completa</option>
              </select>
            </div>

            <div className="ficha-field">
              <label>Fecha de matrícula</label>
              <input
                type="date"
                value={formulario.fechaMatricula}
                onChange={(e) =>
                  actualizarCampo("fechaMatricula", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Estado</label>
              <select
                value={formulario.estado}
                onChange={(e) => actualizarCampo("estado", e.target.value)}
              >
                <option>Activo</option>
                <option>Postulante</option>
                <option>Retirado</option>
                <option>Egresado</option>
              </select>
            </div>
          </div>
        </section>

        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <Users size={25} />
            </div>
            <div>
              <h2>Datos familiares</h2>
              <p>Información del padre y de la madre según ficha institucional.</p>
            </div>
          </div>

          <div className="ficha-grid">
            <div className="ficha-field">
              <label>Nombre del padre</label>
              <input
                value={formulario.nombrePadre}
                onChange={(e) => actualizarCampo("nombrePadre", e.target.value)}
              />
            </div>

            <div className="ficha-field">
              <label>RUN padre</label>
              <input
                value={formulario.rutPadre}
                onChange={(e) => actualizarCampo("rutPadre", e.target.value)}
              />
            </div>

            <div className="ficha-field">
              <label>Fecha nacimiento padre</label>
              <input
                type="date"
                value={formulario.fechaNacimientoPadre}
                onChange={(e) =>
                  actualizarCampo("fechaNacimientoPadre", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Teléfono padre</label>
              <input
                value={formulario.telefonoPadre}
                onChange={(e) =>
                  actualizarCampo("telefonoPadre", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Escolaridad padre</label>
              <input
                value={formulario.escolaridadPadre}
                onChange={(e) =>
                  actualizarCampo("escolaridadPadre", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Actividad padre</label>
              <input
                value={formulario.actividadPadre}
                onChange={(e) =>
                  actualizarCampo("actividadPadre", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Nombre de la madre</label>
              <input
                value={formulario.nombreMadre}
                onChange={(e) => actualizarCampo("nombreMadre", e.target.value)}
              />
            </div>

            <div className="ficha-field">
              <label>RUN madre</label>
              <input
                value={formulario.rutMadre}
                onChange={(e) => actualizarCampo("rutMadre", e.target.value)}
              />
            </div>

            <div className="ficha-field">
              <label>Fecha nacimiento madre</label>
              <input
                type="date"
                value={formulario.fechaNacimientoMadre}
                onChange={(e) =>
                  actualizarCampo("fechaNacimientoMadre", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Teléfono madre</label>
              <input
                value={formulario.telefonoMadre}
                onChange={(e) =>
                  actualizarCampo("telefonoMadre", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Escolaridad madre</label>
              <input
                value={formulario.escolaridadMadre}
                onChange={(e) =>
                  actualizarCampo("escolaridadMadre", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Actividad madre</label>
              <input
                value={formulario.actividadMadre}
                onChange={(e) =>
                  actualizarCampo("actividadMadre", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <ShieldCheck size={25} />
            </div>
            <div>
              <h2>Apoderado titular</h2>
              <p>Persona responsable ante el establecimiento.</p>
            </div>
          </div>

          <div className="ficha-grid">
            <div className="ficha-field">
              <label>Nombre del apoderado</label>
              <input
                value={formulario.nombreApoderado}
                onChange={(e) =>
                  actualizarCampo("nombreApoderado", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>RUN apoderado</label>
              <input
                value={formulario.rutApoderado}
                onChange={(e) => actualizarCampo("rutApoderado", e.target.value)}
              />
            </div>

            <div className="ficha-field">
              <label>Parentesco</label>
              <input
                value={formulario.parentescoApoderado}
                onChange={(e) =>
                  actualizarCampo("parentescoApoderado", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Teléfono</label>
              <input
                value={formulario.telefonoApoderado}
                onChange={(e) =>
                  actualizarCampo("telefonoApoderado", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Email</label>
              <input
                type="email"
                value={formulario.emailApoderado}
                onChange={(e) =>
                  actualizarCampo("emailApoderado", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Dirección</label>
              <input
                value={formulario.direccionApoderado}
                onChange={(e) =>
                  actualizarCampo("direccionApoderado", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <Camera size={25} />
            </div>
            <div>
              <h2>Autorización para fotos y videos</h2>
              <p>
                Autorización para publicar registros en redes sociales oficiales
                de la escuela.
              </p>
            </div>
          </div>

          <div className="ficha-grid">
            <div className="ficha-field full">
              <label>Autoriza subir fotos y videos a redes sociales</label>
              <div className="radio-row">
                <label className="radio-card">
                  <input
                    type="radio"
                    name="autorizaImagen"
                    checked={formulario.autorizaImagen === "Sí"}
                    onChange={() => actualizarCampo("autorizaImagen", "Sí")}
                  />
                  Sí autoriza
                </label>

                <label className="radio-card">
                  <input
                    type="radio"
                    name="autorizaImagen"
                    checked={formulario.autorizaImagen === "No"}
                    onChange={() => actualizarCampo("autorizaImagen", "No")}
                  />
                  No autoriza
                </label>
              </div>
            </div>

            <div className="ficha-field full">
              <label>Redes consideradas</label>
              <div className="documentos-grid">
                <label className="check-card">
                  <input
                    type="checkbox"
                    checked={formulario.autorizaInstagram}
                    onChange={(e) =>
                      actualizarCampo("autorizaInstagram", e.target.checked)
                    }
                  />
                  Instagram
                </label>

                <label className="check-card">
                  <input
                    type="checkbox"
                    checked={formulario.autorizaFacebook}
                    onChange={(e) =>
                      actualizarCampo("autorizaFacebook", e.target.checked)
                    }
                  />
                  Facebook
                </label>

                <label className="check-card">
                  <input
                    type="checkbox"
                    checked={formulario.autorizaTelegram}
                    onChange={(e) =>
                      actualizarCampo("autorizaTelegram", e.target.checked)
                    }
                  />
                  Telegram
                </label>
              </div>
            </div>

            <div className="ficha-field">
              <label>Nombre de quien autoriza</label>
              <input
                value={formulario.nombreAutorizaImagen}
                onChange={(e) =>
                  actualizarCampo("nombreAutorizaImagen", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>RUN de quien autoriza</label>
              <input
                value={formulario.rutAutorizaImagen}
                onChange={(e) =>
                  actualizarCampo("rutAutorizaImagen", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Firma</label>
              <input
                value={formulario.firmaAutorizaImagen}
                onChange={(e) =>
                  actualizarCampo("firmaAutorizaImagen", e.target.value)
                }
                placeholder="Pendiente / firmada / digital"
              />
            </div>
          </div>
        </section>

        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <Users size={25} />
            </div>
            <div>
              <h2>Personas autorizadas para retirar al párvulo</h2>
              <p>
                Registro de hasta tres personas autorizadas para retirar al
                estudiante.
              </p>
            </div>
          </div>

          <div className="autorizados-table-wrap">
            <table className="autorizados-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Nombre</th>
                  <th>RUN</th>
                  <th>Parentesco</th>
                  <th>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {formulario.autorizadosRetiro.map((persona, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        value={persona.nombre}
                        onChange={(e) =>
                          actualizarAutorizadoRetiro(
                            index,
                            "nombre",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={persona.run}
                        onChange={(e) =>
                          actualizarAutorizadoRetiro(
                            index,
                            "run",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={persona.parentesco}
                        onChange={(e) =>
                          actualizarAutorizadoRetiro(
                            index,
                            "parentesco",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={persona.telefono}
                        onChange={(e) =>
                          actualizarAutorizadoRetiro(
                            index,
                            "telefono",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <HeartPulse size={25} />
            </div>
            <div>
              <h2>Salud complementaria</h2>
              <p>Información adicional para el cuidado diario del estudiante.</p>
            </div>
          </div>

          <div className="ficha-grid two">
            <div className="ficha-field">
              <label>Alergias</label>
              <textarea
                value={formulario.alergias}
                onChange={(e) => actualizarCampo("alergias", e.target.value)}
                placeholder="Alergias alimentarias, medicamentos u otras."
              />
            </div>

            <div className="ficha-field">
              <label>Enfermedades o condiciones de salud</label>
              <textarea
                value={formulario.enfermedades}
                onChange={(e) =>
                  actualizarCampo("enfermedades", e.target.value)
                }
                placeholder="Registrar enfermedades, diagnósticos o condiciones relevantes."
              />
            </div>

            <div className="ficha-field">
              <label>Medicamentos</label>
              <textarea
                value={formulario.medicamentos}
                onChange={(e) =>
                  actualizarCampo("medicamentos", e.target.value)
                }
                placeholder="Medicamentos permanentes o indicaciones especiales."
              />
            </div>

            <div className="ficha-field">
              <label>Observaciones de salud</label>
              <textarea
                value={formulario.observacionesSalud}
                onChange={(e) =>
                  actualizarCampo("observacionesSalud", e.target.value)
                }
                placeholder="Observaciones adicionales."
              />
            </div>
          </div>
        </section>

        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <Brain size={25} />
            </div>
            <div>
              <h2>Neurodesarrollo y apoyos educativos</h2>
              <p>
                Información relevante para acompañamiento pedagógico y apoyos en
                aula.
              </p>
            </div>
          </div>

          <div className="ficha-info-box">
            Este apartado permite dejar registro de diagnósticos, informes,
            apoyos previos o adecuaciones sugeridas para el equipo educativo.
          </div>

          <div className="ficha-grid">
            <div className="ficha-field">
              <label>Estado</label>
              <select
                value={formulario.neurodesarrolloEstado}
                onChange={(e) =>
                  actualizarCampo("neurodesarrolloEstado", e.target.value)
                }
              >
                <option>No informado</option>
                <option>Sin antecedentes</option>
                <option>Con antecedentes</option>
                <option>En evaluación</option>
              </select>
            </div>

            <div className="ficha-field">
              <label>Diagnóstico o antecedente</label>
              <input
                value={formulario.neurodesarrolloDiagnostico}
                onChange={(e) =>
                  actualizarCampo("neurodesarrolloDiagnostico", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Profesional</label>
              <input
                value={formulario.neurodesarrolloProfesional}
                onChange={(e) =>
                  actualizarCampo("neurodesarrolloProfesional", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Especialidad</label>
              <input
                value={formulario.neurodesarrolloEspecialidad}
                onChange={(e) =>
                  actualizarCampo("neurodesarrolloEspecialidad", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Fecha de informe</label>
              <input
                type="date"
                value={formulario.neurodesarrolloFechaInforme}
                onChange={(e) =>
                  actualizarCampo("neurodesarrolloFechaInforme", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Institución</label>
              <input
                value={formulario.neurodesarrolloInstitucion}
                onChange={(e) =>
                  actualizarCampo("neurodesarrolloInstitucion", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Participó en PIE anterior</label>
              <select
                value={formulario.participoPieAnterior}
                onChange={(e) =>
                  actualizarCampo("participoPieAnterior", e.target.value)
                }
              >
                <option>No informado</option>
                <option>Sí</option>
                <option>No</option>
              </select>
            </div>

            <div className="ficha-field">
              <label>Establecimiento PIE anterior</label>
              <input
                value={formulario.establecimientoPieAnterior}
                onChange={(e) =>
                  actualizarCampo("establecimientoPieAnterior", e.target.value)
                }
              />
            </div>

            <div className="ficha-field full">
              <label>Apoyos recibidos</label>
              <textarea
                value={formulario.apoyosRecibidos}
                onChange={(e) =>
                  actualizarCampo("apoyosRecibidos", e.target.value)
                }
              />
            </div>

            <div className="ficha-field">
              <label>Requiere apoyos en aula</label>
              <select
                value={formulario.requiereApoyosAula}
                onChange={(e) =>
                  actualizarCampo("requiereApoyosAula", e.target.value)
                }
              >
                <option>No informado</option>
                <option>Sí</option>
                <option>No</option>
              </select>
            </div>

            <div className="ficha-field full">
              <label>Adecuaciones sugeridas</label>
              <textarea
                value={formulario.adecuacionesSugeridas}
                onChange={(e) =>
                  actualizarCampo("adecuacionesSugeridas", e.target.value)
                }
              />
            </div>

            <div className="ficha-field full">
              <label>Observaciones neurodesarrollo</label>
              <textarea
                value={formulario.observacionesNeurodesarrollo}
                onChange={(e) =>
                  actualizarCampo(
                    "observacionesNeurodesarrollo",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </section>

        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <FileCheck2 size={25} />
            </div>
            <div>
              <h2>Documentos entregados</h2>
              <p>Registro documental asociado a la matrícula.</p>
            </div>
          </div>

          <div className="documentos-grid">
            <label className="check-card">
              <input
                type="checkbox"
                checked={formulario.certificadoNacimiento}
                onChange={(e) =>
                  actualizarCampo("certificadoNacimiento", e.target.checked)
                }
              />
              Certificado de nacimiento
            </label>

            <label className="check-card">
              <input
                type="checkbox"
                checked={formulario.carnetVacunas}
                onChange={(e) =>
                  actualizarCampo("carnetVacunas", e.target.checked)
                }
              />
              Carnet de vacunas
            </label>

            <label className="check-card">
              <input
                type="checkbox"
                checked={formulario.autorizacionImagenDocumento}
                onChange={(e) =>
                  actualizarCampo(
                    "autorizacionImagenDocumento",
                    e.target.checked
                  )
                }
              />
              Autorización de imagen
            </label>

            <label className="check-card">
              <input
                type="checkbox"
                checked={formulario.informePie}
                onChange={(e) => actualizarCampo("informePie", e.target.checked)}
              />
              Informe PIE
            </label>

            <label className="check-card">
              <input
                type="checkbox"
                checked={formulario.informeNeurodesarrollo}
                onChange={(e) =>
                  actualizarCampo("informeNeurodesarrollo", e.target.checked)
                }
              />
              Informe de neurodesarrollo
            </label>
          </div>

          <div className="ficha-grid" style={{ marginTop: "16px" }}>
            <div className="ficha-field full">
              <label>Otros documentos</label>
              <textarea
                value={formulario.otrosDocumentos}
                onChange={(e) =>
                  actualizarCampo("otrosDocumentos", e.target.value)
                }
                placeholder="Registrar otros documentos entregados por el apoderado."
              />
            </div>
          </div>
        </section>

        <section className="ficha-section">
          <div className="ficha-section-header">
            <div className="ficha-section-icon">
              <ClipboardList size={25} />
            </div>
            <div>
              <h2>Observaciones internas</h2>
              <p>Notas administrativas visibles solo para gestión interna.</p>
            </div>
          </div>

          <div className="ficha-grid">
            <div className="ficha-field full">
              <label>Observaciones</label>
              <textarea
                value={formulario.observacionesInternas}
                onChange={(e) =>
                  actualizarCampo("observacionesInternas", e.target.value)
                }
                placeholder="Registrar observaciones relevantes para dirección, administración o equipo educativo."
              />
            </div>
          </div>
        </section>

        {(cargandoAlumno || mensaje || error) && (
          <div>
            {cargandoAlumno && (
              <div className="ficha-message info">
                Cargando ficha del alumno...
              </div>
            )}

            {mensaje && <div className="ficha-message ok">{mensaje}</div>}

            {error && <div className="ficha-message error">{error}</div>}
          </div>
        )}

        <div className="ficha-actions">
          <p>
            <strong>Ficha madre institucional.</strong> Este formulario será la
            fuente principal para Base de Alumnos, Matrícula, Salud,
            Neurodesarrollo, Certificados e Informes.
          </p>

          <div className="ficha-actions-buttons">
            <Link to="/gestion/alumnos/base" className="btn-ficha secondary">
              Ver base de alumnos
            </Link>

            <button type="submit" className="btn-ficha primary" disabled={cargando}>
              <Save size={19} />
              {cargando
                ? "Guardando..."
                : alumnoId
                ? "Actualizar ficha"
                : "Guardar ficha"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NuevaFichaAlumno;