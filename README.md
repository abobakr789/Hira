# حراء — منصة التربية الإسلامية

## الرفع على GitHub Pages
1. أنشئ مستودعًا جديدًا على GitHub باسم `Hiraa`.
2. ارفع محتويات هذا المجلد كما هي (index.html و assets و .nojekyll).
3. من Settings ← Pages اختر الفرع `main` والمجلد `/ (root)` ثم Save.
4. سيعمل الموقع على: https://abobakr789.github.io/Hiraa/

## إعداد مرة واحدة في Supabase (ضروري لتفعيل حسابك)
من لوحة Supabase لمشروع hiraa: Authentication ← URL Configuration
- Site URL: `https://abobakr789.github.io/Hiraa/`
- Redirect URLs: أضف `https://abobakr789.github.io/Hiraa/**`

ثم افتح الموقع ← تسجيل الدخول ← «أنشئ حسابك» ببريد abobakr789@gmail.com.
بعد تفعيل البريد يصبح حسابك مشرفًا عامًا تلقائيًا وتظهر «لوحة التحكم».

## ملاحظات
- المحتوى كله يُقرأ من قاعدة البيانات؛ أي تحديث في المنهج يظهر فورًا دون إعادة رفع.
- assets/config.js يحوي المفتاح العام فقط. لا تضع مفتاح service_role في الموقع.
