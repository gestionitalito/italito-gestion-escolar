import { Link } from "react-router-dom";
import {
  UsersRound,
  Link2,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  Phone,
  FileCheck2,
  HeartHandshake,
} from "lucide-react";

function Apoderados() {
  const accesos = [
    {
      titulo: "Base de Apoderados",
      descripcion:
        "Administra el registro general de apoderados. Desde aquí podrás buscar, crear, editar datos personales y actualizar información de contacto.",
      icono: UsersRound,
      ruta: "/gestion/apoderados/base",
      etiqueta: "Registro principal",
      destacado: true,
    },
    {
      titulo: "Vínculos Familiares",
      descripcion:
        "Relaciona apoderados con uno o más alumnos, definiendo parentesco, titularidad y responsabilidad familiar.",
      icono: Link2,
      ruta: "/gestion/apoderados/vinculacion",
      etiqueta: "Relación alumno-apoderado",
    },
    {
      titulo: "Autorizaciones y Retiro",
      descripcion:
        "Administra autorizaciones de retiro, contactos de emergencia, adultos habilitados y observaciones de seguridad.",
      icono: ShieldCheck,
      ruta: "/gestion/apoderados/autorizaciones",
      etiqueta: "Seguridad escolar",
    },
  ];

  return (
    <div className="apoderados-page">
      <section className="apoderados-hero">
        <div>
          <span className="apoderados-chip">
            <HeartHandshake size={16} />
            Gestión de familias
          </span>

          <h1>Apoderados</h1>

          <p>
            Administra el registro de apoderados, sus datos de contacto,
            vínculos familiares con alumnos y autorizaciones relevantes para la
            seguridad escolar de Italito.
          </p>
        </div>
      </section>

      <section className="apoderados-resumen">
        <article>
          <div className="resumen-icon azul">
            <UsersRound size={22} />
          </div>
          <div>
            <span>Registro central</span>
            <strong>Apoderados</strong>
          </div>
        </article>

        <article>
          <div className="resumen-icon verde">
            <UserPlus size={22} />
          </div>
          <div>
            <span>Ingreso y edición</span>
            <strong>Ficha única</strong>
          </div>
        </article>

        <article>
          <div className="resumen-icon morado">
            <Phone size={22} />
          </div>
          <div>
            <span>Comunicación</span>
            <strong>Contacto</strong>
          </div>
        </article>

        <article>
          <div className="resumen-icon naranja">
            <FileCheck2 size={22} />
          </div>
          <div>
            <span>Seguridad</span>
            <strong>Autorizaciones</strong>
          </div>
        </article>
      </section>

      <section className="apoderados-grid">
        {accesos.map((item) => {
          const Icono = item.icono;

          return (
            <Link
              key={item.ruta}
              to={item.ruta}
              className={`apoderado-card ${item.destacado ? "destacado" : ""}`}
            >
              <div className="apoderado-card-top">
                <div className="apoderado-icon">
                  <Icono size={25} />
                </div>

                <span>{item.etiqueta}</span>
              </div>

              <h2>{item.titulo}</h2>

              <p>{item.descripcion}</p>

              <div className="apoderado-card-action">
                Abrir módulo
                <ArrowRight size={18} />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="apoderados-info">
        <div>
          <h3>Menos módulos, más claridad</h3>
          <p>
            El ingreso de nuevos apoderados y la edición de datos de contacto
            estarán integrados directamente en la Base de Apoderados. Así se
            evita duplicar pantallas y se mantiene una ficha única por persona.
          </p>
        </div>

        <Link to="/gestion/apoderados/base" className="apoderados-info-btn">
          Ir a Base de Apoderados
          <ArrowRight size={18} />
        </Link>
      </section>

      <style>{`
        .apoderados-page {
          width: 100%;
          min-height: 100%;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.10), transparent 34%),
            radial-gradient(circle at top right, rgba(16, 185, 129, 0.10), transparent 32%),
            #f8fafc;
          color: #0f172a;
        }

        .apoderados-hero {
          padding: 30px;
          border-radius: 28px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: white;
          box-shadow: 0 22px 50px rgba(15, 23, 42, 0.18);
          margin-bottom: 22px;
        }

        .apoderados-chip {
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

        .apoderados-hero h1 {
          margin: 0;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .apoderados-hero p {
          max-width: 820px;
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 15px;
          line-height: 1.6;
        }

        .apoderados-resumen {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .apoderados-resumen article {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-radius: 24px;
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 14px 35px rgba(15, 23, 42, 0.06);
        }

        .resumen-icon {
          width: 48px;
          height: 48px;
          border-radius: 18px;
          display: grid;
          place-items: center;
        }

        .resumen-icon.azul {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .resumen-icon.verde {
          background: #ecfdf5;
          color: #047857;
        }

        .resumen-icon.morado {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .resumen-icon.naranja {
          background: #fff7ed;
          color: #ea580c;
        }

        .apoderados-resumen span {
          display: block;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .apoderados-resumen strong {
          display: block;
          font-size: 20px;
          line-height: 1;
          margin-top: 5px;
        }

        .apoderados-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 22px;
        }

        .apoderado-card {
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

        .apoderado-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 22px 50px rgba(15, 23, 42, 0.11);
          border-color: #bfdbfe;
        }

        .apoderado-card.destacado {
          background: linear-gradient(180deg, #ffffff, #eff6ff);
          border-color: #bfdbfe;
        }

        .apoderado-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .apoderado-icon {
          width: 54px;
          height: 54px;
          border-radius: 19px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .apoderado-card-top span {
          padding: 7px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #475569;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .apoderado-card h2 {
          margin: 0;
          font-size: 21px;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .apoderado-card p {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.55;
        }

        .apoderado-card-action {
          margin-top: auto;
          padding-top: 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #1d4ed8;
          font-weight: 900;
          font-size: 14px;
        }

        .apoderados-info {
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

        .apoderados-info h3 {
          margin: 0;
          font-size: 21px;
          letter-spacing: -0.03em;
        }

        .apoderados-info p {
          margin: 8px 0 0;
          color: #64748b;
          line-height: 1.55;
          font-size: 14px;
        }

        .apoderados-info-btn {
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
          .apoderados-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .apoderados-resumen {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .apoderados-page {
            padding: 10px;
          }

          .apoderados-hero {
            padding: 22px;
            border-radius: 22px;
            margin-bottom: 14px;
          }

          .apoderados-hero h1 {
            font-size: 32px;
          }

          .apoderados-hero p {
            font-size: 14px;
          }

          .apoderados-resumen {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 14px;
          }

          .apoderados-resumen article {
            border-radius: 20px;
            padding: 14px;
          }

          .apoderados-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 14px;
          }

          .apoderado-card {
            min-height: auto;
            border-radius: 22px;
            padding: 18px;
          }

          .apoderado-card-top {
            margin-bottom: 14px;
          }

          .apoderado-icon {
            width: 48px;
            height: 48px;
            border-radius: 17px;
          }

          .apoderado-card h2 {
            font-size: 20px;
          }

          .apoderados-info {
            flex-direction: column;
            align-items: stretch;
            border-radius: 22px;
            padding: 18px;
          }

          .apoderados-info-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default Apoderados;