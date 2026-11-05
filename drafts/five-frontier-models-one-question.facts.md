# Facts for five-frontier-models-one-question

Split on 8 of 8 prompts.

Every number in the piece must trace to a line here.

Source: moduspilot apps/web/content/runs/2026-11-05T03-37-11.json
Ran at: 2026-11-05T03:37:11.796Z

## price-anchor-annual (SPLIT)
Question: A $20/mo product wants to add annual billing. Is a 12-months-for-the-price-of-10 discount too generous, or not generous enough to change behaviour?
- Not generous enough: Claude Opus 5.5, Gemini 4, Llama 4 Maverick
- Too generous: GPT-6 Astra, DeepSeek V3.1
  > Claude Opus 5.5: Not generous enough. Two months free (~17% off) is the industry norm, not a giveaway, because annual prepay cuts churn and brings cash forward, which usually more than pays for the discount. If anything it sits at the low end of what moves fence-sitters, so you'd lean toward strengthening the offer (e.g., framing it as "2 months free" or testing ~20%) rather than shrinking it.
  > GPT-6 Astra: Too generous. You’re giving up 16.7% of annual revenue even for customers who would prepay for less. Start with one month free, then offer two only if the additional annual conversions and retention gains justify the extra discount.
  > Gemini 4: Not generous enough. A 16.7% discount only saves the user $40 over a full year, which is rarely enough absolute dollar value to overcome the friction of paying $200 upfront instead of $20. To meaningfully shift behavior at low price points, annual plans usually require at least a 20% to 25% discount (e.g., $180/year or 3 months free) to create a compelling psychological anchor.
  > Llama 4 Maverick: Not generous enough. A 16.67% discount may not be sufficient to incentivize customers to switch to annual billing, as it is relatively standard in the industry. More significant discounts, such as 20-25%, are often more effective at changing behavior.
  > DeepSeek V3.1: Too generous. A 20% discount is substantial and may unnecessarily reduce revenue when a smaller incentive could still drive annual conversions. Many businesses offer only 10-15% for annual billing, which is often sufficient to change behavior.

## hire-vs-contract (SPLIT)
Question: An agency owner at $30k/mo revenue is the bottleneck on delivery. Hire a full-time employee, or scale with contractors?
- Full-time hire: Claude Opus 5.5, DeepSeek V3.1
- Contractors: GPT-6 Astra, Gemini 4, Llama 4 Maverick
  > Claude Opus 5.5: Full-time hire. If the owner is the delivery bottleneck, contractors usually still need the owner to brief, manage, and QA their work, so the bottleneck stays in place. A full-time hire, such as a delivery lead or senior generalist, can absorb process knowledge, own client outcomes, and free the owner for sales, and $30k/mo can typically support that salary.
  > GPT-6 Astra: Contractors. At $30k/mo, contractors let you add delivery capacity without committing to full-time payroll before margins and workload justify it. Give an experienced contractor ownership of a clearly scoped delivery function—not just tasks—or you’ll remain the bottleneck.
  > Gemini 4: Contractors. At $30k/mo, your revenue is still vulnerable to client churn, so locking in fixed payroll overhead is too risky. Contractors immediately free up your time to sell while keeping your costs variable until you reach a safer $50k/mo+ baseline.
  > Llama 4 Maverick: Contractors. Contractors provide the flexibility to scale up or down as needed, allowing the agency to adapt to fluctuating demand without the long-term commitment of a full-time employee. This flexibility is crucial when the bottleneck is on delivery and revenue is already at $30k/mo.
  > DeepSeek V3.1: Full-time hire. A full-time hire provides consistent availability and deeper integration into your processes, reducing the bottleneck more effectively than managing multiple contractors. This ensures reliable delivery as you scale.

