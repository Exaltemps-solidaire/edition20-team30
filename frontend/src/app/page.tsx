"use client";

import { useMemo, useState } from "react";
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
import { donateurs } from "../lib/donateurs";
import {
  calculerBadge,
  libellesBadge,
  reglesParDefaut,
  validerRegles,
  type NiveauBadge,
  type ReglesBadges,
} from "../lib/badges";

type Section = "plan" | "donateurs";

export default function Home() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [section, setSection] = useState<Section>("plan");

  // --- Plan de comm ---
  const [communications, setCommunications] = useState<Communication[]>(communicationsInitiales);
  const [erreur, setErreur] = useState<string | null>(null);
  const [profil, setProfil] = useState<Profil>("nouveau");
  const [date, setDate] = useState("");
  const [canal, setCanal] = useState<"email" | "sms">("email");
  const [contenu, setContenu] = useState("");

  // --- Donateurs / badges ---
  const [regles, setRegles] = useState<ReglesBadges>(reglesParDefaut);
  const [erreurRegles, setErreurRegles] = useState<string | null>(null);
  const [filtreBadge, setFiltreBadge] = useState<NiveauBadge | "tous">("tous");

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

  function modifierRegle(champ: keyof ReglesBadges, valeur: number) {
    const nouvellesRegles = { ...regles, [champ]: valeur };
    const erreurValidation = validerRegles(nouvellesRegles);
    setErreurRegles(erreurValidation);
    if (!erreurValidation) {
      setRegles(nouvellesRegles);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.entete}>
        <h1 className={styles.titre}>{section === "plan" ? "Plan de comm" : "Donateurs"}</h1>
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

      <nav className={styles.onglets}>
        <button
          type="button"
          className={section === "plan" ? styles.ongletActif : styles.onglet}
          onClick={() => setSection("plan")}
        >
          Plan de comm
        </button>
        <button
          type="button"
          className={section === "donateurs" ? styles.ongletActif : styles.onglet}
          onClick={() => setSection("donateurs")}
        >
          Donateurs
        </button>
      </nav>

      {section === "plan" ? (
        <SectionPlanDeComm
          communications={communications}
          erreur={erreur}
          profil={profil}
          date={date}
          canal={canal}
          contenu={contenu}
          setProfil={setProfil}
          setDate={setDate}
          setCanal={setCanal}
          setContenu={setContenu}
          soumettreAjout={soumettreAjout}
          deplacer={deplacer}
        />
      ) : (
        <SectionDonateurs
          regles={regles}
          erreurRegles={erreurRegles}
          filtreBadge={filtreBadge}
          setFiltreBadge={setFiltreBadge}
          modifierRegle={modifierRegle}
        />
      )}
    </div>
  );
}

function SectionPlanDeComm(props: {
  communications: Communication[];
  erreur: string | null;
  profil: Profil;
  date: string;
  canal: "email" | "sms";
  contenu: string;
  setProfil: (p: Profil) => void;
  setDate: (d: string) => void;
  setCanal: (c: "email" | "sms") => void;
  setContenu: (c: string) => void;
  soumettreAjout: (e: React.FormEvent) => void;
  deplacer: (id: string, date: string) => void;
}) {
  const parSemaine = [...regrouperParSemaine(props.communications).entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <section className={styles.section}>
      <form className={styles.carte} onSubmit={props.soumettreAjout}>
        <div className={styles.formLigne}>
          <select
            className={styles.champ}
            value={props.profil}
            onChange={(e) => props.setProfil(e.target.value as Profil)}
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
            value={props.date}
            onChange={(e) => props.setDate(e.target.value)}
          />
          <select
            className={styles.champ}
            value={props.canal}
            onChange={(e) => props.setCanal(e.target.value as "email" | "sms")}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          <input
            className={styles.champLarge}
            type="text"
            placeholder="Contenu de la communication"
            value={props.contenu}
            onChange={(e) => props.setContenu(e.target.value)}
          />
          <button type="submit" className={styles.boutonPrimaire}>
            Ajouter
          </button>
        </div>
        {props.erreur && <div className={styles.erreur}>{props.erreur}</div>}
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
                    onChange={(e) => props.deplacer(comm.id, e.target.value)}
                    aria-label={`Déplacer la communication ${comm.contenu}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}

function SectionDonateurs(props: {
  regles: ReglesBadges;
  erreurRegles: string | null;
  filtreBadge: NiveauBadge | "tous";
  setFiltreBadge: (b: NiveauBadge | "tous") => void;
  modifierRegle: (champ: keyof ReglesBadges, valeur: number) => void;
}) {
  const donateursAvecBadge = useMemo(
    () =>
      donateurs.map((d) => ({ ...d, badge: calculerBadge(d, props.regles) })),
    [props.regles],
  );

  const donateursFiltres = donateursAvecBadge.filter(
    (d) => props.filtreBadge === "tous" || d.badge === props.filtreBadge,
  );

  return (
    <section className={styles.section}>
      <div className={styles.carte}>
        <div className={styles.carteTitre}>Règles des badges</div>
        <div className={styles.formLigne}>
          <label className={styles.champLabel}>
            Bronze dès
            <input
              className={styles.champNombre}
              type="number"
              min={0}
              value={props.regles.bronzeDonsMin}
              onChange={(e) => props.modifierRegle("bronzeDonsMin", Number(e.target.value))}
            />
            dons
          </label>
          <label className={styles.champLabel}>
            Argent dès
            <input
              className={styles.champNombre}
              type="number"
              min={0}
              value={props.regles.argentDonsMin}
              onChange={(e) => props.modifierRegle("argentDonsMin", Number(e.target.value))}
            />
            dons ou
            <input
              className={styles.champNombre}
              type="number"
              min={0}
              value={props.regles.argentMontantMin}
              onChange={(e) => props.modifierRegle("argentMontantMin", Number(e.target.value))}
            />
            €/an
          </label>
          <label className={styles.champLabel}>
            Or dès
            <input
              className={styles.champNombre}
              type="number"
              min={0}
              value={props.regles.orDonsMin}
              onChange={(e) => props.modifierRegle("orDonsMin", Number(e.target.value))}
            />
            dons ou
            <input
              className={styles.champNombre}
              type="number"
              min={0}
              value={props.regles.orMontantMin}
              onChange={(e) => props.modifierRegle("orMontantMin", Number(e.target.value))}
            />
            €/an
          </label>
        </div>
        {props.erreurRegles && <div className={styles.erreur}>{props.erreurRegles}</div>}
      </div>

      <div className={styles.formLigne} style={{ marginBottom: "1rem" }}>
        <label className={styles.champLabel}>
          Filtrer par badge
          <select
            className={styles.champ}
            value={props.filtreBadge}
            onChange={(e) => props.setFiltreBadge(e.target.value as NiveauBadge | "tous")}
          >
            <option value="tous">Tous</option>
            <option value="bronze">Bronze</option>
            <option value="argent">Argent</option>
            <option value="or">Or</option>
          </select>
        </label>
      </div>

      <ul className={styles.listeComms}>
        {donateursFiltres.map((d) => (
          <li key={d.id} className={styles.comm}>
            <div className={styles.commContenu}>{d.nom}</div>
            <div className={styles.commMeta}>
              <span>{d.nombreDons} dons</span>
              <span>{d.montantAnnuel} €/an</span>
              {d.badge && (
                <span className={`${styles.tagBadge} ${styles[`badge-${d.badge}`]}`}>
                  {libellesBadge[d.badge]}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
