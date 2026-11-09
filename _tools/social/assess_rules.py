# Assessment rules from the MoE "الإطار العام لتقييم مادة الدراسات الاجتماعية" 2024–2025 (Grades 1–12, all tracks, Term 1).
WEIGHTS = {"quiz": 40, "written": 15, "oral": 15, "performance": 30}   # formative; central exam (G3–12) = 100 separately
CENTRAL_EXAM_FROM_GRADE = 3
TEXT_LINES = {range(1, 5): (2, 5), range(5, 9): (7, 10), range(9, 13): (10, 20)}  # reading-text lines for the central exam
LEVELS = {"فهم", "تحليل", "تركيب", "تقييم"}
def n_options(grade): return 3 if grade <= 4 else 4
def validate_quiz(grade, items, passage=None):
    """Short quiz: >=5 items, all tied to ONE external reading/informational text; no T/F, no 'all of the above';
    3 options for G1–4, >=4 for G5–12; mixed difficulty (easy/medium/hard) and mixed thinking levels."""
    err = []
    if not passage: err.append("الاختبار القصير يُبنى على نص مقروء أو معلوماتي واحد من خارج الكتاب")
    if len(items) < 5: err.append("أقل من خمس مفردات")
    for i, q in enumerate(items, 1):
        if q.get("type") in ("true_false", "yes_no"): err.append(f"س{i}: صح/خطأ غير مسموح")
        opts = q.get("options", [])
        if q.get("type") == "mcq":
            if grade <= 4 and len(opts) != 3: err.append(f"س{i}: الصفوف 1–4 ثلاثة بدائل فقط")
            if grade >= 5 and len(opts) < 4: err.append(f"س{i}: الصفوف 5–12 أربعة بدائل على الأقل")
            if any("جميع ما ذكر" in o or "كل ما سبق" in o for o in opts): err.append(f"س{i}: «جميع ما ذكر» غير مسموح")
    if len({q.get("difficulty") for q in items}) < 3: err.append("نوّع الصعوبة: سهل/متوسط/صعب")
    if len({q.get("level") for q in items} & LEVELS) < 3: err.append("نوّع المهارات: فهم/تحليل/تركيب/تقييم")
    return err
