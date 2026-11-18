"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { communications, libellesProfil, personas, type Persona } from "../lib/donnees";
import { regrouperParSemaine } from "../lib/semaine";

export default function Home() {
  const [persona, setPersona] = useState<Persona | null>(null);

  if (!persona) {
    return (
      <div className={styles.page}>
        <h1>Qui êtes-vous ?</h1>
        <div className={styles.listePersonas}>
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.carteBersona}
              onClick={() => setPersona(p)}
            >
              <strong>{p.nom}</strong>
              <div>{p.role}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const parSemaine = [...regrouperParSemaine(communications).entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div className={styles.page}>
      <div className={styles.entete}>
        <h1>Plan de comm</h1>
        <div>
          <span className={styles.personaActuel}>
            {persona.nom} · {persona.role}
          </span>{" "}
          <button
            type="button"
            className={styles.boutonChangerPersona}
            onClick={() => setPersona(null)}
          >
            Changer de persona
          </button>
        </div>
      </div>
      {parSemaine.map(([semaine, comms]) => (
        <section key={semaine} className={styles.semaine}>
          <div className={styles.semaineTitre}>Semaine du {semaine}</div>
          <ul className={styles.listeComms}>
            {comms.map((comm) => (
              <li key={comm.id} className={styles.comm}>
                <div>{comm.contenu}</div>
                <div className={styles.commMeta}>
                  {libellesProfil[comm.profil]} · {comm.date} · {comm.canal}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
