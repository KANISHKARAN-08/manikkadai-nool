# MANIKKADAI NOOL (மணிக்கடை நூல்)

> **Traditional Siddha Knowledge. Thoughtfully Digitized.**  
> An academic Siddha medical exhibition platform combining ancient Tamil anthropometric manuscripts (*Noi Nadal Noi Mudal Nadal Thirattu*), structured measurement records, peer-reviewed clinical research, and verified bilingual digital reference tools.

---

## 🌿 Overview & Academic Background

**Manikkadai Nool (மணிக்கடை நூல்)** is an anthropometric reference method rooted in the classical Siddha medicine tradition (*Agasthiyar Soodamani Kajiru Soothiram* within the *Pathinen Siddhar Naadi Nool* lineage).

In this method:
1. A calibrated, non-stretch thread is wrapped around the circumference of the patient's wrist at a standardized anatomical landmark.
2. The measured circumference is compared against the patient's individual anatomical unit, **Virarkadai (விரற்கடை)**—the width of their own proximal interphalangeal finger joint.
3. Classical literature describes systemic disease states (*நோயிநிலைகள்*) and prognostic indications (*மரணக் குறிகுணங்கள்*) corresponding to fractional Virarkadai values from 10 down to 4.

### Scientific & Educational Notice
> [!IMPORTANT]
> **Educational & Exhibition Reference Only**  
> This digital application records physical wrist circumferences in centimeters or millimeters and searches verified traditional reference entries. It does **not** provide automated clinical diagnoses, severity grading, outcome prediction, or therapeutic prescriptions. Physical measurements are normalized (1 cm = 10 mm), but mathematical conversions (e.g. 1 virarkadai ≈ 1.9 cm from the 2019 Gunmam study) are educational approximations and not universal clinical diagnostic constants.

---

## 🚀 Key Features

- **Authentic Primary Source Archive**: Interactive viewer of photographed book pages from *Noi Nadal Noi Mudal Nadal Thirattu* (Part 1, pp. 368–371) accompanied by verified Tamil Unicode transcriptions and reviewed English translations.
- **Guided Assessment Protocol**: Standard 6-step SOP, dual unit support (`cm` / `mm`), unit normalization (1 cm = 10 mm), and unit-aware repeat-reading threshold warnings (`> 0.3 cm` or `> 3.0 mm`).
- **Honest Reference Matching**: Searches authenticated database ranges. Unmapped measurements return an honest no-match educational notice rather than fabricated diagnoses.
- **Academic Reporting**: Printable exhibition certificate reports (with print-optimized stylesheets) and UTF-8 CSV exports with Tamil Unicode character support.
- **Research & Literature Hub**: Detailed analysis of the 2019 Palayamkottai Gunmam study (50 patients), approximate metric conversion caveats, clinical verification guidelines, and 4 peer-reviewed citations with clickable DOI links.
- **Bilingual Localization**: Comprehensive English and Tamil (தமிழ்) toggle persisting across all screens and reports.
- **Dual-Mode Engine**: Operates with live Supabase PostgreSQL authentication & Row Level Security, or smoothly falls back to an offline Exhibition Demo Mode for booth presentations.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript, Tailwind CSS, Lucide Icons.
- **Typography**: Lora / Cormorant Garamond (Headings), Inter (Sans UI), Noto Sans Tamil (Tamil glyphs).
- **Backend / Database**: Supabase PostgreSQL with Row Level Security (RLS) migrations.
- **Deployment**: Vercel ready (`vercel.json` SPA routing, caching headers).

---

## 📦 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 🗄 Supabase Setup & Migrations

To connect your own live Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the migrations in order:
   - `supabase/migrations/20261013000001_initial_schema.sql` (Creates `profiles`, `reference_entries`, `assessments`, `reference_audit_logs`)
   - `supabase/migrations/20261013000002_rls_policies.sql` (Enforces Row Level Security and role policies)
3. Copy your project credentials:
   - Project URL
   - Public Anon Key
4. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
5. In your Supabase Dashboard under **Authentication > URL Configuration**, ensure your site URL (e.g. `http://localhost:3000` or your Vercel domain) is added to the **Redirect URLs**.

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete premium bilingual Manikkadai Nool web application"
   git remote add origin https://github.com/your-username/manikkadai-nool.git
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com) and click **Add New > Project**.
3. Import your GitHub repository.
4. Set Framework Preset to **Vite**.
5. Add your Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**.

---

## 📚 Peer-Reviewed Citations

1. Raveendran R, Rajarajeshwari A, Victoria S. *Validation of Siddha Diagnostic Procedure of Manikkadai Nool for Gunmam Patients at Government Siddha Medical College & Hospital, Palayamkottai.* Journal of Complementary and Alternative Medical Research. 2019;8(3):1–11. [DOI: 10.9734/jocamr/2019/v8i330121](https://doi.org/10.9734/jocamr/2019/v8i330121)
2. Raveendran R, Rajarajeshwari A, Victoria S. *Literature Review of Traditional Siddha Diagnostic Method of Manikkadai Nool.* Journal of Complementary and Alternative Medical Research. 2019;7(4):1–5. [DOI: 10.9734/jocamr/2019/v7i430108](https://doi.org/10.9734/jocamr/2019/v7i430108)
3. Vinayak S, Sathiyarajeswaran P, Gayatri R, Priya BK. *Guidelines for Reporting Diagnostic Accuracy Studies of Siddha Anthropometric Tool Manikkadai Nool.* International Journal of Health Sciences. 2022;6(S2):6766–6774. [DOI: 10.53730/ijhs.v6nS2.6766](https://doi.org/10.53730/ijhs.v6nS2.6766)
4. Kabeena AK, Susimitha M, Revathi K. *A Literature Review on Manikkadai Nool a Traditional Diagnostic Tool in Siddha Medicine.* International Journal of Research and Scientific Innovation. 2026;13(3):1–4. [DOI: 10.51244/IJRSI.2026.130300001](https://doi.org/10.51244/IJRSI.2026.130300001)