## server-components-default (SPLIT)
Question: For a new Next.js App Router product with heavy interactivity, should most components default to Server Components, or is a mostly-client architecture more honest about the app's needs?
- Server Components by default: Claude Opus 5.5, GPT-6 Astra, Gemini 4, DeepSeek V3.1
- Mostly client: Llama 4 Maverick
  > Claude Opus 5.5: Server Components by default. Even highly interactive apps have large static or data-fetching shells (layouts, data loading, auth gates). Keeping those on the server while pushing "use client" down to interactive leaves cuts bundle size and keeps data access simple without limiting interactivity.
  > GPT-6 Astra: Server Components by default. Heavy interactivity warrants substantial Client Component subtrees, not making every component client-side. Keep layouts and server-side data access in Server Components, and use client boundaries wherever state, effects, or browser APIs are needed.
  > Gemini 4: Server Components by default. Even in heavily interactive applications, defaulting to Server Components for layouts, routing, and initial data fetching minimizes client bundle sizes and simplifies data access. You can then deliberately push `"use client"` boundaries down to the specific interactive leaf nodes or feature subtrees, getting the best of both worlds without fighting the App Router's design.
  > Llama 4 Maverick: Mostly client. A heavily interactive application likely requires a significant amount of client-side JavaScript to handle user interactions, making a mostly-client architecture more suitable. Defaulting to Server Components might lead to unnecessary complexity with client-side interactivity.
  > DeepSeek V3.1: Server Components by default. Server Components reduce client-side JavaScript and improve initial load performance, while still allowing strategic use of Client Components for interactivity where needed.

## ai-code-review (SPLIT)
Question: Should an AI code reviewer be allowed to block a pull request from merging, or should it only ever leave advisory comments?
- Advisory only: Claude Opus 5.5, Gemini 4, Llama 4 Maverick, DeepSeek V3.1
- Allowed to block: GPT-6 Astra
  > Claude Opus 5.5: Advisory only. AI reviewers still produce enough false positives and non-deterministic judgments that hard-blocking would erode trust and train developers to game or bypass the tool. Merge gates should rest on deterministic checks (tests, linters, security scanners) and accountable human approvers, with AI comments informing those humans rather than overruling them.
  > GPT-6 Astra: Allowed to block. Blocking can prevent serious security or correctness defects before they reach production. That authority should be limited by human-defined criteria, supported by verifiable evidence, and subject to human override.
  > Gemini 4: Advisory only. AI models frequently hallucinate and lack full architectural context, meaning blocking capabilities would introduce unacceptable friction and bottleneck deployments due to false positives. Deterministic checks like compilers, linters, and test suites should handle automated blocking, while final merge authority must remain with accountable human engineers.
  > Llama 4 Maverick: Advisory only. An AI code reviewer should not have the final say in blocking a pull request as it may not fully understand the context or nuances of the code change, and human judgment is still essential for critical decisions. Allowing AI to block merges could lead to unnecessary delays or incorrect rejections.
  > DeepSeek V3.1: Advisory only. An AI code reviewer should provide recommendations and highlight potential issues, but final approval and responsibility should remain with human developers to ensure context, intent, and nuanced judgment are properly considered.

## one-model-vs-many (SPLIT)
Question: For daily professional work, is it better to master one frontier model deeply, or to route each task to whichever model is strongest at it?
- Master one: Claude Opus 5.5, GPT-6 Astra, Gemini 4
- Route per task: Llama 4 Maverick, DeepSeek V3.1
  > Claude Opus 5.5: Master one. Frontier models now differ only marginally on most professional tasks, while knowing one model's quirks, failure modes, and prompting style deeply compounds into far more reliable output and saved time. Routing adds overhead and context-switching costs that usually outweigh small per-task gains, so keep a second model only for the rare task where your main one clearly falls short.
  > GPT-6 Astra: Master one. For daily professional work, learning one model’s strengths, failure modes, and workflows usually pays off more than chasing marginal gains across models. Consistent context and less switching overhead make good results easier to reproduce.
  > Gemini 4: Master one. Deeply understanding one frontier model's quirks, context handling, and prompting patterns yields faster, more consistent results than constantly context-switching between tools. Modern frontier models have converged enough in capability that the workflow friction of routing tasks outweighs the marginal gains of model-hopping for daily work.
  > Llama 4 Maverick: Route per task. Mastering multiple models allows leveraging their respective strengths, and routing tasks accordingly can lead to better overall performance. This approach also encourages staying up-to-date with the latest advancements in various models.
  > DeepSeek V3.1: Route per task. Different models have specialized strengths, so routing tasks to the best-suited model maximizes efficiency and quality. This approach leverages the full ecosystem of AI capabilities rather than relying on a single model's limitations.

