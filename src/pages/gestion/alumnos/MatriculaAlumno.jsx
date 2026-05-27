import { Link } from "react-router-dom";
import {
  ArrowLeft,
  School,
  UserRound,
  CalendarDays,
  ClipboardList,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  HeartPulse,
  History,
  Users,
} from "lucide-react";

function MatriculaAlumno() {
  const matricula = {
    nombreParvulo: "Martina Ignacia González Pérez",
    rutParvulo: "24.345.678-9",
    anioEscolar: "2026",
    nivel: "Pre-Kínder",
    jornada: "Mañana",
    fechaMatricula: "2026-03-01",
    estado: "Activo",
    numeroMatricula: "MAT-2026-0001",

    nombreApoderado: "Carolina Pérez Morales",
    rutApoderado: "13.456.789-0",
    parentescoApoderado: "Madre",
    telefonoApoderado: "+56 9 1234 5678",
    emailApoderado: "carolina@gmail.com",

    documentos: {
      fichaMatricula: true,
      certificadoNacimiento: true,
      carnetVacunas: true,
      autorizacionImagen: false,
      comprobanteMatricula: true,
      informePie: false,
    },

    observaciones:
      "Matrícula generada desde la ficha madre institucional. Luego estos datos vendrán desde Firebase.",
  };

  const documentos = [
    {
      nombre: "Ficha de matrícula",
      recibido: matricula.documentos.fichaMatricula,
    },
    {
      nombre: "Certificado de nacimiento",
      recibido: matricula.documentos.certificadoNacimiento,
    },
    {
      nombre: "Carnet de vacunas",
      recibido: matricula.documentos.carnetVacunas,
    },
    {
      nombre: "Autorización de imagen",
      recibido: matricula.documentos.autorizacionImagen,
    },
    {
      nombre: "Comprobante de matrícula",
      recibido: matricula.documentos.comprobanteMatricula,
    },
    {
      nombre: "Informe PIE / apoyo",
      recibido: matricula.documentos.informePie,
    },
  ];

  const totalDocumentos = documentos.length;
  const documentosRecibidos = documentos.filter((doc) => doc.recibido).length;
  const documentosPendientes = totalDocumentos - documentosRecibidos;

  return (
    <div className="matricula-page">
      <style>{`
        .matricula-page {
          width: 100%;
          min-height: 100vh;
          padding: 32px;
          box-sizing: border-box;
          color: #0f172a;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
        }

        .matricula-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          color: #2563eb;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
        }

        .matricula-hero {
          display: grid;
          grid-template-columns: 1.4fr 0.6fr;
          gap: 22px;
          margin-bottom: 24px;
        }

        .matricula-profile-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 30px;
          padding: 28px;
          box-shadow: 0 18px 46px rgba(15, 23, 42, 0.09);
          display: flex;
          gap: 22px;
          align-items: center;
        }

        .matricula-avatar {
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

        .matricula-kicker {
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

        .matricula-profile-card h1 {
          margin: 0;
          font-size: 32px;
          line-height: 1.12;
          letter-spacing: -0.04em;
          font-weight: 950;
        }

        .matricula-profile-card p {
          margin: 10px 0 0;
          color: #64748b;
          line-height: 1.55;
          font-size: 14px;
        }

        .matricula-status-card {
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: white;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 20px 52px rgba(15, 23, 42, 0.24);
          display: grid;
          align-content: space-between;
          gap: 16px;
        }

        .matricula-status-card span {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 850;
          color: rgba(255,255,255,0.66);
        }

        .matricula-status-card strong {
          display: block;
          margin-top: 6px;
          font-size: 25px;
          font-weight: 950;
          letter-spacing: -0.03em;
        }

        .matricula-status-badge {
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

        .matricula-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .matricula-action-btn {
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

        .matricula-action-btn.primary {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border-color: transparent;
        }

        .matricula-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.14);
        }

        .matricula-summary {
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

        .summary-card.azul .summary-icon {
          background: rgba(37, 99, 235, 0.12);
          color: #2563eb;
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

        .matricula-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .matricula-section {
          background: rgba(255,255,255,0.93);
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 16px 42px rgba(15, 23, 42, 0.08);
        }

        .matricula-section.full {
          grid-column: 1 / -1;
        }

        .matricula-section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .matricula-section-icon {
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

        .matricula-section-header h2 {
          margin: 0;
          font-size: 19px;
          font-weight: 950;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .matricula-section-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .matricula-list {
          display: grid;
          gap: 12px;
        }

        .matricula-item {
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 12px;
          align-items: start;
          padding: 12px 0;
          border-bottom: 1px solid #eef2f7;
        }

        .matricula-item:last-child {
          border-bottom: none;
        }

        .matricula-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.045em;
        }

        .matricula-value {
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.45;
        }

        .matricula-contact-line {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .estado-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          width: fit-content;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.10);
          color: #15803d;
          font-size: 13px;
          font-weight: 900;
        }

        .documentos-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .documento-card {
          border-radius: 18px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid rgba(203, 213, 225, 0.95);
        }

        .documento-card.ok {
          background: rgba(22, 163, 74, 0.08);
          border-color: rgba(22, 163, 74, 0.25);
        }

        .documento-card.pendiente {
          background: rgba(234, 179, 8, 0.10);
          border-color: rgba(234, 179, 8, 0.28);
        }

        .documento-card strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .documento-card span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 900;
        }

        .documento-card.ok span {
          color: #15803d;
        }

        .documento-card.pendiente span {
          color: #a16207;
        }

        .matricula-note {
          margin-top: 22px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: rgba(255,255,255,0.82);
          border-radius: 24px;
          padding: 22px;
          line-height: 1.6;
          font-size: 14px;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.20);
        }

        .matricula-note strong {
          color: white;
        }

        @media (max-width: 1100px) {
          .matricula-hero,
          .matricula-grid,
          .matricula-summary {
            grid-template-columns: 1fr;
          }

          .documentos-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .matricula-page {
            padding: 22px;
          }

          .matricula-profile-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .matricula-profile-card h1 {
            font-size: 27px;
          }

          .matricula-status-card,
          .matricula-section {
            padding: 20px;
          }

          .matricula-item {
            grid-template-columns: 1fr;
            gap: 4px;
          }

          .documentos-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Link to="/gestion/alumnos" className="matricula-back-link">
        <ArrowLeft size={18} />
        Volver al módulo alumnos
      </Link>

      <section className="matricula-hero">
        <article className="matricula-profile-card">
          <div className="matricula-avatar">
            {matricula.nivel === "Pre-Kínder" ? "PK" : "K"}
          </div>

          <div>
            <span className="matricula-kicker">
              <School size={16} />
              Matrícula del alumno
            </span>
            <h1>{matricula.nombreParvulo}</h1>
            <p>
              Vista administrativa de matrícula alimentada desde la ficha madre.
              Aquí se revisa el estado escolar, nivel, jornada, documentos y
              apoderado titular.
            </p>
          </div>
        </article>

        <aside className="matricula-status-card">
          <div>
            <span>Estado matrícula</span>
            <strong>{matricula.estado}</strong>
          </div>

          <div>
            <span>N° matrícula</span>
            <strong>{matricula.numeroMatricula}</strong>
          </div>

          <div className="matricula-status-badge">
            <ShieldCheck size={17} />
            Registro vigente
          </div>
        </aside>
      </section>

      <div className="matricula-actions">
        <Link to="/gestion/alumnos/nuevo" className="matricula-action-btn primary">
          <Pencil size={17} />
          Editar ficha madre
        </Link>

        <Link to="/gestion/alumnos/datos-personales" className="matricula-action-btn">
          <UserRound size={17} />
          Ver datos personales
        </Link>

        <Link to="/gestion/alumnos/salud" className="matricula-action-btn">
          <HeartPulse size={17} />
          Ver salud
        </Link>

        <Link to="/gestion/alumnos/historial" className="matricula-action-btn">
          <History size={17} />
          Ver historial
        </Link>
      </div>

      <section className="matricula-summary">
        <article className="summary-card azul">
          <div className="summary-icon">
            <ClipboardList size={27} />
          </div>
          <div>
            <p>Documentos totales</p>
            <h2>{totalDocumentos}</h2>
            <span>Control de matrícula</span>
          </div>
        </article>

        <article className="summary-card verde">
          <div className="summary-icon">
            <CheckCircle2 size={27} />
          </div>
          <div>
            <p>Recibidos</p>
            <h2>{documentosRecibidos}</h2>
            <span>Documentos completos</span>
          </div>
        </article>

        <article className="summary-card amarillo">
          <div className="summary-icon">
            <AlertTriangle size={27} />
          </div>
          <div>
            <p>Pendientes</p>
            <h2>{documentosPendientes}</h2>
            <span>Por regularizar</span>
          </div>
        </article>
      </section>

      <main className="matricula-grid">
        <section className="matricula-section">
          <div className="matricula-section-header">
            <div className="matricula-section-icon">
              <School size={24} />
            </div>
            <div>
              <h2>Datos de matrícula</h2>
              <p>Información escolar vigente.</p>
            </div>
          </div>

          <div className="matricula-list">
            <div className="matricula-item">
              <div className="matricula-label">Año escolar</div>
              <div className="matricula-value">{matricula.anioEscolar}</div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">Nivel</div>
              <div className="matricula-value">{matricula.nivel}</div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">Jornada</div>
              <div className="matricula-value">{matricula.jornada}</div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">Fecha matrícula</div>
              <div className="matricula-value">
                <span className="matricula-contact-line">
                  <CalendarDays size={16} />
                  {matricula.fechaMatricula}
                </span>
              </div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">Estado</div>
              <div className="matricula-value">
                <span className="estado-badge">
                  <CheckCircle2 size={16} />
                  {matricula.estado}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="matricula-section">
          <div className="matricula-section-header">
            <div className="matricula-section-icon">
              <UserRound size={24} />
            </div>
            <div>
              <h2>Datos del párvulo</h2>
              <p>Identificación tomada desde la ficha madre.</p>
            </div>
          </div>

          <div className="matricula-list">
            <div className="matricula-item">
              <div className="matricula-label">Nombre</div>
              <div className="matricula-value">{matricula.nombreParvulo}</div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">RUN</div>
              <div className="matricula-value">{matricula.rutParvulo}</div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">N° matrícula</div>
              <div className="matricula-value">{matricula.numeroMatricula}</div>
            </div>
          </div>
        </section>

        <section className="matricula-section">
          <div className="matricula-section-header">
            <div className="matricula-section-icon">
              <Users size={24} />
            </div>
            <div>
              <h2>Apoderado titular</h2>
              <p>Responsable asociado a la matrícula.</p>
            </div>
          </div>

          <div className="matricula-list">
            <div className="matricula-item">
              <div className="matricula-label">Nombre</div>
              <div className="matricula-value">{matricula.nombreApoderado}</div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">RUN</div>
              <div className="matricula-value">{matricula.rutApoderado}</div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">Parentesco</div>
              <div className="matricula-value">
                {matricula.parentescoApoderado}
              </div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">Teléfono</div>
              <div className="matricula-value">
                {matricula.telefonoApoderado}
              </div>
            </div>

            <div className="matricula-item">
              <div className="matricula-label">Email</div>
              <div className="matricula-value">{matricula.emailApoderado}</div>
            </div>
          </div>
        </section>

        <section className="matricula-section">
          <div className="matricula-section-header">
            <div className="matricula-section-icon">
              <FileText size={24} />
            </div>
            <div>
              <h2>Observaciones de matrícula</h2>
              <p>Notas administrativas asociadas al proceso.</p>
            </div>
          </div>

          <div className="matricula-list">
            <div className="matricula-item">
              <div className="matricula-label">Observación</div>
              <div className="matricula-value">{matricula.observaciones}</div>
            </div>
          </div>
        </section>

        <section className="matricula-section full">
          <div className="matricula-section-header">
            <div className="matricula-section-icon">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2>Documentos de matrícula</h2>
              <p>Estado de recepción documental del alumno.</p>
            </div>
          </div>

          <div className="documentos-grid">
            {documentos.map((doc) => (
              <article
                key={doc.nombre}
                className={
                  doc.recibido
                    ? "documento-card ok"
                    : "documento-card pendiente"
                }
              >
                <strong>{doc.nombre}</strong>
                <span>
                  {doc.recibido ? (
                    <>
                      <CheckCircle2 size={15} />
                      Recibido
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={15} />
                      Pendiente
                    </>
                  )}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>

      <section className="matricula-note">
        <strong>Importante:</strong> este módulo no debe crear una ficha nueva.
        Solo debe leer y mostrar la parte de matrícula proveniente de la{" "}
        <strong>Ficha Madre</strong>. Cuando conectemos Firebase, estos datos se
        cargarán automáticamente desde el alumno seleccionado.
      </section>
    </div>
  );
}

export default MatriculaAlumno;