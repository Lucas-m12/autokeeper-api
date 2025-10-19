# AutoKeeper — Product Definitions (v0.3, Republished)

> This file mirrors the decisions from **AutoKeeper_Product_Definitions_v0.3.md** and is the single source of truth for product scope.  
> It should stay aligned with the original upload and the **System Design Kickoff v1** handoff.

---

# AutoKeeper: Product Definitions (Pre-Code v0.3)

**Brand & Promise**  
- **Name/Domain:** AutoKeeper — autokeeper.com.br  
- **Promise (PT):** **“Mantenha seus veículos em dia.”**  
- **Category:** Vehicle logbook & reminder app (cars, motorcycles, vans, small fleets)

**Audiences (ICPs)**  
- **Owners (PF):** 1–3 vehicles (car/moto)  
- **Small Fleets:** 3–15 vehicles (delivery, services, NGOs, churches, small biz)

**North Star (6 months | learning-first)**  
- 300 accounts • 450 vehicles added • ≥40% 30-day retention (view dashboard) • ≥30 Pro trials interest

**MVP Scope (IN)**  
- Add vehicle (type, year/model; plate/km optional)  
- Create reminders (V1 templates: **IPVA, licenciamento, manutenção genérica, seguro**, + **personalizado**)  
- In-app dashboard: **Vencendo / Em atraso / Concluído**  
- Actions: **Concluir**, **Adiar 7 dias**, **Adiar 14 dias**  
- Mobile-first & responsive UI with clear empty states

**MVP Scope (OUT)**  
- WhatsApp/Email delivery (premium later)  
- Attachments & maintenance receipts  
- Dossier (PDF)  
- DETRAN or external integrations

**Channels & Plans (copy only, no prices yet)**  
- **Free (Tracker):** 1 vehicle • **In-app** reminders only • Unlimited basic reminders • No attachments/PDF  
- **Pro (later):** Up to 3 vehicles • **WhatsApp + Email** reminders • Notes + attachments • Dossier PDF (no watermark)  
- **Fleet Lite (later):** Up to 15 vehicles • Bulk presets • CSV (later)

**Reminder Behavior (UI)**  
- **Lead time:** **Vencendo** at **−30 days** from due date  
- **Overdue:** **Em atraso** the day **after** due date  
- **Snooze:** **Adiar 7d / 14d** (does **not** change due date)  
- **Done:** **Concluído** clears snoozes and removes from attention list

**Content Taxonomy (labels)**  
- **Vehicle types:** carro, moto, van, caminhão, ônibus, utilitário, outro  
- **Reminder types:** IPVA, licenciamento, seguro, manutenção, personalizado  
- **Statuses:** Rascunho, Agendado, Vencendo, Em atraso, Concluído, Adiado  
- *(Reserved for later)* Maintenance categories: óleo, pneus, freios, bateria, alinhamento/balanceamento, inspeção, outros

**UX Principles**  
- Mobile-first • 3-tap core flow • Clear PT labels • Accessible contrast/targets • Clean, friendly empty states

**Copy Kit (PT)**  
- **Hero:** *Mantenha seus veículos em dia.*  
- **Sub:** “Crie lembretes para IPVA, licenciamento e manutenção. Acompanhe vencimentos no app e marque como concluído.”  
- **CTAs:** Começar grátis • Adicionar veículo • Criar lembrete  
- **Upsell:** “Lembretes por WhatsApp e e-mail fazem parte do **Pro**.”  
- **Empty states:**  
  - “Nenhum lembrete ainda. Crie o primeiro para ver prazos aqui.”  
  - “Tudo certo por enquanto. Mostraremos aqui quando um prazo estiver perto.”

**Metrics (90-day checkpoint)**  
- 120 sign-ups • 180 vehicles • ≥60% create ≥1 reminder • ≥45% 7-day return • ≥10 Pro channel requests

**Privacy & Disclaimers**  
- “A AutoKeeper **não consulta** débitos oficiais; as datas são informadas pelo usuário.”  
- “Seus dados podem ser exportados e excluídos a qualquer momento.” *(UI later; manter em política)*

**Support & Admin (MVP)**  
- suporte@autokeeper.com.br • 5–6 help articles (add veículo, criar lembrete, Vencendo/Em atraso, concluir, adiar, limites do Free)  
- Basic admin read-only views (user/vehicle/reminder lists)

**Previously Open Gaps — Now Locked**  
- **Evaluation cadence:** recompute statuses **daily at 09:00 (user timezone)**  
- **Undo Done:** **Allowed**, with confirmation  
- **Custom reminders:** **Allowed**, **no recurrence** in MVP  
- **Timezone model:** store **user timezone** at sign-up/profile  
- **Fleet model (MVP):** **single owner** manages multiple vehicles (no sub-users yet)  
- **Data export:** described in policy, **UI later** (not in MVP)