import { Link } from "react-router-dom";
import {
  FileText,
  UploadCloud,
  FolderSearch,
  Archive,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

function Documentos() {
  const accesos = [
    {
      titulo: "Carga Excel",
      descripcion:
        "Carga masiva de datos o documentos mediante planillas Excel para acelerar registros administrativos.",
      icono: UploadCloud,
      ruta: "/gestion/documentos/carga-excel",
      etiqueta: "Carga masiva",
    },
    {
      titulo: "Documentos por Alumno",
      descripcion:
        "Consulta los documentos asociados a cada párvulo desde su ficha o historial individual.",
      icono: FolderSearch,
      ruta: "/gestion/documentos/por-alumno",
      etiqueta: "Por estudiante",
    },
    {
      titulo: "Historial Documental",
      descripcion:
        "Registro centralizado de certificados, informes al hogar, accidentes escolares y documentos emitidos.",
      icono: Archive,
      ruta: "/gestion/documentos/historial",
      etiqueta: "Historial",
      destacado: true,
    },
    {
      titulo: "Plantillas Institucionales",
      descripcion:
        "Administración de formatos base para certificados, informes y documentos oficiales de Italito.",
      icono: ClipboardList,
      ruta: "/gestion/documentos/plantillas",
      etiqueta: "Plantillas",
    },
  ];

  return (
    <div className="documentos-page">
      <section className="documentos-hero">
        <div>
          <span className="documentos-chip">
            <FileText size={16} />
            Gestión documental
          </span>

          <h1>Documentos</h1>

          <p>
            Administra la carga, consulta, historial y plantillas de documentos
            emitidos por Italito Gestión Escolar.
          </p>
        </div>
      </section>

      <section className="documentos-grid">
        {accesos.map((item) => {
          const Icono = item.icono;

          return (
            <Link
              key={item.ruta}
              to={item.ruta}
              className={`documento-card ${item.destacado ? "destacado" : ""}`}
            >
              <div className="documento-card-top">
                <div className="documento-icon">
                  <Icono size={24} />
                </div>

                <span>{item.etiqueta}</span>
              </div>

              <h2>{item.titulo}</h2>

              <p>{item.descripcion}</p>

              <div className="documento-card-action">
                Abrir módulo
                <ArrowRight size={18} />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="documentos-info">
        <div>
          <h3>Orden documental institucional</h3>
          <p>
            Este módulo está preparado para centralizar certificados, informes,
            documentos por alumno y registros emitidos durante el año de gestión.
          </p>
        </div>

        <Link to="/gestion/documentos/historial" className="documentos-info-btn">
          Ver historial documental
          <ArrowRight size={18} />
        </Link>
      </section>

      <style>{`
        .documentos-page {
          width: 100%;
          min-height: 100%;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.10), transparent 34%),
            radial-gradient(circle at top right, rgba(16, 185, 129, 0.10), transparent 32%),
            #f8fafc;
          color: #0f172a;
        }

        .documentos-hero {
          padding: 30px;
          border-radius: 28px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: white;
          box-shadow: 0 22px 50px rgba(15, 23, 42, 0.18);
          margin-bottom: 22px;
        }

        .documentos-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.20);
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 14px;
        }

        .documentos-hero h1 {
          margin: 0;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .documentos-hero p {
          max-width: 760px;
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 15px;
          line-height: 1.6;
        }

        .documentos-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 22px;
        }

        .documento-card {
          display: flex;
          flex-direction: column;
          min-height: 245px;
          padding: 22px;
          border-radius: 26px;
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.07);
          color: inherit;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .documento-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 22px 50px rgba(15, 23, 42, 0.11);
          border-color: #bfdbfe;
        }

        .documento-card.destacado {
          background: linear-gradient(180deg, #ffffff, #eff6ff);
          border-color: #bfdbfe;
        }

        .documento-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .documento-icon {
          width: 52px;
          height: 52px;
          border-radius: 19px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .documento-card-top span {
          padding: 7px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #475569;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .documento-card h2 {
          margin: 0;
          font-size: 21px;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .documento-card p {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.55;
        }

        .documento-card-action {
          margin-top: auto;
          padding-top: 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #1d4ed8;
          font-weight: 900;
          font-size: 14px;
        }

        .documentos-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 22px;
          border-radius: 26px;
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
        }

        .documentos-info h3 {
          margin: 0;
          font-size: 21px;
          letter-spacing: -0.03em;
        }

        .documentos-info p {
          margin: 8px 0 0;
          color: #64748b;
          line-height: 1.55;
          font-size: 14px;
        }

        .documentos-info-btn {
          flex: 0 0 auto;
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 16px;
          background: #1d4ed8;
          color: white;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 14px 28px rgba(29, 78, 216, 0.22);
        }

        @media (max-width: 1100px) {
          .documentos-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .documentos-page {
            padding: 10px;
          }

          .documentos-hero {
            padding: 22px;
            border-radius: 22px;
            margin-bottom: 14px;
          }

          .documentos-hero h1 {
            font-size: 32px;
          }

          .documentos-hero p {
            font-size: 14px;
          }

          .documentos-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 14px;
          }

          .documento-card {
            min-height: auto;
            border-radius: 22px;
            padding: 18px;
          }

          .documento-card-top {
            margin-bottom: 14px;
          }

          .documento-icon {
            width: 48px;
            height: 48px;
            border-radius: 17px;
          }

          .documento-card h2 {
            font-size: 20px;
          }

          .documentos-info {
            flex-direction: column;
            align-items: stretch;
            border-radius: 22px;
            padding: 18px;
          }

          .documentos-info-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default Documentos;