**Purpose:** Execute a comprehensive planning session and generate structured documentation for implementation and team sharing.

**When to use:** At the start of any new feature, refactor, or significant change that requires thoughtful planning.

**Usage Format:**
```
/plan [detailed description of what you want to build]
```

**Examples:**
```
/plan create an auth process using better-auth lib with email/password and OAuth providers
/plan refactor the payment system to support multiple currencies
/plan add real-time notifications using WebSockets with fallback to polling
```

**Process:**

1. **Capture Requirements:** Parse the description provided in the command arguments as the initial requirements

2. **Enter Plan Mode:** Automatically switch to plan mode (read-only research phase)

3. **Interactive Discovery (ASK QUESTIONS!):**
   - **DO NOT BLOCK:** Ask clarifying questions one at a time in a conversational way
   - Understand ambiguities in the requirements
   - Clarify technical preferences or constraints
   - Identify integration points with existing code
   - Ask about edge cases or special requirements
   - **IMPORTANT:** Continue the conversation naturally - don't wait to ask all questions at once
   
   Example questions you might ask:
   - "Should the auth system support password reset via email?"
   - "Do you want to store sessions in Redis or use JWT tokens?"
   - "Should OAuth providers be configurable or hardcoded?"
   - "Are there any existing user tables I should integrate with?"

4. **Deep Research & Analysis:**
   - Research the specific libraries/technologies mentioned (e.g., better-auth)
   - Understand the current codebase and relevant files
   - Review existing patterns in the codebase
   - Consider architectural implications
   - Identify dependencies and potential risks
   - Think about testing requirements

5. **Generate Planning Documentation:**
   
   **First, determine a concise feature name** from the description (e.g., "auth-process", "payment-refactor", "real-time-notifications")
   
   Then create the following files in `docs/plans/[feature-name]/`:
   
   **a) PLAN.md**
   - **Original Request:** The full description provided in the command
   - **Overview:** What we're building and why
   - **Context:** Current state and what's changing
   - **Approach:** High-level strategy and methodology
   - **Key Decisions:** Important architectural/technical choices made
   - **Questions & Answers:** Log of clarifying questions asked and responses received
   - **Success Criteria:** What "done" looks like
   - **Estimated Complexity:** Rough sizing (Small/Medium/Large/XL)
   
   **b) TASKS.md**
   - **Prerequisites:** Any setup needed first (library installations, env vars, etc.)
   - **Implementation Tasks:** Ordered, actionable checklist items
     - Each task should be completable in one focused session
     - Include clear acceptance criteria
     - Note dependencies between tasks
   - **Testing Tasks:** What needs to be tested
   - **Documentation Tasks:** What docs need updating
   
   **c) ARCHITECTURE.md** (only if the change is architecturally significant)
   - **System Design:** How components interact
   - **Data Flow:** How information moves through the system
   - **Key Patterns:** Design patterns and approaches used
   - **Technology Choices:** New libraries/frameworks and why (e.g., why better-auth)
   - **Integration Points:** How this connects with existing code
   - **Diagrams:** Use mermaid syntax for visual representations when helpful

6. **Review Checkpoint:**
   - Present the complete plan in chat for review
   - Show the structure of files that will be created
   - Ask if any adjustments are needed
   - Wait for approval before generating files

7. **Generate Files:**
   - Create all planning documentation files
   - Confirm files were created successfully
   - Prompt to exit plan mode when ready

8. **Ready to Execute:**
   - Remind user they can reference these docs during implementation
   - Suggest next steps for implementation

**Example Usage:**
```
/plan create an auth process using better-auth lib with email/password and OAuth providers

# Claude will respond with questions like:
# "Should the auth system support password reset via email?"
# "Do you want to store sessions in Redis or use JWT tokens?"
# [... interactive Q&A continues ...]
# [Claude then generates PLAN.md, TASKS.md, ARCHITECTURE.md]
```

**Important Notes:**
- **Questions are conversational:** Claude will ask questions naturally as part of the dialogue, not as a blocking questionnaire
- **Iterate freely:** You can provide more details, change requirements, or ask Claude to reconsider approaches at any time
- **Natural flow:** The process should feel like collaborating with a senior engineer, not filling out a form

**After Implementation:** When tasks are complete, use `/document [feature-name]` to create final feature documentation.
