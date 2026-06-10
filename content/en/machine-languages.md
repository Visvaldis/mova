---
slug: machine-languages
lang: en
title: "Is Python a Language? Code, Grammar, and the Brain"
summary: "Programming languages have syntax, dialects, and even dead languages. But your brain refuses to treat them as speech."
order: 18
topic: machine
readingTime: 7
interactive: code-vs-speech
sources:
  - title: "To the brain, reading computer code is not the same as reading language (MIT News)"
    url: "https://news.mit.edu/2020/brain-reading-computer-code-1215"
    note: "The Fedorenko lab study on code and the brain's language network"
  - title: "Chomsky hierarchy (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/Chomsky_hierarchy"
    note: "How one theory of grammar ended up inside every compiler"
  - title: "Hockett's design features (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/Hockett%27s_design_features"
    note: "The classic checklist for what makes a communication system a language"
  - title: "What enables human language? A biocultural framework (Science)"
    url: "https://www.science.org/doi/10.1126/science.adq8303"
    note: "The criteria for human language that code conspicuously fails"
---

Programming languages borrowed our vocabulary deliberately: they have *grammar*, *syntax*, *expressions*, *statements*, *dialects*, even *dead languages* (pour one out for COBOL programmers). And the connection runs deeper than metaphor — but ends sooner than you'd think.

<!-- INTERACTIVE -->

## Linguistics inside your compiler

In the 1950s, Noam Chomsky classified grammars by power — the **Chomsky hierarchy**: regular, context-free, context-sensitive, unrestricted. It was meant as a theory of human language. It failed at that — but it turned out to be the perfect theory of *programming* languages, and it now lives inside every compiler on Earth: your regex engine speaks Chomsky level 3, your parser level 2. A theory of human grammar became the load-bearing wall of software. That is arguably linguistics' most successful export.

## The checklist test

So is code a language? Run Charles Hockett's classic design features as a checklist. Code passes some with flying colors: **discreteness** (distinct symbols), **productivity** (infinite novel programs from finite rules), **duality of patterning** (meaningless characters build meaningful units). Then it starts failing, hard. **Ambiguity** — human language is gloriously ambiguous and negotiated in context; code *must not* be: a compiler that interprets creatively is called broken. **Displacement and lying** — you can't write Python that is ironic. **Acquisition** — no child anywhere picks up JavaScript natively from exposure, which after our newborn-languages article should strike you as the decisive failure: the engine that builds creoles and NSL has nothing to grip.

> Code is all grammar and no conversation: a language with perfect syntax and no native speakers.

## The brain's verdict

Neuroscience delivered the cleanest answer. The human brain has a well-mapped **language network** that lights up for speech, sign, Esperanto — any natural language. MIT's Fedorenko lab scanned programmers reading code and found the language network largely *silent*; code instead recruits the **multiple-demand network** — the circuitry of logic puzzles and math. Your brain files Python with Sudoku, not with Ukrainian. (Fittingly, the same lab's work also shows what *does* count: signed languages light the network like spoken ones — modality doesn't matter, humanity does.)

## The blur at the border

Just as the lines seemed settled, large language models smudged them from both sides. We now *talk* to computers in Ukrainian and English, and the most consequential "code" of the 2020s is the prompt — natural language doing a programming language's job. Meanwhile AI systems write the formal code themselves. The division of labor that held since FORTRAN — humans speak ambiguously to humans, precisely to machines — is dissolving mid-decade, which is exactly where our AI-and-language article picks up the story.

Verdict: programming languages are magnificent *notations* — humanity's third great symbol system after speech and writing — but they are not languages in the biological sense. The test was never syntax. It was children on a playground.
