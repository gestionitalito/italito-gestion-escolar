import { Link } from "react-router-dom";
import {
  ArrowLeft,
  HeartPulse,
  UserRound,
  School,
  ShieldAlert,
  Pill,
  ClipboardList,
  Phone,
  Users,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  History,
  Brain,
  Stethoscope,
  FileCheck2,
  GraduationCap,
} from "lucide-react";

function SaludAlumno() {
  const salud = {
    nombreParvulo: "Martina Ignacia González Pérez",
    rutParvulo: "24.345.678-9",
    nivel: "Pre-Kínder",
    jornada: "Mañana",
    anioEscolar: "2026",
    estado: "Activo",

    alergiasEnfermedades:
      "No registra alergias ni enfermedades declaradas en ficha inicial.",
    alergias: "No registradas",
    enfermedades: "No registradas",
    medicamentos: "No registra medicamentos permanentes.",
    observacionesSalud:
      "Sin observaciones relevantes. Mantener seguimiento habitual en sala.",

    nombreApoderado: "Carolina Pérez Morales",
    parentescoApoderado: "Madre",
    telefonoApoderado: "+56 9 1234 5678",
    emailApoderado: "carolina@gmail.com",

    contactoEmergencia: "Felipe González Rojas",
    parentescoEmergencia: "Padre",
    telefonoEmergencia: "+56 9 8765 4321",

    neurodesarrolloEstado: "En evaluación",
    neurodesarrolloDiagnostico: "Antecedente de neurodesarrollo informado por la familia",
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

    controles: {
      fichaSaludCompleta: true,
      alergiasInformadas: false,
      medicamentosInformados: false,
      contactoEmergenciaRegistrado: true,
      observacionesRevisadas: true,
      neurodesarrolloRegistrado: true,
      informeNeurodesarrollo: true,
      pieAnteriorInformado: true,
    },

    observacionesInternas:
      "Módulo de salud alimentado desde la ficha madre institucional. Luego estos datos vendrán desde Firebase.",
  };

  const indicadores = [
    {
      titulo: "Ficha de salud",
      estado: salud.controles.fichaSaludCompleta,
      textoOk: "Completa",
      textoPendiente: "Pendiente",
    },
    {
      titulo: "Alergias informadas",
      estado: salud.controles.alergiasInformadas,
      textoOk: "Registradas",
      textoPendiente: "Sin alergias declaradas",
    },
    {
      titulo: "Medicamentos",
      estado: salud.controles.medicamentosInformados,
      textoOk: "Registrados",
      textoPendiente: "Sin medicamentos",
    },
    {
      titulo: "Contacto emergencia",
      estado: salud.controles.contactoEmergenciaRegistrado,
      textoOk: "Registrado",
      textoPendiente: "Pendiente",
    },
    {
      titulo: "Observaciones",
      estado: salud.controles.observacionesRevisadas,
      textoOk: "Revisadas",
      textoPendiente: "Por revisar",
    },
    {
      titulo: "Neurodesarrollo",
      estado: salud.controles.neurodesarrolloRegistrado,
      textoOk: "Informado",
      textoPendiente: "No informado",
    },
    {
      titulo: "Informe profesional",
      estado: salud.controles.informeNeurodesarrollo,
      textoOk: "Acreditado",
      textoPendiente: "Pendiente",
    },
    {
      titulo: "PIE anterior",
      estado: salud.controles.pieAnteriorInformado,
      textoOk: "Informado",
      textoPendiente: "No informado",
    },
  ];

  const totalIndicadores = indicadores.length;
  const indicadoresOk = indicadores.filter((item) => item.estado).length;
  const indicadoresPendientes = totalIndicadores - indicadoresOk;

  const tieneAntecedenteNeurodesarrollo =
    salud.neurodesarrolloEstado === "Sí" ||
    salud.neurodesarrolloEstado === "En evaluación";

  return (
    <div className="salud-page">
      <style>{`
        .salud-page {
          width: 100%;
          min-height: 100vh;
          padding: 32px;
          box-sizing: border-box;
          color: #0f172a;
          background:
            radial-gradient(circle at top left, rgba(220, 38, 38, 0.10), transparent 32%),
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.10), transparent 28%),
            linear-gradient(135deg, #f8fafc 0%, #fff1f2 100%);
        }

        .salud-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          color: #dc2626;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
        }

        .salud-hero {
          display: grid;
          grid-template-columns: 1.4fr 0.6fr;
          gap: 22px;
          margin-bottom: 24px;
        }

        .salud-profile-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 30px;
          padding: 28px;
          box-shadow: 0 18px 46px rgba(15, 23, 42, 0.09);
          display: flex;
          gap: 22px;
          align-items: center;
        }

        .salud-avatar {
          width: 88px;
          height: 88px;
          border-radius: 28px;
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 950;
          flex-shrink: 0;
          box-shadow: inset 0 0 0 1px rgba(220, 38, 38, 0.10);
        }

        .salud-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(220, 38, 38, 0.10);
          color: #dc2626;
          font-size: 13px;
          font-weight: 850;
          margin-bottom: 12px;
        }

        .salud-profile-card h1 {
          margin: 0;
          font-size: 32px;
          line-height: 1.12;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .salud-profile-card p {
          margin: 10px 0 0;
          color: #64748b;
          line-height: 1.55;
          font-size: 14px;
        }

        .salud-status-card {
          background: linear-gradient(135deg, #7f1d1d, #991b1b);
          color: white;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 20px 52px rgba(127, 29, 29, 0.24);
          display: grid;
          align-content: space-between;
          gap: 16px;
        }

        .salud-status-card span {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 850;
          color: rgba(255,255,255,0.66);
        }

        .salud-status-card strong {
          display: block;
          margin-top: 6px;
          font-size: 25px;
          font-weight: 950;
          letter-spacing: -0.03em;
        }

        .salud-status-badge {
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

        .salud-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .salud-action-btn {
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
        }

        .salud-action-btn.primary {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border-color: transparent;
        }

        .salud-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
        }

        .salud-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
        }

        .summary-icon {
          width: 56px;
          height: 56px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .summary-card.rojo .summary-icon {
          background: rgba(220, 38, 38, 0.12);
          color: #dc2626;
        }

        .summary-card.verde .summary-icon {
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
        }

        .summary-card.amarillo .summary-icon {
          background: rgba(234, 179, 8, 0.16);
          color: #a16207;
        }

        .summary-card p {
          margin: 0 0 6px;
          font-size: 13px;
          color: #64748b;
          font-weight: 850;
        }

        .summary-card h2 {
          margin: 0;
          font-size: 29px;
          font-weight: 950;
          color: #0f172a;
          letter-spacing: -0.04em;
        }

        .summary-card span {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 12px;
          font-weight: 750;
        }

        .salud-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .salud-section {
          background: rgba(255,255,255,0.93);
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 16px 42px rgba(15, 23, 42, 0.08);
        }

        .salud-section.full {
          grid-column: 1 / -1;
        }

        .salud-section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .salud-section-icon {
          width: 46px;
          height: 46px;
          border-radius: 17px;
          background: rgba(220, 38, 38, 0.10);
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .salud-section-icon.blue {
          background: rgba(37, 99, 235, 0.10);
          color: #2563eb;
        }

        .salud-section-header h2 {
          margin: 0;
          font-size: 19px;
          font-weight: 950;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .salud-section-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.45;
        }

        .salud-list {
          display: grid;
          gap: 12px;
        }

        .salud-item {
          display: grid;
          grid-template-columns: 190px 1fr;
          gap: 12px;
          align-items: start;
          padding: 12px 0;
          border-bottom: 1px solid #eef2f7;
        }

        .salud-item:last-child {
          border-bottom: none;
        }

        .salud-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.045em;
        }

        .salud-value {
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.45;
        }

        .salud-contact-line {
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

        .indicadores-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .indicador-card {
          border-radius: 18px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid rgba(203, 213, 225, 0.95);
        }

        .indicador-card.ok {
          background: rgba(22, 163, 74, 0.08);
          border-color: rgba(22, 163, 74, 0.25);
        }

        .indicador-card.pendiente {
          background: rgba(234, 179, 8, 0.10);
          border-color: rgba(234, 179, 8, 0.28);
        }

        .indicador-card strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .indicador-card span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 900;
        }

        .indicador-card.ok span {
          color: #15803d;
        }

        .indicador-card.pendiente span {
          color: #a16207;
        }

        .alert-box {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 18px;
          border-radius: 20px;
          background: rgba(22, 163, 74, 0.08);
          border: 1px solid rgba(22, 163, 74, 0.25);
          color: #14532d;
        }

        .alert-box.neuro {
          background: rgba(37, 99, 235, 0.08);
          border-color: rgba(37, 99, 235, 0.22);
          color: #1e3a8a;
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

        .neuro-card {
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.10), transparent 30%),
            linear-gradient(135deg, #ffffff, #eff6ff);
          border: 1px solid rgba(37, 99, 235, 0.18);
        }

        .salud-note {
          margin-top: 22px;
          background: linear-gradient(135deg, #7f1d1d, #991b1b);
          color: rgba(255,255,255,0.84);
          border-radius: 24px;
          padding: 22px;
          line-height: 1.6;
          font-size: 14px;
          box-shadow: 0 18px 44px rgba(127, 29, 29, 0.20);
        }

        .salud-note strong {
          color: white;
        }

        @media (max-width: 1200px) {
          .indicadores-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 1100px) {
          .salud-hero,
          .salud-grid,
          .salud-summary {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .salud-page {
            padding: 22px;
          }

          .salud-profile-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .salud-profile-card h1 {
            font-size: 27px;
          }

          .salud-status-card,
          .salud-section {
            padding: 20px;
          }

          .salud-item {
            grid-template-columns: 1fr;
            gap: 4px;
          }

          .indicadores-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Link to="/gestion/alumnos" className="salud-back-link">
        <ArrowLeft size={18} />
        Volver al módulo alumnos
      </Link>

      <section className="salud-hero">
        <article className="salud-profile-card">
          <div className="salud-avatar">
            <HeartPulse size={34} />
          </div>

          <div>
            <span className="salud-kicker">
              <HeartPulse size={16} />
              Salud y apoyos del párvulo
            </span>
            <h1>{salud.nombreParvulo}</h1>
            <p>
              Vista de antecedentes de salud, contactos de emergencia y apoyos
              educativos informados por la familia. La sección de
              neurodesarrollo se presenta de forma separada, respetuosa y no
              como enfermedad.
            </p>
          </div>
        </article>

        <aside className="salud-status-card">
          <div>
            <span>Estado alumno</span>
            <strong>{salud.estado}</strong>
          </div>

          <div>
            <span>Nivel {salud.anioEscolar}</span>
            <strong>{salud.nivel}</strong>
          </div>

          <div className="salud-status-badge">
            <ShieldAlert size={17} />
            Salud registrada
          </div>
        </aside>
      </section>

      <div className="salud-actions">
        <Link to="/gestion/alumnos/nuevo" className="salud-action-btn primary">
          <Pencil size={17} />
          Editar ficha madre
        </Link>

        <Link
          to="/gestion/alumnos/datos-personales"
          className="salud-action-btn"
        >
          <UserRound size={17} />
          Ver datos personales
        </Link>

        <Link to="/gestion/alumnos/matricula" className="salud-action-btn">
          <School size={17} />
          Ver matrícula
        </Link>

        <Link to="/gestion/alumnos/historial" className="salud-action-btn">
          <History size={17} />
          Ver historial
        </Link>
      </div>

      <section className="salud-summary">
        <article className="summary-card rojo">
          <div className="summary-icon">
            <ClipboardList size={27} />
          </div>
          <div>
            <p>Controles totales</p>
            <h2>{totalIndicadores}</h2>
            <span>Indicadores del registro</span>
          </div>
        </article>

        <article className="summary-card verde">
          <div className="summary-icon">
            <CheckCircle2 size={27} />
          </div>
          <div>
            <p>Completos</p>
            <h2>{indicadoresOk}</h2>
            <span>Registros revisados</span>
          </div>
        </article>

        <article className="summary-card amarillo">
          <div className="summary-icon">
            <AlertTriangle size={27} />
          </div>
          <div>
            <p>Pendientes</p>
            <h2>{indicadoresPendientes}</h2>
            <span>Por complementar</span>
          </div>
        </article>
      </section>

      <main className="salud-grid">
        <section className="salud-section">
          <div className="salud-section-header">
            <div className="salud-section-icon">
              <UserRound size={24} />
            </div>
            <div>
              <h2>Identificación del párvulo</h2>
              <p>Datos principales tomados desde la ficha madre.</p>
            </div>
          </div>

          <div className="salud-list">
            <div className="salud-item">
              <div className="salud-label">Nombre</div>
              <div className="salud-value">{salud.nombreParvulo}</div>
            </div>

            <div className="salud-item">
              <div className="salud-label">RUN</div>
              <div className="salud-value">{salud.rutParvulo}</div>
            </div>

            <div className="salud-item">
              <div className="salud-label">Nivel</div>
              <div className="salud-value">{salud.nivel}</div>
            </div>

            <div className="salud-item">
              <div className="salud-label">Jornada</div>
              <div className="salud-value">{salud.jornada}</div>
            </div>
          </div>
        </section>

        <section className="salud-section">
          <div className="salud-section-header">
            <div className="salud-section-icon">
              <Users size={24} />
            </div>
            <div>
              <h2>Contactos relevantes</h2>
              <p>Apoderado y contacto de emergencia.</p>
            </div>
          </div>

          <div className="salud-list">
            <div className="salud-item">
              <div className="salud-label">Apoderado</div>
              <div className="salud-value">
                {salud.nombreApoderado} · {salud.parentescoApoderado}
              </div>
            </div>

            <div className="salud-item">
              <div className="salud-label">Teléfono apoderado</div>
              <div className="salud-value">
                <span className="salud-contact-line">
                  <Phone size={16} />
                  {salud.telefonoApoderado}
                </span>
              </div>
            </div>

            <div className="salud-item">
              <div className="salud-label">Emergencia</div>
              <div className="salud-value">
                {salud.contactoEmergencia} · {salud.parentescoEmergencia}
              </div>
            </div>

            <div className="salud-item">
              <div className="salud-label">Teléfono emergencia</div>
              <div className="salud-value">
                <span className="salud-contact-line">
                  <Phone size={16} />
                  {salud.telefonoEmergencia}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="salud-section full">
          <div className="salud-section-header">
            <div className="salud-section-icon">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2>Alertas y observaciones generales</h2>
              <p>Resumen rápido para el equipo educativo.</p>
            </div>
          </div>

          <div className="alert-box">
            <CheckCircle2 size={24} />
            <div>
              <strong>Sin alertas críticas de salud registradas</strong>
              <p>
                Actualmente no existen alergias, enfermedades o medicamentos
                permanentes declarados para este párvulo en la ficha madre.
              </p>
            </div>
          </div>
        </section>

        <section className="salud-section">
          <div className="salud-section-header">
            <div className="salud-section-icon">
              <HeartPulse size={24} />
            </div>
            <div>
              <h2>Antecedentes de salud</h2>
              <p>Información médica o de cuidado diario declarada por la familia.</p>
            </div>
          </div>

          <div className="salud-list">
            <div className="salud-item">
              <div className="salud-label">Alergias/enfermedades</div>
              <div className="salud-value">{salud.alergiasEnfermedades}</div>
            </div>

            <div className="salud-item">
              <div className="salud-label">Alergias</div>
              <div className="salud-value">{salud.alergias}</div>
            </div>

            <div className="salud-item">
              <div className="salud-label">Condiciones de salud</div>
              <div className="salud-value">{salud.enfermedades}</div>
            </div>

            <div className="salud-item">
              <div className="salud-label">Medicamentos</div>
              <div className="salud-value">{salud.medicamentos}</div>
            </div>
          </div>
        </section>

        <section className="salud-section">
          <div className="salud-section-header">
            <div className="salud-section-icon">
              <Pill size={24} />
            </div>
            <div>
              <h2>Indicaciones y observaciones</h2>
              <p>Notas para cuidado diario y seguimiento.</p>
            </div>
          </div>

          <div className="salud-list">
            <div className="salud-item">
              <div className="salud-label">Observaciones salud</div>
              <div className="salud-value">{salud.observacionesSalud}</div>
            </div>

            <div className="salud-item">
              <div className="salud-label">Registro interno</div>
              <div className="salud-value">{salud.observacionesInternas}</div>
            </div>
          </div>
        </section>

        <section className="salud-section full neuro-card">
          <div className="salud-section-header">
            <div className="salud-section-icon blue">
              <Brain size={24} />
            </div>
            <div>
              <h2>Neurodesarrollo y apoyos educativos</h2>
              <p>
                Antecedentes informados por la familia para favorecer el
                acompañamiento pedagógico, la inclusión y el bienestar del
                párvulo. Esta información no se registra como enfermedad.
              </p>
            </div>
          </div>

          <div
            className={
              tieneAntecedenteNeurodesarrollo
                ? "alert-box neuro"
                : "alert-box warning"
            }
            style={{ marginBottom: "20px" }}
          >
            <Brain size={24} />
            <div>
              <strong>
                {tieneAntecedenteNeurodesarrollo
                  ? "Antecedente de neurodesarrollo informado"
                  : "Sin antecedente de neurodesarrollo informado"}
              </strong>
              <p>
                Esta sección tiene finalidad educativa y de acompañamiento. No
                debe utilizarse para etiquetar al párvulo, sino para orientar
                apoyos, adecuaciones y estrategias de bienestar en aula.
              </p>
            </div>
          </div>

          <div className="salud-grid">
            <div className="salud-list">
              <div className="salud-item">
                <div className="salud-label">Estado</div>
                <div className="salud-value">
                  <span className="estado-pill">
                    <Brain size={15} />
                    {salud.neurodesarrolloEstado}
                  </span>
                </div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Diagnóstico informado</div>
                <div className="salud-value">
                  {salud.neurodesarrolloDiagnostico}
                </div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Profesional acredita</div>
                <div className="salud-value">
                  <span className="salud-contact-line">
                    <Stethoscope size={16} />
                    {salud.neurodesarrolloProfesional}
                  </span>
                </div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Especialidad</div>
                <div className="salud-value">
                  {salud.neurodesarrolloEspecialidad}
                </div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Fecha informe</div>
                <div className="salud-value">
                  {salud.neurodesarrolloFechaInforme}
                </div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Centro emisor</div>
                <div className="salud-value">
                  {salud.neurodesarrolloInstitucion}
                </div>
              </div>
            </div>

            <div className="salud-list">
              <div className="salud-item">
                <div className="salud-label">PIE anterior</div>
                <div className="salud-value">
                  <span className="salud-contact-line">
                    <GraduationCap size={16} />
                    {salud.participoPieAnterior}
                  </span>
                </div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Establecimiento PIE</div>
                <div className="salud-value">
                  {salud.establecimientoPieAnterior}
                </div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Apoyos recibidos</div>
                <div className="salud-value">{salud.apoyosRecibidos}</div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Apoyos en aula</div>
                <div className="salud-value">{salud.requiereApoyosAula}</div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Adecuaciones sugeridas</div>
                <div className="salud-value">{salud.adecuacionesSugeridas}</div>
              </div>

              <div className="salud-item">
                <div className="salud-label">Observaciones equipo</div>
                <div className="salud-value">
                  {salud.observacionesNeurodesarrollo}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="salud-section full">
          <div className="salud-section-header">
            <div className="salud-section-icon">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2>Control de información registrada</h2>
              <p>
                Estado de los antecedentes provenientes de la ficha madre del
                alumno.
              </p>
            </div>
          </div>

          <div className="indicadores-grid">
            {indicadores.map((item) => (
              <article
                key={item.titulo}
                className={
                  item.estado
                    ? "indicador-card ok"
                    : "indicador-card pendiente"
                }
              >
                <strong>{item.titulo}</strong>
                <span>
                  {item.estado ? (
                    <>
                      <CheckCircle2 size={15} />
                      {item.textoOk}
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={15} />
                      {item.textoPendiente}
                    </>
                  )}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="salud-section full">
          <div className="salud-section-header">
            <div className="salud-section-icon blue">
              <FileCheck2 size={24} />
            </div>
            <div>
              <h2>Uso responsable de la información</h2>
              <p>Consideraciones internas para el equipo educativo.</p>
            </div>
          </div>

          <div className="alert-box neuro">
            <FileCheck2 size={24} />
            <div>
              <strong>Información reservada para acompañamiento</strong>
              <p>
                Los antecedentes de neurodesarrollo deben utilizarse únicamente
                para favorecer la inclusión, la adaptación, la participación y el
                bienestar del párvulo. No deben presentarse como enfermedad ni
                utilizarse como rótulo del estudiante.
              </p>
            </div>
          </div>
        </section>
      </main>

      <section className="salud-note">
        <strong>Importante:</strong> este módulo debe alimentarse desde la{" "}
        <strong>Ficha Madre</strong>. No debe crear datos paralelos del alumno;
        solo debe mostrar y permitir revisar la información de salud,
        neurodesarrollo y apoyos educativos registrada en{" "}
        <strong>NuevaFichaAlumno.jsx</strong>.
      </section>
    </div>
  );
}

export default SaludAlumno;