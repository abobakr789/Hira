# Grade 4 review, in progress

76 teacher decks inventoried. Core extraction at /tmp/ssy4-core-review.txt. Read NN lessons 1–16 and AR term 1 lessons 1–23 vocabulary so far. First NN accuracy batch published and live-QA closed; AR science batch deployed and live-QA closed.

Verified issues to handle:
- NN T1 L05 model: the sentence recognizing that girls differ is incorrectly called stereotyping. Reword the model to identify an all-girls generalization as a stereotype, then explicitly allow individual differences. Inspect guide/quiz/prints for consistency.
- NN T1 L11 vocabulary/flip: latitude is a measurement north/south of equator, not itself a line. Source reading text3 says equator warmth comes from proximity to sun. Preserve source text as source, add visible current-science clarification that sunlight arrives more directly. Review full lesson and print counterparts.
- NN T1 L14 vocabulary/flip: greenhouse effect definition confuses heat trapping with gases being trapped. Correct explanatory layers, examine original book text and keep provenance clear. Avoid treating every kind of pollution as greenhouse forcing.
- AR T1 L13: climate definition gives month/season/year without long-term averaging. Correct explanatory layers to long-term typical weather, normally 30 years, retaining original textbook as attributed source if necessary.
- NN visual mismatches for later review: L01 tradition temple, L03 plank ladder, L07 accommodation bus, L09 kingdom mountain, L10 individual houses, L12 kandura coat and wind tower classical building, L13 rainforest palm/vegetation cactus/walrus seal. Do not replace with another generic symbol. Use actual source picture, literal diagram, or remove misleading symbol.

Sources fetched and read 2026-11-24 05:33 Asia/Dubai:
- https://science.nasa.gov/climate-change/faq/what-is-the-greenhouse-effect/ supports heat trapped by greenhouse gases, not gases trapped.
- https://oceanservice.noaa.gov/facts/latitude.html supports degrees north/south from equator and distinction between latitude measurement and parallels.
- https://www.noaa.gov/jetstream/global/climate-zones supports typical weather measured over 30-year intervals.
- https://socialsci.libretexts.org/Bookshelves/Early_Childhood_Education/General_Child_Development/Child_Family_Community%3A_The_Socialization_of_Diverse_Children/08%3A_Contemporary_Issues_for_Children_and_Families/8.01%3A_Stereotypes_Prejudice_Discrimination_and_Bias supports stereotype as oversimplified generalization ignoring individual differences.

Further issues requiring verification, not yet conclusions:
- AR T1 L14 truffle classified as plant.
- NN T1 L13 adaptations and Arctic wildlife source text.
- AR term 1 other core slides use learn1–learn4 and models rather than model/learn. Initial core extraction missed them, must inspect these before any lesson closure.

Additional sources fetched and read 05:34:
- https://www.noaa.gov/jetstream/tropical supports more direct tropical sunlight, not closeness to Sun.
- https://www.kew.org/read-and-watch/what-is-fungi supports truffles as fungi, separate from plants.

Read remaining AR vocabulary through T3 L18 at 05:35. Still must read learn1–learn4, models, quizzes and original source passages. Additional possible transcription issues: T2 L05 irrigation term and definition, T2 L10 historical region name, T3 L10 teak wood spelling. Verify before editing.

## 2026-11-24 05:59 Dubai checkpoint
- All 76 core decks reviewed (16 NN, 60 AR), including AR learn1–learn4 and models. Full lesson closure remains in progress.
- NN L05/L11/L14 accuracy: content 459c699c deployed successfully; all 12 changed fronts, 2 flip backs and 8 print pages inspected live PASS. Closure a18716d5.
- AR T1 L13 climate and L14 plants: corrected climate to long-term average, usually 30 years; truffles are fungi; Samar spelling; synchronized summaries, worksheets, group work, answer keys and source cards. All 13 slides and 15 print pages inspected locally PASS at 05:59. Original media preserved, source passage adaptation labelled visibly.
- Remaining review leads are in the ongoing research notes. No grade 4 completion claimed.

