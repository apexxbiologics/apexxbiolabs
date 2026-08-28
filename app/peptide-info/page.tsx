"use client";

import { useState } from "react";


type Peptide = {
  id: string;
  category: string;
  name: string;
  details: string;
  description: string;
  mechanism: string;
  areas: string[];
};

export default function PeptideInfoPage() {
  const [openPeptide, setOpenPeptide] = useState<string | null>(null);

  const peptides: Peptide[] = [
    {
  id: "apx2",
  category: "Metabolic Research Peptide",
  name: "APX-2",
  details:
    "Synthetic Research Peptide | GIPR / GLP-1R Signaling Research",
  description:
    "APX-2 is a synthetic research peptide utilized in laboratory investigations involving glucose-dependent insulinotropic polypeptide receptor (GIPR) and glucagon-like peptide-1 receptor (GLP-1R) signaling pathways.",
  mechanism:
    "Experimental research evaluates APX-2 in relation to GIPR and GLP-1R receptor activity, metabolic signaling, cellular communication, glucose-regulatory pathways, and energy-balance research models.",
  areas: [
    "GIPR signaling research",
    "GLP-1R signaling research",
    "Dual receptor pathway studies",
    "Metabolic signaling research",
    "Cellular communication models",
  ],
},
    {
      id: "apx3",
      category: "Metabolic Research Peptide",
      name: "APX-3",
      details:
        "39 amino acids | MW: 4731.41 g/mol | GCGR / GIPR / GLP-1R Research Compound",
      description:
        "APX-3 is a synthetic research peptide utilized in laboratory investigations involving glucagon receptor, GIP receptor, and GLP-1 receptor signaling pathways.",
      mechanism:
        "Published experimental studies have evaluated APX-3 in preclinical and laboratory research settings to examine receptor interactions, signaling mechanisms, and receptor-mediated cellular pathways.",
      areas: [
        "Triple receptor signaling research",
        "GCGR pathway investigations",
        "GIPR pathway investigations",
        "GLP-1R pathway investigations",
        "Cellular signaling studies",
        "Receptor interaction research",
      ],
    },
    {
      id: "bpc157",
      category: "Tissue Research Peptide",
      name: "BPC-157",
      details: "15 amino acids | MW: 1419.55 g/mol | Sequence: GEPPPGKPADDAGLV",
      description:
        "BPC-157 is a synthetic pentadecapeptide studied in laboratory and preclinical models for cytoprotection, vascular signaling, gastrointestinal research, and tissue-repair pathway models.",
      mechanism:
        "Experimental studies have investigated BPC-157 for its interaction with nitric oxide pathways, VEGF-related signaling, cellular migration, growth-factor activity, and inflammatory pathway modulation.",
      areas: [
        "Tissue repair models",
        "Angiogenesis research",
        "GI mucosal integrity",
        "Nitric oxide pathways",
        "Connective tissue studies",
      ],
    },
    {
      id: "ghkcu",
      category: "Cellular Signaling Research Peptide",
      name: "GHK-Cu",
      details: "3 amino acids + Cu²⁺ | MW: 744.3 g/mol | Sequence: Gly-His-Lys:Cu²⁺",
      description:
        "GHK-Cu is a naturally occurring copper-binding tripeptide complex studied in models involving collagen synthesis, regenerative signaling, antioxidant pathways, and tissue-repair research.",
      mechanism:
        "Experimental studies have investigated GHK-Cu for copper transport, collagen production pathways, antioxidant signaling, inflammatory modulation, and extracellular matrix remodeling.",
      areas: [
        "Collagen synthesis research",
        "Tissue regeneration studies",
        "Antioxidant pathway models",
        "Extracellular matrix signaling",
        "Skin and connective tissue research",
      ],
    },
    {
      id: "kpv",
      category: "Immunology Research Peptide",
      name: "KPV",
      details: "3 amino acids | MW: 342.43 g/mol | Sequence: Lys-Pro-Val",
      description:
        "KPV is a naturally occurring tripeptide derived from alpha-melanocyte-stimulating hormone and is studied in inflammatory modulation, mucosal integrity, antimicrobial activity, and tissue-repair pathway research.",
      mechanism:
        "Experimental studies have investigated KPV for its interaction with NF-κB signaling, inflammatory cytokine modulation, antimicrobial mechanisms, mucosal barrier support, and cellular protection pathways.",
      areas: [
        "NF-κB inflammatory pathway research",
        "Gastrointestinal mucosal studies",
        "Antimicrobial peptide research",
        "Tissue-repair pathway models",
        "Cellular protection signaling",
      ],
    },
    {
      id: "pinealon",
      category: "Neurobiology Research Peptide",
      name: "Pinealon",
      details: "3 amino acids | MW: 418.40 g/mol | Sequence: Glu-Asp-Arg",
      description:
        "Pinealon is a synthetic tripeptide studied in laboratory and preclinical models involving neuroprotective signaling, neuronal communication pathways, oxidative-stress modulation, and cellular longevity research.",
      mechanism:
        "Experimental studies have investigated Pinealon for neuronal gene-expression pathways, oxidative-stress responses, mitochondrial signaling, and peptide-mediated neuroregulation.",
      areas: [
        "Neuroprotective pathway research",
        "Cognitive signaling studies",
        "Oxidative stress modulation",
        "Mitochondrial research models",
        "Cellular longevity investigations",
      ],
    },
    {
      id: "selank",
      category: "Nootropic Research Peptide",
      name: "Selank",
      details: "7 amino acids | MW: 751.9 g/mol | Synthetic Tuftsin Analog",
      description:
        "Selank is a synthetic heptapeptide derived from tuftsin and studied in neurochemical signaling, cognitive processes, stress-response pathways, and neuroimmune interactions.",
      mechanism:
        "Experimental studies have investigated Selank for GABAergic signaling, neurotransmitter regulation, neurotrophic-factor expression, immune-modulatory pathways, and stress-adaptation mechanisms.",
      areas: [
        "GABA signaling research",
        "Neurotransmitter pathway studies",
        "Cognitive-function models",
        "Neuroimmune interactions",
        "Stress-response pathway research",
      ],
    },
    {
      id: "semax",
      category: "Nootropic Research Peptide",
      name: "Semax",
      details: "7 amino acids | MW: 813.9 g/mol | ACTH(4-10) Analog",
      description:
        "Semax is a synthetic heptapeptide derived from the ACTH fragment ACTH(4-10) and studied in neurotrophic signaling, neuronal plasticity, and neuroprotective mechanisms.",
      mechanism:
        "Experimental studies have investigated Semax for BDNF pathways, neuronal plasticity signaling, neurotransmitter regulation, stress-response systems, and neuroprotective mechanisms.",
      areas: [
        "BDNF pathway research",
        "Neuroplasticity studies",
        "Cognitive-performance models",
        "Neuroprotection research",
        "Neurotransmitter signaling",
      ],
    },
    {
      id: "tb500",
      category: "Regenerative Research Peptide",
      name: "TB-500",
      details: "43 amino acids | MW: 4963.4 g/mol | Synthetic Thymosin Beta-4 Fragment",
      description:
        "TB-500 is a synthetic research peptide derived from thymosin beta-4 and studied in regeneration, angiogenesis, inflammatory signaling, and connective tissue research.",
      mechanism:
        "Experimental studies have investigated TB-500 for actin-regulating pathways, cellular migration mechanisms, angiogenic signaling, extracellular matrix remodeling, and tissue repair processes.",
      areas: [
        "Cellular migration research",
        "Angiogenesis studies",
        "Connective tissue research",
        "Tissue regeneration models",
        "Inflammatory pathway investigations",
      ],
    },
    {
      id: "motsc",
      category: "Mitochondrial Research Peptide",
      name: "MOTS-C",
      details: "16 amino acids | MW: 2174.5 g/mol | Mitochondrial-Derived Peptide",
      description:
        "MOTS-C is a mitochondrial-derived peptide studied in cellular energy regulation, metabolic signaling, mitochondrial communication, oxidative-stress responses, and adaptive stress-response pathways.",
      mechanism:
        "Experimental studies have investigated MOTS-C for AMPK-associated signaling, mitochondrial regulation, glucose metabolism mechanisms, cellular stress adaptation, and metabolic homeostasis models.",
      areas: [
        "Mitochondrial research",
        "AMPK pathway studies",
        "Cellular energy regulation",
        "Metabolic signaling research",
        "Oxidative stress investigations",
      ],
    },
    {
      id: "ara290",
      category: "Cytoprotective Research Peptide",
      name: "ARA-290",
      details: "11 amino acids | MW: 1257.4 g/mol | Erythropoietin-Derived Peptide",
      description:
        "ARA-290 is a synthetic peptide derived from the tissue-protective region of erythropoietin and studied in cellular protection pathways, inflammatory signaling, neurobiology research, and tissue-response mechanisms.",
      mechanism:
        "Experimental studies have investigated ARA-290 for innate repair receptor signaling, cytokine modulation pathways, inflammatory response mechanisms, cellular stress responses, and tissue-protective signaling networks.",
      areas: [
        "Inflammatory pathway research",
        "Neurobiology studies",
        "Cellular protection models",
        "Cytokine signaling research",
        "Tissue-response investigations",
      ],
    },
    {
      id: "pe2228",
      category: "Neurobiology Research Peptide",
      name: "PE-22-28",
      details: "Synthetic Research Peptide | Experimental Neurobiology Research Compound",
      description:
        "PE-22-28 is a synthetic research peptide studied in neurochemical signaling, neurotransmitter regulation, neuronal communication pathways, behavioral research models, and central nervous system signaling mechanisms.",
      mechanism:
        "Experimental studies have investigated PE-22-28 for interactions with neurotransmitter systems, neuronal signaling pathways, synaptic communication mechanisms, and neuroplasticity-related processes.",
      areas: [
        "Neurobiology research",
        "Neurotransmitter studies",
        "Synaptic signaling research",
        "Behavioral model investigations",
        "Neuroplasticity studies",
      ],
    },
    {
      id: "adamax",
      category: "Neurobiology Research Peptide",
      name: "ADAMAX",
      details: "Synthetic Semax Derivative | Adamantane-Modified Research Peptide",
      description:
        "ADAMAX is a synthetic peptide derived from the Semax family and studied in neurochemical signaling, neuroplasticity-associated pathways, neurotransmitter regulation, and cognitive neuroscience research.",
      mechanism:
        "Experimental studies investigate ADAMAX in relation to neuropeptide signaling, neuroplasticity-associated mechanisms, monoaminergic neurotransmitter pathways, stress-response models, and central nervous system signaling.",
      areas: [
        "Neuroplasticity research",
        "Neurotransmitter signaling",
        "Cognitive neuroscience",
        "Stress-response studies",
        "Peptide stability research",
      ],
    },
    {
      id: "cjcipa",
      category: "Research Peptide Blend",
      name: "CJC/IPA Without DAC",
      details: "CJC-1295 Without DAC + Ipamorelin | Synthetic Research Peptide Blend",
      description:
        "CJC/IPA Without DAC combines CJC-1295 without DAC and Ipamorelin into a research peptide blend commonly studied in endocrine signaling, receptor interactions, peptide-mediated cellular communication, and pulsatile growth hormone-related pathways.",
      mechanism:
        "Experimental studies investigate CJC-1295 Without DAC and Ipamorelin in relation to GHRH receptor signaling, growth hormone secretagogue receptor pathways, endocrine communication networks, and peptide-receptor interactions.",
      areas: [
        "Endocrine signaling research",
        "GHRH pathway studies",
        "Secretagogue receptor research",
        "Peptide blend investigations",
        "Cellular communication studies",
      ],
    },
    {
  id: "5amino1mq",
  category: "Metabolic Research Compound",
  name: "5-Amino-1MQ",
  details: "Small Molecule Research Compound | NNMT Pathway Research",
  description:
    "5-Amino-1MQ is a research compound studied in laboratory models involving nicotinamide N-methyltransferase pathways, cellular metabolism, and energy-balance signaling.",
  mechanism:
    "Experimental studies investigate 5-Amino-1MQ in relation to NNMT-associated signaling, NAD+ metabolism, adipocyte biology, mitochondrial activity, and metabolic pathway regulation.",
  areas: [
    "NNMT pathway research",
    "Metabolic signaling studies",
    "Cellular energy models",
    "NAD+ metabolism research",
    "Adipocyte biology investigations",
  ],
},
{
  id: "aceticacid",
  category: "Research Solution",
  name: "Acetic Acid",
  details: "Laboratory Research Solution | Peptide Handling Support",
  description:
    "Acetic Acid is a laboratory research solution commonly used in controlled research workflows involving compound preparation, peptide handling, and analytical applications.",
  mechanism:
    "Research use of acetic acid is generally related to solution preparation, pH adjustment, peptide solubility support, and controlled laboratory handling procedures.",
  areas: [
    "Research solution preparation",
    "Peptide handling workflows",
    "Laboratory pH adjustment",
    "Analytical preparation",
    "Research compound support",
  ],
},
{
  id: "aod9604",
  category: "Metabolic Research Peptide",
  name: "AOD-9604",
  details: "Synthetic hGH Fragment Analog | Metabolic Pathway Research",
  description:
    "AOD-9604 is a synthetic peptide fragment studied in laboratory models involving lipid metabolism, metabolic signaling, and growth-hormone-fragment research.",
  mechanism:
    "Experimental studies investigate AOD-9604 in relation to lipid metabolism pathways, adipocyte signaling, metabolic regulation, and peptide-mediated cellular communication.",
  areas: [
    "Lipid metabolism research",
    "Adipocyte signaling studies",
    "Metabolic pathway models",
    "Growth hormone fragment research",
    "Cellular communication studies",
  ],
},
{
  id: "kisspeptin10",
  category: "Endocrine Research Peptide",
  name: "Kisspeptin-10",
  details: "10 amino acids | Kisspeptin Receptor Signaling Research",
  description:
    "Kisspeptin-10 is a synthetic peptide studied in endocrine signaling research, reproductive-axis models, neuroendocrine communication, and kisspeptin receptor pathway investigations.",
  mechanism:
    "Experimental studies investigate Kisspeptin-10 in relation to KISS1 receptor signaling, GnRH-associated pathways, hypothalamic communication, and endocrine regulatory mechanisms.",
  areas: [
    "KISS1 receptor research",
    "Neuroendocrine signaling",
    "GnRH pathway studies",
    "Reproductive-axis models",
    "Endocrine communication research",
  ],
},
{
  id: "klow",
  category: "Metabolic Research Peptide",
  name: "KLOW",
  details: "Synthetic Research Peptide | Metabolic Signaling Research",
  description:
    "KLOW is a synthetic research peptide studied in laboratory models involving metabolic signaling, cellular energy regulation, and peptide-mediated pathway research.",
  mechanism:
    "Experimental research may evaluate KLOW in relation to metabolic pathway activity, receptor-associated signaling, cellular communication, and energy-balance research models.",
  areas: [
    "Metabolic signaling research",
    "Cellular energy studies",
    "Peptide pathway models",
    "Research compound evaluation",
    "Laboratory metabolic investigations",
  ],
},
{
  id: "nad",
  category: "Cellular Research Compound",
  name: "NAD+",
  details: "Nicotinamide Adenine Dinucleotide | Cellular Energy Research",
  description:
    "NAD+ is a naturally occurring coenzyme studied in cellular metabolism, mitochondrial function, redox biology, DNA repair pathways, and cellular aging research models.",
  mechanism:
    "Experimental studies investigate NAD+ in relation to redox reactions, mitochondrial energy production, sirtuin activity, PARP-associated pathways, and cellular stress-response mechanisms.",
  areas: [
    "Mitochondrial research",
    "Cellular energy metabolism",
    "Redox biology",
    "Sirtuin pathway studies",
    "DNA repair pathway research",
  ],
},

{
  id: "glutathione",
  category: "Antioxidant Research Peptide",
  name: "Glutathione",
  details: "3 amino acids | MW: 307.32 g/mol | Sequence: γ-Glu-Cys-Gly",
  description:
    "Glutathione is a naturally occurring tripeptide studied in laboratory models involving redox balance, antioxidant defense, cellular detoxification pathways, oxidative-stress responses, and intracellular signaling.",
  mechanism:
    "Experimental studies investigate glutathione in relation to cellular redox reactions, reactive oxygen species regulation, glutathione peroxidase activity, detoxification pathways, and maintenance of intracellular antioxidant systems.",
  areas: [
    "Antioxidant pathway research",
    "Cellular redox biology",
    "Oxidative stress studies",
    "Glutathione peroxidase research",
    "Cellular detoxification models",
  ],
},
{
  id: "pt141",
  category: "Melanocortin Research Peptide",
  name: "PT-141",
  details: "Synthetic Melanocortin Analog | MC Receptor Pathway Research",
  description:
    "PT-141 is a synthetic peptide analog studied in laboratory models involving melanocortin receptor signaling, neuroendocrine pathways, and central nervous system communication.",
  mechanism:
    "Experimental studies investigate PT-141 in relation to melanocortin receptor activity, MC3R/MC4R-associated signaling, neurochemical communication, and receptor-mediated pathway research.",
  areas: [
    "Melanocortin receptor research",
    "MC4R pathway studies",
    "Neuroendocrine signaling",
    "Central nervous system models",
    "Receptor-mediated research",
  ],
},
{
  id: "wolverine",
  category: "Research Peptide Blend",
  name: "Wolverine",
  details: "BPC-157 + TB-500 Research Blend | Tissue Research Models",
  description:
    "Wolverine is a research peptide blend commonly associated with BPC-157 and TB-500 pathway investigations, studied in laboratory models involving tissue response, cellular migration, and regenerative signaling.",
  mechanism:
    "Experimental research on the components commonly evaluates nitric oxide pathways, actin-regulating mechanisms, angiogenic signaling, cellular migration, and extracellular matrix remodeling.",
  areas: [
    "Tissue response research",
    "Cellular migration studies",
    "Angiogenesis models",
    "Connective tissue research",
    "Regenerative signaling investigations",
  ],
},

    {
      id: "ss31",
      category: "Mitochondrial Research Peptide",
      name: "SS-31",
      details: "Tetrapeptide Research Compound | Mitochondrial Signaling Research",
      description:
        "SS-31 is a synthetic tetrapeptide studied in laboratory models involving mitochondrial function, oxidative-stress pathways, cellular energy regulation, and mitochondrial membrane research.",
      mechanism:
        "Experimental studies investigate SS-31 in relation to mitochondrial membrane interactions, cardiolipin-associated signaling, reactive oxygen species regulation, ATP-related cellular processes, and mitochondrial stress-response pathways.",
      areas: [
        "Mitochondrial function research",
        "Oxidative stress studies",
        "Cellular energy regulation",
        "Mitochondrial membrane research",
        "Stress-response pathway models",
      ],
    },
    {
      id: "mitomax",
      category: "Mitochondrial Research Blend",
      name: "MitoMax",
      details: "Research Blend | Mitochondrial & Cellular Energy Research",
      description:
        "MitoMax is a research blend intended for laboratory investigations involving mitochondrial signaling, cellular energy pathways, oxidative-stress responses, and metabolic research models.",
      mechanism:
        "Laboratory research may evaluate MitoMax in relation to mitochondrial communication, cellular energy regulation, redox signaling, metabolic pathway activity, and cellular stress-response mechanisms.",
      areas: [
        "Mitochondrial signaling research",
        "Cellular energy studies",
        "Redox pathway research",
        "Metabolic signaling models",
        "Cellular stress-response studies",
      ],
    },
    {
      id: "neurox",
      category: "Neurobiology Research Blend",
      name: "NeuroX",
      details: "Research Blend | Neurobiology & Cellular Signaling Research",
      description:
        "NeuroX is a research blend intended for laboratory investigations involving neurobiological signaling, neuronal communication, cellular stress pathways, and central nervous system research models.",
      mechanism:
        "Experimental research may evaluate NeuroX in relation to neuronal signaling pathways, neurotransmitter-associated communication, neuroplasticity-related mechanisms, oxidative-stress responses, and cellular communication networks.",
      areas: [
        "Neurobiology research",
        "Neuronal signaling studies",
        "Neuroplasticity pathway models",
        "Cellular stress research",
        "Central nervous system signaling",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#081526] text-white">
      {/* HERO */}
      <section className="relative border-b border-white/10 px-5 py-14 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.10),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-300">
            Research Library
          </p>

          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            Peptide Information
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
            Concise educational reference material covering peptide classifications,
            research pathways, and laboratory-focused information.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-blue-300">
            <span>✓</span>
            <span>Research Use Only</span>
          </div>
        </div>
      </section>

      <div className="relative px-4 py-10 md:px-6 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.05),transparent_62%)]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* COMPACT OVERVIEW */}
          <section className="mb-7 rounded-2xl border border-white/10 bg-white/[0.035] p-5 md:p-7">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-300">
                  Peptide Research Overview
                </p>
                <h2 className="text-2xl font-black md:text-3xl">
                  Understanding Peptides
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                  Peptides are short chains of amino acids studied for highly specific
                  biological signaling. Research commonly examines their roles in
                  cellular communication, metabolism, immune signaling, tissue repair,
                  neurological activity, and related pathways.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Targeted Signaling",
                    text: "Peptides are frequently studied for specific receptor and cellular signaling activity.",
                  },
                  {
                    title: "Natural + Synthetic",
                    text: "Research includes naturally occurring peptides and laboratory-developed analogs.",
                  },
                  {
                    title: "Small Structures",
                    text: "Peptides are shorter than proteins and can support highly focused pathway studies.",
                  },
                  {
                    title: "Broad Research Use",
                    text: "Common areas include metabolic, neurological, immune, and regenerative models.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-white/50">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.16em] text-white/30">
              For laboratory research use only. Not for human consumption.
            </p>
          </section>

          {/* SECTION HEADER */}
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-300">
                Research Index
              </p>
              <h2 className="mt-1 text-xl font-black md:text-2xl">
                Peptide & Compound Library
              </h2>
            </div>
            <p className="hidden text-xs text-white/35 sm:block">
              Select an item to view details
            </p>
          </div>

          {/* SLIM ACCORDIONS */}
          <div className="space-y-2.5">
            {peptides.map((peptide) => (
              <div
                key={peptide.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-200 hover:border-blue-400/30 hover:bg-white/[0.045]"
              >
                <button
                  onClick={() =>
                    setOpenPeptide(openPeptide === peptide.id ? null : peptide.id)
                  }
                  className="w-full px-4 py-4 text-left md:px-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 sm:flex sm:items-center sm:gap-4">
                      <h3 className="text-lg font-bold text-white md:text-xl">
                        {peptide.name}
                      </h3>
                      <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.16em] text-blue-300/80 sm:mt-0">
                        {peptide.category}
                      </span>
                    </div>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-lg font-light text-blue-300">
                      {openPeptide === peptide.id ? "−" : "+"}
                    </span>
                  </div>
                </button>

                {openPeptide === peptide.id && (
                  <div className="border-t border-white/10 bg-[#081526]/35 px-4 py-5 md:px-5 md:py-6">
                    <p className="text-xs leading-5 text-white/40">
                      {peptide.details}
                    </p>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
                          Overview
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-white/65">
                          {peptide.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
                          Mechanism Research
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-white/55">
                          {peptide.mechanism}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
                        Research Areas
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {peptide.areas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/55"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="mt-5 text-[9px] uppercase tracking-[0.14em] text-white/25">
                      For laboratory research use only. Not for human consumption.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
