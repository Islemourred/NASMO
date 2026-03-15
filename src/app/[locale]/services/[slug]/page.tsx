"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

const servicesData: Record<string, {
  title: string; subtitle: string; hero: string; desc: string;
  longDesc: string; icon: string;
  features: { title: string; desc: string }[];
  specs: { label: string; value: string }[];
  partner?: string;
}> = {
  "montage-installation": {
    title: "Montage & Installation Électrique",
    subtitle: "Solutions électriques industrielles BT/MT",
    hero: "/images/service-electrical.png",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    desc: "Installation et mise en service d'équipements électriques industriels pour tous secteurs d'activité.",
    longDesc: "ENTRELEC assure la conception, le montage et la mise en service d'installations électriques industrielles en basse et moyenne tension. Notre expertise couvre l'ensemble des secteurs d'activité : industrie lourde, agroalimentaire, pharmaceutique, tertiaire et résidentiel haut de gamme. Nous intervenons sur l'ensemble du territoire national avec des équipes qualifiées et certifiées.",
    features: [
      { title: "Installation BT/MT", desc: "Câblage, raccordement et mise en service de tableaux basse et moyenne tension" },
      { title: "Automatisation industrielle", desc: "Intégration de systèmes d'automatisation et de contrôle-commande" },
      { title: "Mise en conformité", desc: "Audits électriques et mise aux normes selon la réglementation en vigueur" },
      { title: "Maintenance préventive", desc: "Contrats de maintenance adaptés à vos installations pour garantir la continuité" },
      { title: "Études techniques", desc: "Bureau d'études intégré pour la conception et le dimensionnement" },
      { title: "Certification", desc: "Installations conformes aux normes algériennes et internationales" },
    ],
    specs: [
      { label: "Tension", value: "BT / MT" },
      { label: "Secteurs", value: "Industrie, Tertiaire" },
      { label: "Couverture", value: "Nationale" },
      { label: "Certification", value: "ISO 9001" },
    ],
  },
  "balisage-aeroports": {
    title: "Équipements d'Aéroports & Balisage",
    subtitle: "Balisage des pistes d'atterrissage",
    hero: "/images/service-airport.png",
    icon: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5",
    desc: "Fourniture et installation de systèmes d'aide à la navigation aérienne et balisage lumineux.",
    longDesc: "ENTRELEC est un acteur majeur dans la fourniture et l'installation de systèmes de balisage aéroportuaire en Algérie. Nos équipes interviennent sur l'ensemble des aéroports du pays pour assurer la sécurité des opérations aériennes grâce à des systèmes de balisage lumineux conformes aux normes OACI et FAA.",
    features: [
      { title: "Balisage de piste", desc: "Installation de feux d'approche, de seuil et de bord de piste" },
      { title: "Systèmes PAPI", desc: "Indicateurs visuels de pente d'approche pour atterrissage de précision" },
      { title: "Balisage taxiway", desc: "Éclairage de voies de circulation et aires de stationnement" },
      { title: "Contrôle centralisé", desc: "Systèmes de gestion et de régulation du balisage aéroportuaire" },
      { title: "Maintenance", desc: "Contrats de maintenance et support technique 24/7" },
      { title: "Formation", desc: "Formation du personnel aéroportuaire à l'exploitation des systèmes" },
    ],
    specs: [
      { label: "Normes", value: "OACI / FAA" },
      { label: "Type", value: "CAT I, II, III" },
      { label: "Couverture", value: "15+ aéroports" },
      { label: "Disponibilité", value: "24/7" },
    ],
  },
  "augier-energie": {
    title: "Augier Énergie",
    subtitle: "Partenaire Augier Energy",
    hero: "/images/service-equipment.png",
    icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
    desc: "Distribution et intégration de solutions énergétiques Augier pour la distribution électrique.",
    longDesc: "En tant que partenaire officiel d'Augier Energy, ENTRELEC assure la distribution et l'intégration de gammes complètes de transformateurs, systèmes de protection et équipements de distribution électrique haute performance. Ces solutions répondent aux exigences les plus strictes des secteurs industriel, pétrolier et gazier.",
    partner: "Augier Energy",
    features: [
      { title: "Transformateurs", desc: "Transformateurs de puissance et de distribution jusqu'à 100 MVA" },
      { title: "Cellules MT", desc: "Cellules de protection et de coupure moyenne tension" },
      { title: "Protection électrique", desc: "Relais de protection numériques et systèmes de supervision" },
      { title: "Distribution HT/BT", desc: "Tableaux de distribution et jeux de barres" },
      { title: "Automatismes", desc: "Automates de gestion de réseau et délestage" },
      { title: "Support technique", desc: "Assistance technique et pièces de rechange Augier" },
    ],
    specs: [
      { label: "Partenaire", value: "Augier Energy" },
      { label: "Puissance", value: "Jusqu'à 100 MVA" },
      { label: "Gamme", value: "HT / MT / BT" },
      { label: "Garantie", value: "Constructeur" },
    ],
  },
  "onduleurs-stabilisateurs": {
    title: "Onduleurs & Stabilisateurs DELTA",
    subtitle: "Protection électrique DELTA",
    hero: "/images/product-delta.png",
    icon: "M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25",
    desc: "Onduleurs UPS et stabilisateurs de tension DELTA pour la protection de vos équipements critiques.",
    longDesc: "ENTRELEC est distributeur officiel de la marque DELTA en Algérie. Nous proposons une gamme complète d'onduleurs UPS (Online, Line-Interactive) et de stabilisateurs de tension pour protéger vos équipements sensibles contre les perturbations électriques. Nos solutions sont adaptées aux datacenters, hôpitaux, industries et bâtiments tertiaires.",
    partner: "DELTA",
    features: [
      { title: "UPS Online", desc: "Protection totale avec double conversion et autonomie extensible" },
      { title: "UPS modulaire", desc: "Architecture modulaire évolutive pour datacenters" },
      { title: "Stabilisateurs", desc: "Régulation de tension triphasée précise et continue" },
      { title: "Batteries", desc: "Solutions de stockage et gestion intelligente des batteries" },
      { title: "Monitoring", desc: "Supervision à distance via plateforme cloud" },
      { title: "Maintenance", desc: "Contrats de maintenance et intervention rapide" },
    ],
    specs: [
      { label: "Partenaire", value: "DELTA" },
      { label: "Puissance", value: "1 KVA – 4 MVA" },
      { label: "Technologie", value: "Online / Modulaire" },
      { label: "Rendement", value: "Jusqu'à 96%" },
    ],
  },
  "groupes-electrogenes": {
    title: "Groupes Électrogènes",
    subtitle: "Electra Molins — Énergie de secours",
    hero: "/images/product-emb2800.png",
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5",
    desc: "Groupes électrogènes Electra Molins pour l'industrie et le tertiaire.",
    longDesc: "ENTRELEC est le représentant exclusif d'Electra Molins en Algérie. Nous offrons une gamme complète de groupes électrogènes diesel allant de 10 KVA à 3500 KVA, disponibles en version ouverte ou insonorisée. Nos solutions garantissent une alimentation de secours fiable pour vos installations industrielles, hospitalières et commerciales.",
    partner: "Electra Molins",
    features: [
      { title: "Groupes diesel", desc: "Moteurs Perkins, Volvo et MTU de 10 à 3500 KVA" },
      { title: "Version insonorisée", desc: "Caissons acoustiques pour installation en zone urbaine" },
      { title: "Installation clé en main", desc: "Génie civil, raccordement et mise en service complète" },
      { title: "Inverseurs de source", desc: "Commutation automatique réseau / groupe" },
      { title: "Supervision", desc: "Télésurveillance et gestion à distance des groupes" },
      { title: "Pièces de rechange", desc: "Stock permanent de pièces et consommables" },
    ],
    specs: [
      { label: "Partenaire", value: "Electra Molins" },
      { label: "Puissance", value: "10 – 3500 KVA" },
      { label: "Carburant", value: "Diesel" },
      { label: "Options", value: "Insonorisé / Ouvert" },
    ],
  },
  "secteur-agl": {
    title: "Secteur AGL — OCEM",
    subtitle: "OCEM AirfieldTechnology",
    hero: "/images/service-airport.png",
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    desc: "Systèmes d'aide à l'atterrissage et balisage lumineux certifiés OACI/FAA.",
    longDesc: "ENTRELEC est partenaire d'OCEM AirfieldTechnology, leader mondial des solutions de balisage aéroportuaire. Nous assurons la fourniture, l'installation et la maintenance de systèmes AGL (Aeronautical Ground Lighting) conformes aux certifications OACI et FAA pour les aéroports civils et militaires en Algérie et en Afrique du Nord.",
    partner: "OCEM AirfieldTechnology",
    features: [
      { title: "Feux à LED", desc: "Éclairage de piste à LED haute intensité et faible consommation" },
      { title: "Régulateurs CCR", desc: "Régulateurs de courant constant pour alimentation des circuits" },
      { title: "Systèmes PAPI/VASI", desc: "Indicateurs visuels de plan de descente" },
      { title: "Balisage FATO", desc: "Solutions spécifiques pour hélistations et pistes courtes" },
      { title: "Monitoring ALCMS", desc: "Système de contrôle et monitoring centralisé du balisage" },
      { title: "Conformité", desc: "Certification OACI Annexe 14 et FAA AC 150/5345" },
    ],
    specs: [
      { label: "Partenaire", value: "OCEM" },
      { label: "Technologie", value: "LED / Halogène" },
      { label: "Normes", value: "OACI / FAA" },
      { label: "Applications", value: "Civil / Militaire" },
    ],
  },
};

