"use client";

import { useState } from "react";

export default function PeptideInfoPage() {

  const [openPeptide, setOpenPeptide] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-blue-900 bg-black">

        <a
          href="/"
          className="text-sm uppercase tracking-widest text-blue-400 hover:text-blue-300"
        >
          ← Back to Home
        </a>

        <p className="uppercase tracking-[0.3em] text-gray-400 text-xs">
          APEXX BIOLABS
        </p>

      </header>

      {/* HERO */}
      <section className="text-center py-28 px-6 border-b border-blue-950">

        <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-6">
          Research Library
        </p>

        <h1 className="text-6xl font-bold mb-8">
          Peptide Information
        </h1>

        <p className="text-gray-400 text-lg max-w-4xl mx-auto leading-relaxed">
          Educational information regarding research peptides,
          analytical classifications, and laboratory reference details.
        </p>

      </section>

      {/* PEPTIDE GRID */}
      <section className="px-10 py-24">

        <div className="max-w-7xl mx-auto space-y-12">

          {/* INTRO TO PEPTIDES */}
<section className="border border-blue-900 rounded-3xl p-12 bg-[#050505] shadow-[0_0_45px_rgba(37,99,235,0.12)] mb-16">

  <p className="uppercase tracking-[0.35em] text-blue-500 text-sm mb-6">
    Peptide Research Overview
  </p>

  <h1 className="text-6xl font-bold mb-8 text-white">
    Understanding Peptides
  </h1>

  <p className="text-gray-300 text-xl leading-relaxed mb-12 max-w-5xl">
    Peptides are short chains of amino acids that function as highly specific
    biological signaling molecules. Found naturally throughout the body,
    peptides play essential roles in cellular communication, metabolic
    regulation, immune signaling, tissue repair, neurological activity, and
    countless physiological pathways studied in modern biomedical research.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

    {/* WHAT ARE PEPTIDES */}
    <div className="border border-blue-900 rounded-2xl p-8 bg-black/40">

      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        What Are Peptides?
      </h2>

      <p className="text-gray-400 leading-relaxed">
        Peptides are composed of small sequences of amino acids linked together
        by peptide bonds. Due to their smaller structure compared to proteins,
        peptides are frequently studied for their highly targeted biological
        signaling capabilities and their ability to interact with specific
        cellular receptors.
      </p>

    </div>

    {/* HOW THEY WORK */}
    <div className="border border-blue-900 rounded-2xl p-8 bg-black/40">

      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        Cellular Signaling
      </h2>

      <p className="text-gray-400 leading-relaxed">
        Many peptides function as signaling compounds that bind to receptors on
        cells, triggering complex biochemical responses. Researchers investigate
        these pathways to better understand processes involving metabolism,
        growth-factor signaling, inflammation, cognition, regeneration, and
        immune-system regulation.
      </p>

    </div>

    {/* NATURAL VS SYNTHETIC */}
    <div className="border border-blue-900 rounded-2xl p-8 bg-black/40">

      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        Natural & Synthetic Peptides
      </h2>

      <p className="text-gray-400 leading-relaxed">
        The human body naturally produces thousands of peptides involved in
        physiological regulation. Synthetic peptides are laboratory-developed
        analogs designed to mimic, enhance, or study specific biological
        mechanisms and receptor pathways under controlled research conditions.
      </p>

    </div>

    {/* PEPTIDES VS PROTEINS */}
    <div className="border border-blue-900 rounded-2xl p-8 bg-black/40">

      <h2 className="text-2xl font-semibold text-blue-400 mb-4">
        Peptides vs. Proteins
      </h2>

      <p className="text-gray-400 leading-relaxed">
        While both peptides and proteins are built from amino acids, peptides
        are significantly shorter in structure and are often investigated for
        their targeted biological activity. Proteins are larger and more complex
        macromolecules responsible for broader structural and functional roles
        throughout the body.
      </p>

    </div>

  </div>

  {/* KEY FACTS */}
  <div className="mt-12 border border-blue-900 rounded-2xl p-8 bg-black/30">

    <h2 className="text-2xl font-semibold text-blue-400 mb-6">
      Key Facts About Peptide Research
    </h2>

    <div className="flex flex-wrap gap-4">

      <span className="border border-blue-700 text-blue-400 rounded-full px-5 py-3 text-sm">
        Thousands of naturally occurring peptides identified
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-5 py-3 text-sm">
        Critical role in cellular communication pathways
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-5 py-3 text-sm">
        Widely studied in metabolic and regenerative research
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-5 py-3 text-sm">
        Highly specific receptor-targeting mechanisms
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-5 py-3 text-sm">
        Important tools in modern biomedical investigation
      </span>

    </div>

  </div>

  <p className="mt-12 text-xs text-gray-600 uppercase tracking-widest">
    For laboratory research use only. Not for human consumption.
  </p>

</section>

{/* RETATRUTIDE */}
<div className="border border-blue-900 rounded-2xl overflow-hidden">
  <button
    onClick={() =>
      setOpenPeptide(openPeptide === "retatrutide" ? null : "retatrutide")
    }
    className="w-full text-left p-8 bg-[#050505] hover:bg-[#080808] transition-all"
  >
    <div className="flex items-center justify-between gap-6">
      <div>
        <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-2">
          Metabolic Research Peptide
        </p>

        <h2 className="text-4xl font-bold text-blue-400">
          Retatrutide
        </h2>
      </div>

      <span className="text-4xl text-blue-400">
        {openPeptide === "retatrutide" ? "−" : "+"}
      </span>
    </div>
  </button>

  {openPeptide === "retatrutide" && (
    <div className="p-10 bg-[#050505] border-t border-blue-900">
      <p className="text-sm text-gray-500 mb-8">
        39 amino acids | MW: 4731.41 g/mol | GCGR / GIPR / GLP-1R Triple Agonist
      </p>

      <p className="text-gray-300 text-lg leading-relaxed mb-8">
        Retatrutide (LY3437943) is a novel triple agonist research peptide
        studied for its interaction with glucagon receptor (GCGR),
        glucose-dependent insulinotropic polypeptide receptor (GIPR), and
        glucagon-like peptide-1 receptor (GLP-1R) pathways in metabolic and
        energy-regulation research models.
      </p>

      <div className="border border-blue-900 rounded-xl p-6 mb-8 bg-black/40">
        <h3 className="text-xl font-semibold text-blue-400 mb-3">
          Mechanism Research
        </h3>

        <p className="text-gray-400 leading-relaxed">
          Experimental studies have investigated Retatrutide for its role in
          incretin signaling, glucose metabolism pathways, insulin sensitivity,
          appetite regulation, thermogenic activity, and energy-expenditure
          mechanisms in laboratory models.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">
          Research Areas
        </h3>

        <div className="flex flex-wrap gap-3">
          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            Triple receptor agonist research
          </span>

          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            Metabolic pathway studies
          </span>

          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            Energy expenditure research
          </span>

          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            Glucose signaling models
          </span>

          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            Incretin pathway investigation
          </span>
        </div>
      </div>

      <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
        For laboratory research use only. Not for human consumption.
      </p>
    </div>
  )}
</div>

{/* BPC-157 */}
<div className="border border-blue-900 rounded-2xl overflow-hidden">
  <button
    onClick={() =>
      setOpenPeptide(openPeptide === "bpc157" ? null : "bpc157")
    }
    className="w-full text-left p-8 bg-[#050505] hover:bg-[#080808] transition-all"
  >
    <div className="flex items-center justify-between gap-6">
      <div>
        <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-2">
          Recovery Peptide
        </p>

        <h2 className="text-4xl font-bold text-blue-400">
          BPC-157
        </h2>
      </div>

      <span className="text-4xl text-blue-400">
        {openPeptide === "bpc157" ? "−" : "+"}
      </span>
    </div>
  </button>

  {openPeptide === "bpc157" && (
    <div className="p-10 bg-[#050505] border-t border-blue-900">
      <p className="text-sm text-gray-500 mb-8">
        15 amino acids | MW: 1419.55 g/mol | Sequence: GEPPPGKPADDAGLV
      </p>

      <p className="text-gray-300 text-lg leading-relaxed mb-8">
        BPC-157 is a synthetic pentadecapeptide studied in laboratory and
        preclinical models for its role in cytoprotection, vascular/endothelial
        signaling, gastrointestinal research, and tissue-repair pathway models.
      </p>

      <div className="border border-blue-900 rounded-xl p-6 mb-8 bg-black/40">
        <h3 className="text-xl font-semibold text-blue-400 mb-3">
          Mechanism Research
        </h3>

        <p className="text-gray-400 leading-relaxed">
          Experimental studies have investigated BPC-157 for its interaction
          with nitric oxide pathways, VEGF-related angiogenic signaling,
          cellular migration, growth-factor activity, and inflammatory pathway
          modulation.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">
          Research Areas
        </h3>

        <div className="flex flex-wrap gap-3">
          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            Tissue repair models
          </span>

          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            Angiogenesis research
          </span>

          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            GI mucosal integrity
          </span>

          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            Nitric oxide pathways
          </span>

          <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
            Connective tissue studies
          </span>
        </div>
      </div>

      <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
        For laboratory research use only. Not for human consumption.
      </p>
    </div>
  )}
</div>

{/* GHK-CU */}
<div className="border border-blue-900 rounded-2xl p-10 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">

  <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
    Regeneration Peptide
  </p>

  <h2 className="text-4xl font-bold mb-4 text-blue-400">
    GHK-Cu
  </h2>

  <p className="text-sm text-gray-500 mb-8">
    3 amino acids + Cu²⁺ | MW: 744.3 g/mol | Sequence: Gly-His-Lys:Cu²⁺
  </p>

  <p className="text-gray-300 text-lg leading-relaxed mb-8">
    GHK-Cu is a naturally occurring copper-binding tripeptide complex studied
    in laboratory and preclinical models involving collagen synthesis,
    regenerative signaling, antioxidant pathway activation, and tissue-repair
    research mechanisms.
  </p>

  <div className="border border-blue-900 rounded-xl p-6 mb-8 bg-black/40">
    <h3 className="text-xl font-semibold text-blue-400 mb-3">
      Mechanism Research
    </h3>

    <p className="text-gray-400 leading-relaxed">
      Experimental studies have investigated GHK-Cu for its role in copper
      transport, collagen production pathways, antioxidant signaling,
      inflammatory modulation, extracellular matrix remodeling, and regenerative
      cellular communication in laboratory models.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-semibold text-white mb-4">
      Research Areas
    </h3>

    <div className="flex flex-wrap gap-3">

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Collagen synthesis research
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Tissue regeneration studies
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Antioxidant pathway models
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Extracellular matrix signaling
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Skin and connective tissue research
      </span>

    </div>
  </div>

  <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
    For laboratory research use only. Not for human consumption.
  </p>

</div>

{/* KPV */}
<div className="border border-blue-900 rounded-2xl p-10 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">

  <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
    Anti-Inflammatory Peptide
  </p>

  <h2 className="text-4xl font-bold mb-4 text-blue-400">
    KPV
  </h2>

  <p className="text-sm text-gray-500 mb-8">
    3 amino acids | MW: 342.43 g/mol | Sequence: Lys-Pro-Val
  </p>

  <p className="text-gray-300 text-lg leading-relaxed mb-8">
    KPV is a naturally occurring tripeptide derived from
    alpha-melanocyte-stimulating hormone (α-MSH) and is widely studied in
    laboratory and preclinical models involving inflammatory modulation,
    mucosal integrity, antimicrobial activity, and tissue-repair pathway
    research.
  </p>

  <div className="border border-blue-900 rounded-xl p-6 mb-8 bg-black/40">
    <h3 className="text-xl font-semibold text-blue-400 mb-3">
      Mechanism Research
    </h3>

    <p className="text-gray-400 leading-relaxed">
      Experimental studies have investigated KPV for its interaction with
      NF-κB signaling pathways, inflammatory cytokine modulation, antimicrobial
      mechanisms, mucosal barrier support, and peptide-mediated cellular
      protection pathways in laboratory models.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-semibold text-white mb-4">
      Research Areas
    </h3>

    <div className="flex flex-wrap gap-3">

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        NF-κB inflammatory pathway research
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Gastrointestinal mucosal studies
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Antimicrobial peptide research
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Tissue-repair pathway models
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Cellular protection signaling
      </span>

    </div>
  </div>

  <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
    For laboratory research use only. Not for human consumption.
  </p>

</div>

{/* PINEALON */}
<div className="border border-blue-900 rounded-2xl p-10 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">

  <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
    Neuroregenerative Peptide
  </p>

  <h2 className="text-4xl font-bold mb-4 text-blue-400">
    Pinealon
  </h2>

  <p className="text-sm text-gray-500 mb-8">
    3 amino acids | MW: 418.40 g/mol | Sequence: Glu-Asp-Arg (EDR)
  </p>

  <p className="text-gray-300 text-lg leading-relaxed mb-8">
    Pinealon is a synthetic tripeptide composed of L-glutamic acid,
    L-aspartic acid, and L-arginine (EDR). It is studied in laboratory and
    preclinical models involving neuroprotective signaling, neuronal
    communication pathways, oxidative-stress modulation, and cellular
    longevity research.
  </p>

  <div className="border border-blue-900 rounded-xl p-6 mb-8 bg-black/40">
    <h3 className="text-xl font-semibold text-blue-400 mb-3">
      Mechanism Research
    </h3>

    <p className="text-gray-400 leading-relaxed">
      Experimental studies have investigated Pinealon for its interaction with
      neuronal gene-expression pathways, oxidative-stress response systems,
      mitochondrial signaling, peptide-mediated neuroregulation, and cellular
      communication mechanisms in laboratory research models.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-semibold text-white mb-4">
      Research Areas
    </h3>

    <div className="flex flex-wrap gap-3">

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Neuroprotective pathway research
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Cognitive signaling studies
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Oxidative stress modulation
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Mitochondrial research models
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Cellular longevity investigations
      </span>

    </div>
  </div>

  <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
    For laboratory research use only. Not for human consumption.
  </p>

</div>

{/* SELANK */}
<div className="border border-blue-900 rounded-2xl p-10 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">

  <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
    Nootropic & Neuroprotective Peptide
  </p>

  <h2 className="text-4xl font-bold mb-4 text-blue-400">
    Selank
  </h2>

  <p className="text-sm text-gray-500 mb-8">
    7 amino acids | MW: 751.89 g/mol | Sequence: TKPRPGP
  </p>

  <p className="text-gray-300 text-lg leading-relaxed mb-8">
    Selank is a synthetic heptapeptide derived from the naturally occurring
    immunomodulatory peptide tuftsin. It is widely studied in laboratory and
    preclinical models involving GABAergic signaling, neuroprotection,
    cognitive-function pathways, stress-response modulation, and immune-system
    regulatory research.
  </p>

  <div className="border border-blue-900 rounded-xl p-6 mb-8 bg-black/40">
    <h3 className="text-xl font-semibold text-blue-400 mb-3">
      Mechanism Research
    </h3>

    <p className="text-gray-400 leading-relaxed">
      Experimental studies have investigated Selank for its interaction with
      GABA-A receptor modulation, BDNF-related signaling pathways,
      neurochemical regulation, inflammatory cytokine balance, and peptide-based
      stress-response mechanisms in laboratory models.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-semibold text-white mb-4">
      Research Areas
    </h3>

    <div className="flex flex-wrap gap-3">

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        GABAergic signaling research
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Cognitive-function studies
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Neuroprotective pathway models
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Stress-response modulation
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Immunomodulatory peptide research
      </span>

    </div>
  </div>

  <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
    For laboratory research use only. Not for human consumption.
  </p>

</div>

{/* SEMAX */}
<div className="border border-blue-900 rounded-2xl p-10 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">

  <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
    Nootropic & Neuroprotective Peptide
  </p>

  <h2 className="text-4xl font-bold mb-4 text-blue-400">
    Semax
  </h2>

  <p className="text-sm text-gray-500 mb-8">
    7 amino acids | MW: 813.92 g/mol | Sequence: MEHFPGP
  </p>

  <p className="text-gray-300 text-lg leading-relaxed mb-8">
    Semax is a synthetic heptapeptide derived from the N-terminal fragment of
    adrenocorticotropic hormone (ACTH 4-10). It is widely studied in laboratory
    and preclinical models involving neuroprotective signaling, BDNF
    modulation, cognitive-function pathways, neuroplasticity, and peptide-based
    neurotransmitter regulation research.
  </p>

  <div className="border border-blue-900 rounded-xl p-6 mb-8 bg-black/40">
    <h3 className="text-xl font-semibold text-blue-400 mb-3">
      Mechanism Research
    </h3>

    <p className="text-gray-400 leading-relaxed">
      Experimental studies have investigated Semax for its interaction with
      BDNF and TrkB signaling pathways, dopamine and serotonin modulation,
      neuroplasticity mechanisms, oxidative-stress response systems, and
      neurotrophic peptide signaling in laboratory research models.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-semibold text-white mb-4">
      Research Areas
    </h3>

    <div className="flex flex-wrap gap-3">

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        BDNF signaling research
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Neuroplasticity pathway studies
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Cognitive-function research
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Neuroprotective signaling models
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Neurotransmitter modulation
      </span>

    </div>
  </div>

  <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
    For laboratory research use only. Not for human consumption.
  </p>

</div>

{/* TB500 */}
<div className="border border-blue-900 rounded-2xl p-10 bg-[#050505] shadow-[0_0_35px_rgba(37,99,235,0.12)]">

  <p className="uppercase tracking-[0.3em] text-blue-500 text-sm mb-4">
    Healing Peptide
  </p>

  <h2 className="text-4xl font-bold mb-4 text-blue-400">
    TB-500
  </h2>

  <p className="text-sm text-gray-500 mb-8">
    7 amino acids | MW: 4963.44 g/mol | Active Fragment: Ac-LKKTETQ
  </p>

  <p className="text-gray-300 text-lg leading-relaxed mb-8">
    TB-500 is a synthetic research peptide derived from thymosin beta-4 and is
    widely studied in laboratory and preclinical models involving cellular
    migration, angiogenesis, connective tissue signaling, and regenerative
    pathway research.
  </p>

  <div className="border border-blue-900 rounded-xl p-6 mb-8 bg-black/40">
    <h3 className="text-xl font-semibold text-blue-400 mb-3">
      Mechanism Research
    </h3>

    <p className="text-gray-400 leading-relaxed">
      Experimental studies have investigated TB-500 for its interaction with
      actin regulation, cellular migration signaling, angiogenic pathways,
      inflammatory modulation, and tissue-repair mechanisms in laboratory
      models.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-semibold text-white mb-4">
      Research Areas
    </h3>

    <div className="flex flex-wrap gap-3">

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Cellular migration research
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Angiogenesis studies
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Connective tissue models
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Tissue regeneration pathways
      </span>

      <span className="border border-blue-700 text-blue-400 rounded-full px-4 py-2 text-sm">
        Experimental inflammatory research
      </span>

    </div>
  </div>

  <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
    For laboratory research use only. Not for human consumption.
  </p>

</div>

</div>

      </section>

    </main>
  );
}