## 2026-11-24 06:06 Dubai checkpoint
- AR science content d36b9a12 deployed successfully, action 45309060899. All 11 HTML files byte-identical live at 06:02. All 13 slide views and 15 print pages inspected live PASS by 06:05. No clipping, overlap or missing content. Climate definition and fungus classification synchronized throughout changed material.
- This is a batch closure, not a grade closure. Grade 4 still needs complete lesson-specific review and later visual choices.

Additional grounded correction leads, researched 06:00–06:01:
- T1 L06: Meluhha must not be asserted as a local UAE civilization. Use verified local Umm an-Nar history if replacing.
- T1 L07: mountain steepness definition contains a transcription error. Use steep sides or height, not the existing malformed word.
- T1 L16: correct the etiquette term to السنع in learn3 and corresponding source/worksheet.
- T1 L20: reign 1855–1909 confirmed. Remove unsupported age at accession rather than resolving birth-year uncertainty by guess.
- T1 L22: learn3 conflates the Supreme Council with president and deputy. Article 45 lists them separately; prints already separate.
- T2 L13: Umm an-Nar is an archaeological island/site, not a former name for all Abu Dhabi. Affected learn4, think model, answer-key diamond and source summary. Original book passage is not the error.
- T2 L17: Ajman Museum opened 1991; fort dates to 1803–1838. Correct learn4 and source summary, not all fort history indiscriminately.
- T3 L10/L12: teak spelling is الساج, not the malformed term. Separate wood hull from rope/fibre uses rather than implying every material forms the whole vessel. Check sequence arrows.
- T3 L15: replace invention-from-nothing claims about chemistry/physics with development of earlier knowledge. Review learn2, booktext, g2, quick questions, worksheets, pod, answer key and source summary. Label adapted source material visibly.
- Other unresolved leads: T1 L01 known life-bearing planet qualifier; longitude counts versus degrees T1 L02; latitude count convention T1 L03; T1 L10 island direction; T2 L02 undated statistic; T2 L05 irrigation term; T2 L10 historical region; T2 L11 terraces; T2 L12 biography chronology; T3 L02 30-day arithmetic qualifier; T3 L03 transport overgeneralization; T3 L06 artificial island wording; T3 L09 Etihad passenger service current status. Research before edits.

## 2026-11-24 06:10 reversible checkpoint
AR history batch is LOCAL ONLY, uncommitted and not live. Manifest grade4-ar-history-changes.json covers 11 files, 5 front views, 1 answer popup, 7 print pages, all inspected locally PASS. Four lessons: T1 L16 Sanaa spelling; T1 L22 separate president/deputy from Supreme Council membership (including source summary and silver worksheet); T2 L13 remove false former-name claim and identify Umm an-Nar archaeological island (including answer model/key); T2 L17 museum opening 1991. Preserved inherited museum photo actually shows Dubai Museum, so added an explicit identifying caption instead of swapping original media. Sources re-fetched at 06:06 and already in accuracy ledger.
Next: audit text/media diff, add concise correction source notes if useful, fetch upstream, commit and push, verify deploy and all 11 HTML files, capture live with /tmp/ssy4-capture.py ar-history OUT https://abobakr789.github.io/Hira/resources/ssd and popup via /tmp/rt/popupshot.js, inspect all changed views, then close QA. Do not rerun /tmp/y4history.py, since it regenerates the manifest against already edited files. T1 L20 age inconsistency remains untouched for later synchronized rewrite.

## 2026-11-24 06:18 Dubai history closure
History/civics content 27b326a7 deployed successfully, action 45310537330. All 11 HTML files verified byte-exact live. Five fronts, one popup and seven print pages inspected live PASS at 06:16. Original media retained with accurate museum caption. Batch closure only; grade 4 review continues.

## 2026-11-24 06:24 Dubai vocabulary closure
Vocabulary content f58b606c deployed successfully, action 45311365701. All 11 HTML files byte-exact live. Nine fronts, three popups and nine print pages inspected live PASS. Synchronized mountain definition and teak spelling/material distinction. Original media retained. Grade 4 remains in progress.

## 2026-11-24 06:30 Dubai Earth closure
Earth content 7eba3959 is live; five HTML resources byte-exact at 06:28. Six fronts, one popup and seven print pages passed live pixel QA by 06:30. Source adaptation labelled and original media preserved. Zayed the First correction prepared locally, four fronts, one popup and seven print pages passed local pixel QA; not yet published.

