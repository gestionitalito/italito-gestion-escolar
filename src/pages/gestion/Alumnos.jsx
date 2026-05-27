import { Link } from "react-router-dom";

export default function Alumnos() {
  const modulos = [
    {
      titulo: "Base de Alumnos",
      descripcion:
        "Listado general de estudiantes matriculados, activos, retirados o egresados.",
      ruta: "/gestion/alumnos/base",
      icono: "👧🏻",
      color: "#2563eb",
    },
    {
      titulo: "Carga Masiva de Alumnos",
      descripcion:
        "Sube una planilla Excel para registrar rápidamente alumnos en Firestore.",
      ruta: "/gestion/carga-masiva-alumnos",
      icono: "📊",
      color: "#0f766e",
    },
    {
      titulo: "Nueva Ficha de Alumno",
      descripcion:
        "Ingreso completo de un nuevo estudiante al sistema de gestión escolar.",
      ruta: "/gestion/alumnos/nuevo",
      icono: "📝",
      color: "#16a34a",
    },
    {
      titulo: "Matrícula Alumno",
      descripcion:
        "Registro, revisión y actualización de antecedentes de matrícula.",
      ruta: "/gestion/alumnos/matricula",
      icono: "🏫",
      color: "#9333ea",
    },
    {
      titulo: "Datos Personales",
      descripcion:
        "Información individual del alumno, apoderados, contacto y antecedentes familiares.",
      ruta: "/gestion/alumnos/datos-personales",
      icono: "📋",
      color: "#ea580c",
    },
    {
      titulo: "Salud del Alumno",
      descripcion:
        "Antecedentes médicos, alergias, enfermedades, medicamentos y observaciones relevantes.",
      ruta: "/gestion/alumnos/salud",
      icono: "🩺",
      color: "#dc2626",
    },
    {
      titulo: "Accidentes Escolares",
      descripcion:
        "Registro de accidentes, derivaciones, reportes y seguimiento de casos.",
      ruta: "/gestion/alumnos/accidentes",
      icono: "🚑",
      color: "#b91c1c",
    },
    {
      titulo: "Historial del Alumno",
      descripcion:
        "Resumen histórico de matrícula, documentos, informes y registros asociados.",
      ruta: "/gestion/alumnos/historial",
      icono: "📚",
      color: "#0891b2",
    },
    {
      titulo: "Postulación Alumno",
      descripcion:
        "Gestión de postulaciones, antecedentes iniciales y estado del proceso.",
      ruta: "/gestion/alumnos/postulacion",
      icono: "📨",
      color: "#4f46e5",
    },
  ];

  return (
    <div className="alumnos-page">
      <style>{`
        .alumnos-page {
          width: 100%;
          min-height: 100vh;
          padding: 32px;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 32%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
          color: #0f172a;
          box-sizing: border-box;
        }

        .alumnos-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 28px;
        }

        .alumnos-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.10);
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .alumnos-title {
          margin: 0;
          font-size: 34px;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #0f172a;
        }

        .alumnos-subtitle {
          max-width: 760px;
          margin: 12px 0 0;
          color: #475569;
          font-size: 15px;
          line-height: 1.6;
        }

        .alumnos-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .alumnos-action-btn {
          text-decoration: none;
          border: none;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
        }

        .alumnos-action-btn.primary {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: white;
        }

        .alumnos-action-btn.secondary {
          background: white;
          color: #1e293b;
          border: 1px solid rgba(148, 163, 184, 0.35);
        }

        .alumnos-action-btn.excel {
          background: linear-gradient(135deg, #0f766e, #14b8a6);
          color: white;
        }

        .alumnos-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.16);
        }

        .alumnos-summary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .summary-card {
          background: rgba(255,255,255,0.86);
          border: 1px solid rgba(148, 163, 184, 0.26);
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(14px);
        }

        .summary-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .summary-value {
          font-size: 25px;
          font-weight: 900;
          color: #0f172a;
        }

        .summary-note {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        .alumnos-section-title {
          margin: 0 0 16px;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0f172a;
        }

        .alumnos-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .modulo-card {
          position: relative;
          overflow: hidden;
          min-height: 210px;
          text-decoration: none;
          color: inherit;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(148, 163, 184, 0.30);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 16px 42px rgba(15, 23, 42, 0.09);
          transition: all 0.24s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .modulo-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--card-color), transparent 42%);
          opacity: 0.08;
          pointer-events: none;
        }

        .modulo-card:hover {
          transform: translateY(-5px);
          border-color: rgba(37, 99, 235, 0.45);
          box-shadow: 0 24px 55px rgba(15, 23, 42, 0.16);
        }

        .modulo-top {
          position: relative;
          z-index: 1;
        }

        .modulo-icon {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.9);
          margin-bottom: 18px;
        }

        .modulo-title {
          margin: 0 0 10px;
          font-size: 17px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .modulo-description {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: #64748b;
        }

        .modulo-footer {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(226, 232, 240, 0.9);
          font-size: 13px;
          font-weight: 800;
          color: var(--card-color);
        }

        .alumnos-info-panel {
          margin-top: 28px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: white;
          border-radius: 26px;
          padding: 26px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
          box-shadow: 0 20px 52px rgba(15, 23, 42, 0.24);
        }

        .alumnos-info-panel h3 {
          margin: 0 0 10px;
          font-size: 21px;
          font-weight: 900;
        }

        .alumnos-info-panel p {
          margin: 0;
          color: rgba(255,255,255,0.78);
          line-height: 1.6;
          font-size: 14px;
        }

        .info-list {
          display: grid;
          gap: 10px;
          align-content: center;
        }

        .info-item {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 16px;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.88);
        }

        @media (max-width: 1200px) {
          .alumnos-grid,
          .alumnos-summary {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 780px) {
          .alumnos-page {
            padding: 22px;
          }

          .alumnos-header {
            flex-direction: column;
          }

          .alumnos-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .alumnos-title {
            font-size: 28px;
          }

          .alumnos-grid,
          .alumnos-summary,
          .alumnos-info-panel {
            grid-template-columns: 1fr;
          }

          .modulo-card {
            min-height: auto;
          }
        }
      `}</style>

      <header className="alumnos-header">
        <div>
          <div className="alumnos-kicker">🎒 Italito Gestión Escolar</div>
          <h1 className="alumnos-title">Módulo de Alumnos</h1>
          <p className="alumnos-subtitle">
            Administración central de estudiantes de Pre-Kínder y Kínder:
            fichas, matrícula, antecedentes personales, salud, historial,
            accidentes escolares y procesos de postulación.
          </p>
        </div>

        <div className="alumnos-actions">
          <Link
            to="/gestion/alumnos/nuevo"
            className="alumnos-action-btn primary"
          >
            ➕ Nueva ficha
          </Link>

          <Link
            to="/gestion/alumnos/base"
            className="alumnos-action-btn secondary"
          >
            🔎 Ver base
          </Link>

          <Link
            to="/gestion/carga-masiva-alumnos"
            className="alumnos-action-btn excel"
          >
            📊 Carga Excel
          </Link>
        </div>
      </header>

      <section className="alumnos-summary">
        <div className="summary-card">
          <div className="summary-label">Niveles activos</div>
          <div className="summary-value">2</div>
          <div className="summary-note">Pre-Kínder y Kínder.</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Gestión principal</div>
          <div className="summary-value">Ficha</div>
          <div className="summary-note">Base documental por estudiante.</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Estado del módulo</div>
          <div className="summary-value">Inicial</div>
          <div className="summary-note">Conectado progresivamente a Firebase.</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Carga masiva</div>
          <div className="summary-value">Excel</div>
          <div className="summary-note">Ingreso rápido de alumnos por planilla.</div>
        </div>
      </section>

      <section>
        <h2 className="alumnos-section-title">Submódulos disponibles</h2>

        <div className="alumnos-grid">
          {modulos.map((modulo) => (
            <Link
              key={modulo.titulo}
              to={modulo.ruta}
              className="modulo-card"
              style={{ "--card-color": modulo.color }}
            >
              <div className="modulo-top">
                <div className="modulo-icon">{modulo.icono}</div>
                <h3 className="modulo-title">{modulo.titulo}</h3>
                <p className="modulo-description">{modulo.descripcion}</p>
              </div>

              <div className="modulo-footer">
                <span>Ingresar</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="alumnos-info-panel">
        <div>
          <h3>Organización del módulo</h3>
          <p>
            Este panel funcionará como la puerta de entrada a toda la gestión de
            estudiantes. La idea es mantener una base ordenada, fácil de buscar y
            conectada posteriormente con certificados, informes al hogar,
            historial documental y portal del apoderado.
          </p>
        </div>

        <div className="info-list">
          <div className="info-item">✅ Pensado solo para Pre-Kínder y Kínder</div>
          <div className="info-item">✅ Preparado para fichas individuales</div>
          <div className="info-item">✅ Carga masiva desde Excel integrada</div>
          <div className="info-item">✅ Compatible con historial documental</div>
        </div>
      </section>
    </div>
  );
}