export default function ServiceDetailPage() {
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const service = servicesData[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-txt mb-4">Service non trouvé</h1>
          <Link href={`/${locale}/services`} className="btn btn-primary">Retour aux services</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] max-h-[500px] overflow-hidden">
        <Image src={service.hero} alt={service.title} fill className="object-cover" sizes="100vw" />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg to-transparent z-10" />
        <div className="relative z-20 h-full container flex items-end pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <Link href={`/${locale}/services`}
              className="inline-flex items-center gap-2 text-white/40 text-[.78rem] font-medium hover:text-orange transition-colors mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Retour aux services
            </Link>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-orange flex items-center justify-center shadow-lg shadow-orange/25">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                </svg>
              </div>
              {service.partner && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-[.7rem] font-semibold backdrop-blur-sm border border-white/10">
                  Partenaire {service.partner}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">{service.title}</h1>
            <p className="text-white/40 text-[.95rem] mt-3 max-w-xl">{service.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-bg relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.025] pointer-events-none" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <AnimatedSection>
                <h2 className="text-xl font-extrabold text-txt mb-4 tracking-tight">Présentation</h2>
                <p className="text-txtsec text-[.92rem] leading-[1.9]">{service.longDesc}</p>
              </AnimatedSection>

              {/* Features grid */}
              <AnimatedSection>
                <h2 className="text-xl font-extrabold text-txt mb-6 tracking-tight">Nos prestations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * .05 }}
                      className="group p-5 rounded-2xl bg-surface border border-line hover:border-orange/20 transition-all">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange/[0.08] flex-shrink-0 mt-0.5 group-hover:bg-orange/[0.16] transition-colors">
                          <svg className="w-4 h-4 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                        <div>
                          <h3 className="text-[.88rem] font-bold text-txt mb-1 group-hover:text-orange transition-colors">{f.title}</h3>
                          <p className="text-txtmuted text-[.78rem] leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Specs card */}
              <AnimatedSection>
                <div className="card p-6 sticky top-24">
                  <h3 className="font-bold text-txt text-[.95rem] mb-5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange" />
                    Caractéristiques
                  </h3>
                  <div className="space-y-4">
                    {service.specs.map((sp, i) => (
                      <div key={i} className="flex justify-between items-center pb-3 border-b border-line last:border-0 last:pb-0">
                        <span className="text-txtmuted text-[.8rem]">{sp.label}</span>
                        <span className="text-txt text-[.82rem] font-semibold">{sp.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-line">
                    <Link href={`/${locale}/contact`}
                      className="btn btn-primary w-full justify-center text-[.82rem]">
                      Demander une fiche technique
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>

                  <div className="mt-4">
                    <Link href={`/${locale}/contact`}
                      className="btn btn-ghost w-full justify-center text-[.82rem]">
                      Nous contacter
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-bgalt">
        <div className="container">
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #061d3a, #0a2e5c 60%, #0f3d73)" }}>
              <div className="absolute inset-0 dot-grid opacity-[0.06]" />
              <div className="p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Intéressé par ce service ?</h3>
                  <p className="text-white/35 text-sm">
                    Contactez-nous pour une fiche technique — <span className="text-orange font-semibold">021 91 08 35</span>
                  </p>
                </div>
                <Link href={`/${locale}/contact`} className="btn btn-primary whitespace-nowrap">Demander une fiche technique</Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
