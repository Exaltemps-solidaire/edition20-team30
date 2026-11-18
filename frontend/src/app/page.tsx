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
import { donateurs, plafondEmailsParDefaut } from "../lib/donateurs";
import {
  aAtteintLePlafond,
  calculerBadge,
  calculerDestinataires,
  libellesBadge,
  messageSollicitation,
  reglesParDefaut,
  validerRegles,
  type NiveauBadge,
  type ReglesBadges,
} from "../lib/badges";
import {
  ajouterCampagne,
  campagnesInitiales,
  libellesTypeCampagne,
  type Campagne,
  type TypeCampagne,
} from "../lib/campagnes";

type Section = "plan" | "donateurs" | "campagnes";

export default function Home() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [section, setSection] = useState<Section>("plan");

  // --- Plan de comm ---
  const [communications, setCommunications] = useState<Communication[]>(communicationsInitiales);
  const [erreur, setErreur] = useState<string | null>(null);
  const [profil, setProfil] = useState<Profil>("nouveau");
  const [cibleBadge, setCibleBadge] = useState<NiveauBadge>("bronze");
  const [date, setDate] = useState("");
  const [canal, setCanal] = useState<"email" | "sms">("email");
  const [contenu, setContenu] = useState("");

  // --- Donateurs / badges ---
  const [regles, setRegles] = useState<ReglesBadges>(reglesParDefaut);
  const [erreurRegles, setErreurRegles] = useState<string | null>(null);
  const [filtreBadge, setFiltreBadge] = useState<NiveauBadge | "tous">("tous");
  const [plafondEmails, setPlafondEmails] = useState(plafondEmailsParDefaut);
  const [filtrePlafondAtteint, setFiltrePlafondAtteint] = useState(false);

  // --- Campagnes ---
  const [campagnes, setCampagnes] = useState<Campagne[]>(campagnesInitiales);
  const [modalCampagneOuverte, setModalCampagneOuverte] = useState(false);
  const [erreurCampagne, setErreurCampagne] = useState<string | null>(null);

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
      setCommunications(
        ajouterCommunication(communications, { profil, cibleBadge, date, canal, contenu }),
      );
      setErreur(null);
      setDate("");
      setContenu("");
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur");
    }
  }

  function choisirCibleBadge(badge: NiveauBadge) {
    setCibleBadge(badge);
    if (!contenu.trim()) {
      setContenu(messageSollicitation[badge]);
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

  function soumettreCampagne(nouvelle: {
    nom: string;
    type: TypeCampagne;
    contenu: string;
    ciblesBadges: NiveauBadge[];
  }) {
    try {
      setCampagnes(ajouterCampagne(campagnes, nouvelle));
      setErreurCampagne(null);
      setModalCampagneOuverte(false);
    } catch (err) {
      setErreurCampagne(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.entete}>
        <h1 className={styles.titre}>
          {section === "plan" ? "Plan de comm" : section === "donateurs" ? "Donateurs" : "Campagnes"}
        </h1>
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
        <button
          type="button"
          className={section === "campagnes" ? styles.ongletActif : styles.onglet}
          onClick={() => setSection("campagnes")}
        >
          Campagnes
        </button>
      </nav>

      {section === "plan" ? (
        <SectionPlanDeComm
          communications={communications}
          erreur={erreur}
          profil={profil}
          cibleBadge={cibleBadge}
          date={date}
          canal={canal}
          contenu={contenu}
          regles={regles}
          plafondEmails={plafondEmails}
          setProfil={setProfil}
          choisirCibleBadge={choisirCibleBadge}
          setDate={setDate}
          setCanal={setCanal}
          setContenu={setContenu}
          soumettreAjout={soumettreAjout}
          deplacer={deplacer}
        />
      ) : section === "donateurs" ? (
        <SectionDonateurs
          regles={regles}
          erreurRegles={erreurRegles}
          filtreBadge={filtreBadge}
          setFiltreBadge={setFiltreBadge}
          modifierRegle={modifierRegle}
          plafondEmails={plafondEmails}
          setPlafondEmails={setPlafondEmails}
          filtrePlafondAtteint={filtrePlafondAtteint}
          setFiltrePlafondAtteint={setFiltrePlafondAtteint}
        />
      ) : (
        <SectionCampagnes
          campagnes={campagnes}
          modalOuverte={modalCampagneOuverte}
          ouvrirModal={() => setModalCampagneOuverte(true)}
          fermerModal={() => {
            setModalCampagneOuverte(false);
            setErreurCampagne(null);
          }}
          erreur={erreurCampagne}
          soumettre={soumettreCampagne}
        />
      )}
    </div>
  );
}

function SectionPlanDeComm(props: {
  communications: Communication[];
  erreur: string | null;
  profil: Profil;
  cibleBadge: NiveauBadge;
  date: string;
  canal: "email" | "sms";
  contenu: string;
  regles: ReglesBadges;
  plafondEmails: number;
  setProfil: (p: Profil) => void;
  choisirCibleBadge: (b: NiveauBadge) => void;
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
          <select
            className={styles.champ}
            value={props.cibleBadge}
            onChange={(e) => props.choisirCibleBadge(e.target.value as NiveauBadge)}
          >
            {Object.entries(libellesBadge).map(([valeur, libelle]) => (
              <option key={valeur} value={valeur}>
                Badge {libelle}
              </option>
            ))}
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
                  <span className={`${styles.tagBadge} ${styles[`badge-${comm.cibleBadge}`]}`}>
                    {libellesBadge[comm.cibleBadge]}
                  </span>
                  <span className={styles.tag}>
                    {
                      calculerDestinataires(donateurs, props.regles, comm.cibleBadge, props.plafondEmails)
                        .length
                    }{" "}
                    destinataire(s)
                  </span>
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
  plafondEmails: number;
  setPlafondEmails: (v: number) => void;
  filtrePlafondAtteint: boolean;
  setFiltrePlafondAtteint: (v: boolean) => void;
}) {
  const donateursAvecBadge = useMemo(
    () =>
      donateurs.map((d) => ({ ...d, badge: calculerBadge(d, props.regles) })),
    [props.regles],
  );

  const donateursFiltres = donateursAvecBadge
    .filter((d) => props.filtreBadge === "tous" || d.badge === props.filtreBadge)
    .filter((d) => !props.filtrePlafondAtteint || aAtteintLePlafond(d, props.plafondEmails));

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
        <label className={styles.champLabel}>
          Plafond anti-spam
          <input
            className={styles.champNombre}
            type="number"
            min={0}
            value={props.plafondEmails}
            onChange={(e) => props.setPlafondEmails(Number(e.target.value))}
          />
          emails
        </label>
        <label className={styles.champLabel}>
          <input
            type="checkbox"
            checked={props.filtrePlafondAtteint}
            onChange={(e) => props.setFiltrePlafondAtteint(e.target.checked)}
          />{" "}
          Plafond atteint uniquement
        </label>
      </div>

      <ul className={styles.listeComms}>
        {donateursFiltres.map((d) => (
          <li key={d.id} className={styles.comm}>
            <div className={styles.commContenu}>{d.nom}</div>
            <div className={styles.commMeta}>
              <span>{d.nombreDons} dons</span>
              <span>{d.montantAnnuel} €/an</span>
              <span>{d.emailsRecus} email(s) reçu(s)</span>
              {d.badge && (
                <span className={`${styles.tagBadge} ${styles[`badge-${d.badge}`]}`}>
                  {libellesBadge[d.badge]}
                </span>
              )}
              {aAtteintLePlafond(d, props.plafondEmails) && (
                <span className={styles.tagPlafond}>Plafond atteint</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionCampagnes(props: {
  campagnes: Campagne[];
  modalOuverte: boolean;
  ouvrirModal: () => void;
  fermerModal: () => void;
  erreur: string | null;
  soumettre: (nouvelle: {
    nom: string;
    type: TypeCampagne;
    contenu: string;
    ciblesBadges: NiveauBadge[];
  }) => void;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.formLigne} style={{ marginBottom: "1rem" }}>
        <button type="button" className={styles.boutonPrimaire} onClick={props.ouvrirModal}>
          + Nouvelle campagne
        </button>
      </div>

      <ul className={styles.listeComms}>
        {props.campagnes.map((camp) => (
          <li key={camp.id} className={styles.comm}>
            <div>
              <div className={styles.commContenu}>
                <strong>{camp.nom}</strong>
              </div>
              <div className={styles.commContenu}>{camp.contenu}</div>
            </div>
            <div className={styles.commMeta}>
              <span className={styles.tag}>{libellesTypeCampagne[camp.type]}</span>
              {camp.ciblesBadges.map((b) => (
                <span key={b} className={`${styles.tagBadge} ${styles[`badge-${b}`]}`}>
                  {libellesBadge[b]}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {props.modalOuverte && (
        <ModalCampagne erreur={props.erreur} fermer={props.fermerModal} soumettre={props.soumettre} />
      )}
    </section>
  );
}

function ModalCampagne(props: {
  erreur: string | null;
  fermer: () => void;
  soumettre: (nouvelle: {
    nom: string;
    type: TypeCampagne;
    contenu: string;
    ciblesBadges: NiveauBadge[];
  }) => void;
}) {
  const [nom, setNom] = useState("");
  const [type, setType] = useState<TypeCampagne>("anniversaire-don");
  const [contenu, setContenu] = useState("");
  const [ciblesBadges, setCiblesBadges] = useState<NiveauBadge[]>([]);

  function basculerBadge(b: NiveauBadge) {
    setCiblesBadges((liste) =>
      liste.includes(b) ? liste.filter((x) => x !== b) : [...liste, b],
    );
  }

  return (
    <div className={styles.modalFond} onClick={props.fermer}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.carteTitre}>Nouvelle campagne</div>

        <label className={styles.champLabel}>
          Nom
          <input
            className={styles.champLarge}
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </label>

        <label className={styles.champLabel}>
          Type
          <select
            className={styles.champ}
            value={type}
            onChange={(e) => setType(e.target.value as TypeCampagne)}
          >
            {Object.entries(libellesTypeCampagne).map(([valeur, libelle]) => (
              <option key={valeur} value={valeur}>
                {libelle}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.champLabel}>
          Badges ciblés (un ou plusieurs)
          <div className={styles.formLigne}>
            {Object.entries(libellesBadge).map(([valeur, libelle]) => (
              <label key={valeur} className={styles.filtreBadgeOption}>
                <input
                  type="checkbox"
                  checked={ciblesBadges.includes(valeur as NiveauBadge)}
                  onChange={() => basculerBadge(valeur as NiveauBadge)}
                />{" "}
                {libelle}
              </label>
            ))}
          </div>
        </div>

        <label className={styles.champLabel}>
          Contenu
          <textarea
            className={styles.champLarge}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
          />
        </label>

        {props.erreur && <div className={styles.erreur}>{props.erreur}</div>}

        <div className={styles.formLigne}>
          <button
            type="button"
            className={styles.boutonPrimaire}
            onClick={() => props.soumettre({ nom, type, contenu, ciblesBadges })}
          >
            Créer la campagne
          </button>
          <button type="button" className={styles.boutonSecondaire} onClick={props.fermer}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
