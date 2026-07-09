"use client";

import { useState } from "react";

import { HiOutlineMail } from "react-icons/hi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
  ];

  return (
    <main className="min-h-screen bg-[#081526] text-white overflow-hidden">

      {/* HERO */}
      <section className="relative py-24 px-6 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.10),transparent_55%)]"></div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
            Research Library
          </p>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95]">
            Peptide Information
          </h1>

          <p className="mt-10 text-white/70 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            Educational research information covering peptide classifications,
            laboratory handling, analytical testing, and research-use
            documentation.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.04] text-blue-300 text-sm uppercase tracking-widest">
            <span>✓</span>
            <span>Research Use Only • Educational Reference</span>
          </div>
        </div>
      </section>

      <div className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.08),transparent_60%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          {/* INTRO */}
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 md:p-12">
            <p className="uppercase tracking-[0.35em] text-blue-300 text-sm mb-6">
              Peptide Research Overview
            </p>

            <h2 className="text-4xl md:text-6xl font-black mb-8 text-white leading-[0.95]">
              Understanding Peptides
            </h2>

            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-12 max-w-5xl">
              Peptides are short chains of amino acids that function as highly
              specific biological signaling molecules. Found naturally
              throughout the body, peptides play essential roles in cellular
              communication, metabolic regulation, immune signaling, tissue
              repair, neurological activity, and countless physiological
              pathways studied in modern biomedical research.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "What Are Peptides?",
                  text:
                    "Peptides are composed of small sequences of amino acids linked together by peptide bonds. Due to their smaller structure compared to proteins, peptides are frequently studied for targeted biological signaling capabilities.",
                },
                {
                  title: "Cellular Signaling",
                  text:
                    "Many peptides function as signaling compounds that bind to receptors on cells, triggering complex biochemical responses studied in metabolism, inflammation, cognition, regeneration, and immune regulation.",
                },
                {
                  title: "Natural & Synthetic Peptides",
                  text:
                    "The body naturally produces thousands of peptides involved in physiological regulation. Synthetic peptides are laboratory-developed analogs used to study specific biological mechanisms under controlled research conditions.",
                },
                {
                  title: "Peptides vs. Proteins",
                  text:
                    "While both peptides and proteins are built from amino acids, peptides are shorter and often investigated for targeted biological activity. Proteins are larger and more complex macromolecules.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
                >
                  <h3 className="text-2xl font-black text-white mb-4">
                    {item.title}
                  </h3>

                  <p className="text-white/60 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-2xl font-black text-white mb-6">
                Key Facts About Peptide Research
              </h3>

              <div className="flex flex-wrap gap-3">
                {[
                  "Thousands of naturally occurring peptides identified",
                  "Critical role in cellular communication pathways",
                  "Widely studied in metabolic and regenerative research",
                  "Highly specific receptor-targeting mechanisms",
                  "Important tools in modern biomedical investigation",
                ].map((fact) => (
                  <span
                    key={fact}
                    className="border border-white/10 bg-white/[0.04] text-blue-300 rounded-full px-5 py-3 text-sm"
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-10 text-xs text-white/35 uppercase tracking-widest">
              For laboratory research use only. Not for human consumption.
            </p>
          </section>

          {/* PEPTIDE ACCORDIONS */}
          {peptides.map((peptide) => (
            <div
              key={peptide.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden hover:bg-white/[0.07] hover:border-blue-400/40 transition-all duration-300"
            >
              <button
                onClick={() =>
                  setOpenPeptide(
                    openPeptide === peptide.id ? null : peptide.id
                  )
                }
                className="w-full text-left p-8 bg-transparent hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="uppercase tracking-[0.3em] text-blue-300 text-sm mb-3">
                      {peptide.category}
                    </p>

                    <h2 className="text-4xl font-black text-white">
                      {peptide.name}
                    </h2>
                  </div>

                  <span className="text-4xl text-blue-300">
                    {openPeptide === peptide.id ? "−" : "+"}
                  </span>
                </div>
              </button>

              {openPeptide === peptide.id && (
                <div className="p-8 md:p-10 border-t border-white/10 bg-[#081526]/40 backdrop-blur-sm">
                  <p className="text-sm text-white/40 mb-8">
                    {peptide.details}
                  </p>

                  <p className="text-white/70 text-lg leading-relaxed mb-8">
                    {peptide.description}
                  </p>

                  <div className="border border-white/10 rounded-[2rem] p-8 mb-8 bg-white/[0.03]">
                    <h3 className="text-xl font-black text-white mb-4">
                      Mechanism Research
                    </h3>

                    <p className="text-white/60 leading-relaxed">
                      {peptide.mechanism}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white mb-5">
                      Research Areas
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {peptide.areas.map((area) => (
                        <span
                          key={area}
                          className="border border-white/10 bg-white/[0.04] text-blue-300 rounded-full px-4 py-2 text-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mt-10 text-xs text-white/35 uppercase tracking-widest">
                    For laboratory research use only. Not for human consumption.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}