## 2026-11-24 06:35 Dubai Zayed closure
Zayed content 0e90cdbb live, all five HTML byte-exact 06:33. Four fronts, one popup, seven print pages individually passed live pixel QA. Removed inconsistent birth/age claims instead of choosing a speculative date. Retained verified reign 1855–1909. Three economy lessons under local review, not published.

### Research continuation 2026-11-24 06:41 Dubai
- Economy content d7c830a2 pushed 06:38; local QA four fronts and seven print pages PASS. Live still old at 06:41, latest Pages run is in progress. Ancient-example content add5e85d pushed 06:40; two fronts + one print local PASS. Do not call either closed until live matches and pixels pass.
- T1 L02/L03: NOAA longitude and USNO time pages read again; 15 degrees/hour, not 15 arbitrary lines. Distinguish solar time from legal time zones. Longitude range 0 to 180 E/W; latitude 0 to 90 N/S. NASA archived page read, use only its coordinate geometry, not its outdated time-zone claims. Need synchronized change across slides, quizzes, worksheets and keys.
- T2 L05 term remains unsupported after exact-match searches. Definition mentions an aperture collecting water; do not guess a replacement technical word. May instead use verified aflaj example, carefully synchronize matching vocab and answer popup.
- T2 L10 Qibraa name remains unsupported, do not silently replace with a guessed name. Magan regional name supported by KSU study fetched 06:40: https://direct.ksu.edu.sa/entities/journalarticle/1d03edef-4775-4e53-a822-ee1f629da605 . Could retain verified example and remove unsupported additional name, label adaptation.
- T2 L11 mafaariz remains unsupported as mountain passes; official Dibba tourism describes coast and mountains only. Safer replace unsupported vocabulary and passage fragment with explicit supported coastal/mountain feature, not a speculative OCR repair.
- T2 L12: https://read.shamela.ws/narrator/6386 fetched, explicitly records disputed birth reports, including year of conquest or before. Exact 7 AH and Qadisiyyah participation are unsafe together. Prefer remove exact birth-year and unverified early battle, keep verified governorship. No depictions.
- T3 L15: RSC alchemy page read again, history predates medieval Muslim scholars. Rewrite invention-from-nothing and Arabic-name claims as contribution/development in chemistry and physics. Need independent support for physics contribution; RSC alone supports chemistry only.

- Physics support now fetched 06:41: https://www.unesco.org/en/articles/international-year-light-ibn-al-haytham-pioneer-modern-optics-celebrated-unesco and https://www.unesco.org/en/articles/sm-razaullah-ansari-ibn-al-haythams-scientific-method . Supports significant optics/physics advances and experimental methods, with prior ancient scholarship. Use contribution rather than sole invention or Arabic etymology.

- Published ancient example source explicitly reread 06:40, https://abudhabiculture.ae/en/cultural-heritage/tangible/archaeology/umm-an-nar , Bronze Age settlement 2500–2000 BCE and overseas trade.
- Latest run observed https://github.com/abobakr789/Hira/actions/runs/45314067839 for add5e85d in progress at 06:42. Earlier economy run https://github.com/abobakr789/Hira/actions/runs/45313810886 was superseded/cancelled by this newer run; not a content failure. Avoid pushing documentation until this deploy closes to avoid canceling it again.

- Economy and ancient batches CLOSED LIVE 06:45. All 12 HTML byte-exact live 06:43; six fronts and eight print pages individually inspected PASS. Capture directories /tmp/ssy4economy-live0643 and print, /tmp/ssy4ancient-live0643 and print. Content commits d7c830a2, add5e85d.

## 2026-11-24 06:58 Dubai geography progress
- Longitude a969176a CLOSED LIVE. Six HTML byte-exact 06:54; 15 fronts, four popups, nine print pages individually PASS from fresh 06:55 captures. Preserved concurrent upstream d51064f2 during rebase.
- Latitude local QA PASS: six fronts, one popup, eight print pages. Six HTML content and associated source/manifest now ready for publication.
