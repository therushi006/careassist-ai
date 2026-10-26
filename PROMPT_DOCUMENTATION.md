# CareAssist AI — Prompt Documentation

This document records the exact user prompts, implementation steps, and concrete improvements made throughout the development of **CareAssist AI**.

---

## Prompt 1: Initial Assessment Brief & Folder Inspection

### User Request
> "I have created a project folder named "AI assement". This folder will contain my AI Growth & Automation Associate assessment project.
>
> I want to build CareAssist AI, a healthcare information and appointment preparation web application.
>
> Use React.js, Vite, JavaScript, Bootstrap, normal CSS, React Router, and localStorage.
>
> First, inspect the current folder and check whether it is empty or already contains project files. Do not delete or overwrite existing files.
>
> If the folder is empty, prepare a development plan and show me the proposed folder structure before creating the application. Build the project step by step, test it, and document the actual prompts used in PROMPT_DOCUMENTATION.md.
>
> Do not use Tailwind CSS or React Bootstrap. Do not expose API keys or implement medical diagnosis.
>
> Start by inspecting the folder and presenting the plan. Do not create files until I approve the plan."

### Actions Taken & Improvements
1. **Workspace Inspection**: Ran PowerShell inspection on `c:\Users\sai\Desktop\AI assement`. Verified that the folder was completely empty.
2. **Architecture Blueprint**: Designed a patient-centric, safety-first architecture prioritizing appointment preparation, medical literacy, and appointment management without medical diagnosis.
3. **Drafted Plan & Folder Layout**: Outlined phased milestones, data models, and component hierarchies. Held file creation until explicit user approval was obtained.

---

## Prompt 2: Plan Refinement, Scope Prioritization & Safety Realism

### User Request
> "I have reviewed the proposed plan. Before implementation, please make these adjustments:
>
> 1. Keep the project name CareAssist AI and use the existing folder "AI assement".
> 2. Build a polished, responsive React + Vite application using Bootstrap 5, standard CSS, React Router, and localStorage.
> 3. Prioritize these core features:
>    - Professional dashboard.
>    - Interactive healthcare information assistant with clearly labelled demo responses.
>    - Appointment preparation form.
>    - Doctor questions generator and checklist.
>    - Create, view, edit, and delete appointment notes.
>    - Appointment manager.
>    - Searchable health information library and medical terminology simplifier.
> 4. Add medication and allergy management only after the core features work.
> 5. Keep emergency guidance simple and cautious. Do not claim that keyword matching can reliably detect or rule out medical emergencies. Display appropriate emergency guidance when relevant.
> 6. Do not include unnecessary features that delay completion.
> 7. Do not use Tailwind CSS or React Bootstrap.
> 8. Do not expose API keys or claim to use a live AI model when responses are simulated.
> 9. Create PROMPT_DOCUMENTATION.md and README.md. Record the actual prompts used and explain what each prompt improved. Do not invent prompt history.
> 10. Test each feature before moving to the next phase and fix errors.
>
> Please now present the revised, prioritized implementation plan and wait for my approval before creating files."

### Actions Taken & Improvements
1. **Prioritization Refactoring**: Placed Medication & Allergy management into a secondary phase (Phase 7) to guarantee rock-solid completion of core appointment prep and note management features first.
2. **Safety Realism**: Redesigned emergency guidance to be humble and cautious. Clarified that no algorithm or software can rule out medical emergencies, providing clear emergency warnings and disclaimers.
3. **Transparent AI Simulation**: Defined clear visual badges ("Simulated Assistant Response / Demo Mode") to eliminate misleading claims about live AI models while ensuring realistic demo functionality.
4. **CRUD for Notes**: Explicitly planned full Create, Read, Update, Delete workflows for appointment notes.

---

## Prompt 3: Phase 1 Approval & Scaffolding Execution

### User Request
> "I approve the revised implementation plan. Please begin Phase 1 in the existing "AI assement" folder.
>
> Set up the React + Vite project and install Bootstrap 5, Bootstrap Icons, and React Router DOM. Use standard CSS, not Tailwind CSS or React Bootstrap.
>
> After setup, run the application and verify that it starts successfully. Fix any errors before proceeding.
>
> Do not skip steps or claim anything is tested unless you have verified it. Once Phase 1 is complete, show me the files created, commands executed, and instructions to run the application. Then wait for my confirmation before starting Phase 2."

### Actions Taken & Improvements
1. **Scaffolded React + Vite**: Initialized the project cleanly in the existing directory.
2. **Installed Dependencies**:
   - `react` (^19.3.1) & `react-dom` (^19.3.1)
   - `bootstrap` (^5.3.8) & `bootstrap-icons` (^1.13.2)
   - `react-router-dom` (^7.18.4)
   - `@vitejs/plugin-react` (^6.1.2) & `vite` (^8.3.4)
3. **Configured Pure Bootstrap 5 & Standard CSS**:
   - Integrated Bootstrap CSS and JS bundle in `src/main.jsx`.
   - Created `src/index.css` with healthcare color tokens and card utility classes.
   - Set up `src/App.css` and `src/App.jsx` with responsive grid verification.
   - Avoided Tailwind CSS and React-Bootstrap completely, using standard HTML/JSX with Bootstrap 5 classes.
4. **Build & Dev Server Verification**:
   - Executed `npm run build`: Successfully built all production assets in 1.32s with zero errors or warnings.
   - Launched Vite dev server on `http://localhost:3000/`: Verified operational status with HMR enabled.
