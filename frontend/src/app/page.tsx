"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  communications as communicationsInitiales,
  libellesProfil,
  personas,
  type Communication,
  type Persona,
  type Profil,
} from "../lib/donnees";
import { regrouperParSemaine } from "../lib/semaine";
import { ajouterCommunication, deplacerCommunication } from "../lib/communications";

export default function Home() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [communications, setCommunications] = useState<Communication[]>(communicationsInitiales);
  const [erreur, setErreur] = useState<string | null>(null);
  const [profil, setProfil] = useState<Profil>("nouveau");
  const [date, setDate] = useState("");
  const [canal, setCanal] = useState<"email" | "sms">("email");
  const [contenu, setContenu] = useState("");

  if (!persona) {
    return (
      <div className={styles.page}>
        <h1 className={styles.titre}>Qui êtes-vous ?</h1>
        <div className={styles.listePersonas}>
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.cartePersona}
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

  function soumettreAjout(e: React.FormEvent) {
    e.preventDefault();
    try {
      setCommunications(ajouterCommunication(communications, { profil, date, canal, contenu }));
      setErreur(null);
      setDate("");
      setContenu("");
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    }
  }

  function deplacer(id: string, nouvelleDate: string) {
    if (!nouvelleDate) return;
    setCommunications(deplacerCommunication(communications, id, nouvelleDate));
  }

  return (
    <div className={styles.page}>
      <div className={styles.entete}>
        <h1 className={styles.titre}>Plan de comm</h1>
        <div>
          <span className={styles.personaActuel}>
            {persona.nom} · {persona.role}
          </span>{" "}
          <button
            type="button"
            className={styles.boutonSecondaire}
            onClick={() => setPersona(null)}
          >
            Changer de persona
          </button>
        </div>
      </div>

      <form className={styles.carte} onSubmit={soumettreAjout}>
        <div className={styles.formLigne}>
          <select
            className={styles.champ}
            value={profil}
            onChange={(e) => setProfil(e.target.value as Profil)}
          >
            {Object.entries(libellesProfil).map(([valeur, libelle]) => (
              <option key={valeur} value={valeur}>
                {libelle}
              </option>
            ))}
          </select>
          <input
            className={styles.champ}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            className={styles.champ}
            value={canal}
            onChange={(e) => setCanal(e.target.value as "email" | "sms")}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          <input
            className={styles.champLarge}
            type="text"
            placeholder="Contenu de la communication"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
          />
          <button type="submit" className={styles.boutonPrimaire}>
            Ajouter
          </button>
        </div>
        {erreur && <div className={styles.erreur}>{erreur}</div>}
      </form>

      {parSemaine.map(([semaine, comms]) => (
        <section key={semaine} className={styles.semaine}>
          <div className={styles.semaineTitre}>Semaine du {semaine}</div>
          <ul className={styles.listeComms}>
            {comms.map((comm) => (
              <li key={comm.id} className={styles.comm}>
                <div className={styles.commContenu}>{comm.contenu}</div>
                <div className={styles.commMeta}>
                  <span className={styles.tag}>{libellesProfil[comm.profil]}</span>
                  <span className={styles.tag}>{comm.canal}</span>
                  <input
                    className={styles.champDate}
                    type="date"
                    defaultValue={comm.date}
                    onChange={(e) => deplacer(comm.id, e.target.value)}
                    aria-label={`Déplacer la communication ${comm.contenu}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