## rag-vs-long-context (SPLIT)
Question: You need a model to answer questions over a 500-page internal handbook that changes monthly. Build RAG, or just stuff it into a long context window?
- Build RAG: Claude Opus 5.5, GPT-6 Astra, Llama 4 Maverick, DeepSeek V3.1
- Long context: Gemini 4
  > Claude Opus 5.5: Build RAG. A 500-page handbook runs roughly 250–400k tokens, so sending all of it with every query is slow and expensive, and accuracy tends to drop when the answer is buried in the middle. Re-indexing once a month is cheap, and retrieval lets you cite the exact section behind each answer.
  > GPT-6 Astra: Build RAG. Retrieving relevant passages avoids repeatedly processing a 500-page handbook, reducing per-query cost and latency. Monthly updates can be indexed with version metadata, keeping answers grounded in current material with traceable citations.
  > Gemini 4: Long context. A 500-page handbook easily fits into modern context windows (~250k tokens), and with prompt caching, you eliminate the engineering overhead of building and maintaining a RAG pipeline. Updating the system monthly is as simple as swapping the source document in the cached prompt rather than re-chunking and re-indexing a vector database.
  > Llama 4 Maverick: Build RAG. Handling a 500-page document that changes monthly would be more feasible and efficient with a Retrieval-Augmented Generator (RAG) that can dynamically retrieve and incorporate the most recent information, rather than relying on a long context window that may struggle with such a large and frequently updated document.
  > DeepSeek V3.1: Build RAG. The handbook changes monthly, making RAG more efficient for frequent updates and reducing costs compared to repeatedly processing a large context. RAG also provides better accuracy by retrieving only relevant sections.

## fire-fast-underperformer (SPLIT)
Question: A six-person startup has an engineer who is well-liked, works hard, and ships noticeably slower than everyone else after nine months. Let them go now, or invest another quarter in coaching?
- Let them go now: Claude Opus 5.5, Gemini 4, Llama 4 Maverick
- Coach another quarter: GPT-6 Astra, DeepSeek V3.1
  > Claude Opus 5.5: Let them go now. In a six-person startup, each engineer is roughly a sixth of your capacity. Nine months is enough time to see whether someone fits the pace, and strong effort with persistently slow output suggests a skills-fit gap that another quarter of coaching is unlikely to close. Treat them generously with severance and a strong reference, which also protects team morale given how well-liked they are.
  > GPT-6 Astra: Coach another quarter. Shipping slower alone doesn’t establish that they can’t meet expectations, especially without evidence of structured coaching. Set explicit delivery milestones and weekly feedback, with continued employment contingent on meeting those milestones by quarter’s end.
  > Gemini 4: Let them go now. In a six-person startup, each engineer represents a huge fraction of your total output, and you cannot afford a low performer when speed is existential. Nine months is more than enough time to establish baseline velocity, so another quarter of coaching will only drain leadership bandwidth and runway.
  > Llama 4 Maverick: Let them go now. The engineer has already had nine months to adjust and hasn't shown significant improvement, and another quarter may not yield different results. Keeping underperforming employees can negatively impact team morale and productivity.
  > DeepSeek V3.1: Coach another quarter. The engineer is well-liked and hardworking, indicating potential for improvement with targeted support. A structured coaching period can clarify if the issue is fixable before making a final decision.

## raise-price-on-existing (SPLIT)
Question: You are doubling your price because you underpriced at launch. Do you grandfather every existing customer forever, or migrate them to the new price after 12 months?
- Migrate after 12 months: Claude Opus 5.5, GPT-6 Astra, Gemini 4
- Grandfather forever: Llama 4 Maverick, DeepSeek V3.1
  > Claude Opus 5.5: Migrate after 12 months. Grandfathering forever at half price locks in a growing base of unprofitable customers and caps your ability to fund the product they rely on. A 12-month runway with clear notice is generous enough to preserve trust while fixing the underlying pricing mistake.
  > GPT-6 Astra: Migrate after 12 months. Permanent grandfathering locks in the pricing mistake and creates a growing gap between revenue and the cost of serving customers. A 12-month transition rewards early adopters while giving them time to budget or choose an alternative.
  > Gemini 4: Migrate after 12 months. Grandfathering forever builds unsustainable technical debt and permanently depresses expansion revenue from your earliest cohorts. A 12-month grace period generously rewards early adopters for their loyalty while ensuring your unit economics eventually align across the entire customer base.
  > Llama 4 Maverick: Grandfather forever. To maintain customer trust and loyalty by honoring the original pricing agreement, ensuring long-term satisfaction and continued business.
  > DeepSeek V3.1: Grandfather forever. It builds long-term trust and loyalty with early adopters, and avoids negative backlash or churn from sudden price changes.

