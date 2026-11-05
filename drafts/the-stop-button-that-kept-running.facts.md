# Facts for the-stop-button-that-kept-running

Every number in the piece must trace to a line here.

Source: moduspilot commit 411714d

## Message

411714d077530fb3ed505200693441e71d355f4e
Wed Nov 4 12:31:10 2026 -0800

Audit 11-04: MCP security, Stop on server, billing order, memory, workspace, desktop

Security: OAuth discovery and MCP transports fetch through safeFetch (every hop
checked), consent bound to the starting browser by a single-use nonce cookie,
widget and preview CSP placed first, dangling symlink can't escape the Mac
folder, local server env values shown and loader vars blocked.
Paid only: connectors and local tools are off for free plans (402 on add,
sign in, catalog actions, widgets; skipped in chat).
Chat: streamText gets req.signal so Stop ends server tool calls, abort billed
once, usage recorded before media saving, media save bounded by time left,
MCP results trimmed for the model (full kept for cards), context overflow
gets its own message, slash Enter only runs a clearly named prompt.
Memory: non-Latin facts saved and recalled, junk filter keeps real facts.
OAuth: transactional token saves, a concurrent refresh no longer signs the
user out, second-origin consent parks its client, secret-box opens old keys.
Workspace: panel delete and rename purge (space freed), editor save conflicts
on a stale version, restore follows the version's kind, unique blob keys,
honest 4MB upload limit. Desktop: servers stopped before quit, unique tool
names. Mobile: visible line when a tool ran and no answer came.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>


## Added comments (where the numbers live)

apps/desktop/src/main/index.ts: // Local MCP servers are child processes; none may outlive the app. The
apps/desktop/src/main/index.ts: // SDK's close() waits on the child, so quitting is held until they are
apps/desktop/src/main/index.ts: // down (3s at most), then resumed.
apps/desktop/src/main/local/folder.ts: // lstat, not existsSync: existsSync follows links, so a DANGLING symlink read
apps/desktop/src/main/local/folder.ts: // as "missing", the probe moved up to its (inside) parent and the check
apps/desktop/src/main/local/folder.ts: // passed, and the write then followed the link out of the folder.
apps/desktop/src/main/local/mcp.ts: // These change what a trusted-looking command actually loads, so the dialog
apps/desktop/src/main/local/mcp.ts: // could show "npx some-real-server" while running anything.
apps/desktop/src/main/local/mcp.ts: // One line per thing, control characters removed, so the text cannot be
apps/desktop/src/main/local/mcp.ts: // laid out to hide part of the command.
apps/desktop/src/main/local/mcp.ts: // Servers still starting are not in `live` yet; wait for them so they are
apps/desktop/src/main/local/mcp.ts: // stopped too instead of finishing their start after the app is gone.
apps/desktop/src/main/local/mcp.ts: // Two servers whose names slug the same ("GitHub", "git-hub") used to emit
apps/desktop/src/main/local/mcp.ts: // identical tool names, and calls went to whichever listed last.
apps/mobile/app/(app)/(tabs)/chat.tsx: // A tool ran, then the model wrote nothing: keep the tool card, but
apps/mobile/app/(app)/(tabs)/chat.tsx: // never save a silent blank answer under it.
apps/mobile/lib/tool-activity.ts: // Prose punctuation and markdown around a link ("…/a.png." or
apps/mobile/lib/tool-activity.ts: // "**…/a.png**") is not part of it, and kept the extension check failing.
apps/web/app/api/chat/route.ts: // Connectors are paid only (2026-11-04). A free account's saved servers are
apps/web/app/api/chat/route.ts: // kept but never connected, so they cost nothing and run nothing.
apps/web/app/api/chat/route.ts: // Stop must stop the SERVER too. Without the request's signal a stopped
apps/web/app/api/chat/route.ts: // Pika or Higgsfield run kept going up to 265s and 10 steps, spending the
apps/web/app/api/chat/route.ts: // user's connector credits for an answer nobody would see. The signal also
apps/web/app/api/chat/route.ts: // reaches every MCP tool call (host.ts passes options.abortSignal).
apps/web/app/api/chat/route.ts: //
apps/web/app/api/chat/route.ts: // This SDK (4.3) has no onAbort and onFinish never runs after an abort, so
apps/web/app/api/chat/route.ts: // an abort is billed here from what the steps already sent, and the MCP
apps/web/app/api/chat/route.ts: // sockets are closed. `settled` keeps the two paths from both billing.
apps/web/app/api/chat/route.ts: // 💸 BILL FIRST. Media saving below can wait up to 30s, and after a tool
apps/web/app/api/chat/route.ts: // ran near the 265s deadline that pushed past maxDuration: the function
apps/web/app/api/chat/route.ts: // was killed before usage was recorded, so the costliest turns went free.
apps/web/app/api/chat/route.ts: //
apps/web/app/api/chat/route.ts: // 🚨 NOT every provider reports usage. Measured 2026-07-23 on the live
apps/web/app/api/chat/route.ts: // stream: Anthropic returns real counts, but Gateway-hosted models AND
apps/web/app/api/chat/route.ts: // gpt-5.6-terra both return {promptTokens: null, completionTokens: null},
apps/web/app/api/chat/route.ts: // so a rough ~4 chars/token estimate over what was sent and received is
apps/web/app/api/chat/route.ts: // strictly better than counting zero. Each step re-sent the whole prompt,
apps/web/app/api/chat/route.ts: // so a 10 step tool loop bills as 10, not one.
apps/web/app/api/chat/route.ts: // Put the FULL tool results back: the model got trimmed copies
apps/web/app/api/chat/route.ts: // (lib/mcp/host.ts forModel), but cards, widgets and media saving need
apps/web/app/api/chat/route.ts: // the inline media and full structured content.
apps/web/app/api/chat/route.ts: // Only with the time this request still has (maxDuration 300s, keep
apps/web/app/api/chat/route.ts: // ~10s to send the record and close), so saving can never get the
apps/web/app/api/chat/route.ts: // function killed before the tool cards are sent.
apps/web/app/api/chat/route.ts: // (Billed at the top of onFinish, before anything slow.)
apps/web/app/api/chat/route.ts: // A real context overflow (a huge tool result, a long chat) is not
apps/web/app/api/chat/route.ts: // "busy": waiting won't fix it, a new chat will.
apps/web/app/api/mcp/catalog/route.ts: // Free accounts get an empty catalog, not an error: the slash menu just
apps/web/app/api/mcp/catalog/route.ts: // shows nothing from connectors.
apps/web/app/api/mcp/oauth/callback/route.ts: // Every exit clears the nonce cookie, so a state works once per browser.
apps/web/app/api/mcp/oauth/start/route.ts: // The nonce ties the consent round trip to THIS browser: it rides in the
apps/web/app/api/mcp/oauth/start/route.ts: // signed state and in an httpOnly cookie, and the callback needs both to
apps/web/app/api/mcp/oauth/start/route.ts: // match. Without it, a link from someone else's start would attach the
apps/web/app/api/mcp/oauth/start/route.ts: // victim's connector account to the attacker's MODUS account.
apps/web/app/api/mcp/oauth/start/route.ts: // Details stay in the log: echoing upstream errors back let the response
apps/web/app/api/mcp/oauth/start/route.ts: // be used to probe what sits behind the URLs a server names.
apps/web/app/api/mcp/ui/route.ts: // maxTotalTimeout: progress may extend a call, but never past the
apps/web/app/api/mcp/ui/route.ts: // route's own limit (a JSON error beats a platform timeout).
apps/web/app/api/memory/upsert/route.ts: // saved:false = already remembered. Reporting plain ok hid that nothing was written.
apps/web/app/api/workspace/route.ts: // The person deleting in the panel means it: free the space.
apps/web/components/chat/ChatInput.tsx: // Enter on "/name" uses that prompt instead of sending "/name" to the
apps/web/components/chat/ChatInput.tsx: // model, but only when it clearly names one (see enterPicksPrompt).
apps/web/components/chat/PluginCatalog.tsx: // Keyed by uid: after switching accounts in one tab, the previous user's
apps/web/components/chat/PluginCatalog.tsx: // prompts used to show for up to a minute.
apps/web/components/chat/PluginCatalog.tsx: /** Prompts whose name, or a word of the title, STARTS with the query. A
apps/web/components/chat/PluginCatalog.tsx: * substring match let "/s" or "/a" match nearly everything. */
apps/web/components/chat/PluginCatalog.tsx: /**
apps/web/components/chat/PluginCatalog.tsx: * Whether Enter should run a prompt instead of sending the message: only when
apps/web/components/chat/PluginCatalog.tsx: * the user plainly means one (the exact name, or the only match). Otherwise
apps/web/components/chat/PluginCatalog.tsx: * Enter sends what they typed, and prompts stay one click away.
apps/web/components/chat/PluginCatalog.tsx: */
apps/web/components/chat/PluginCatalog.tsx: // Not while a prompt is loading or just failed: each Enter re-ran it.
apps/web/components/settings/ConnectorsSettings.tsx: // An MCP connector finished OAuth. Its own param, so a connector named
apps/web/components/settings/ConnectorsSettings.tsx: // "github" or "a@b" no longer lands in the GitHub or Google flow.
apps/web/components/settings/ConnectorsSettings.tsx: // back the provider's consent page. Coming back lands on ?mcp_connected=<name>.
apps/web/components/workspace/WidgetPanel.tsx: // First in the document, before anything the widget wrote. Injecting after
apps/web/components/workspace/WidgetPanel.tsx: // a matched <head> missed pages without one (the regex also matched
apps/web/components/workspace/WidgetPanel.tsx: // <header>, landing the meta in <body>, where it is ignored) and let a script
apps/web/components/workspace/WidgetPanel.tsx: // placed before <head> run first. A leading meta opens the head itself.
apps/web/components/workspace/WidgetPanel.tsx: // Read through refs: the effect must run once per tool call. Depending on
apps/web/components/workspace/WidgetPanel.tsx: // the objects re-ran it when the same widget was reopened (a new target
apps/web/components/workspace/WidgetPanel.tsx: // object, same key), closing the bridge and rebuilding it while setSrcDoc got
apps/web/components/workspace/WidgetPanel.tsx: // an identical string, so the iframe never reloaded or re-initialized.
apps/web/components/workspace/WidgetPanel.tsx: // eslint-disable-next-line react-hooks/exhaustive-deps
apps/web/components/workspace/WorkspacePanel.tsx: // The CSP goes FIRST, before anything the page wrote. Injecting after a
apps/web/components/workspace/WorkspacePanel.tsx: // matched <head> missed pages with none (the regex also matched <header>,
apps/web/components/workspace/WorkspacePanel.tsx: // putting the meta in <body>, where it is ignored) and let a script placed
apps/web/components/workspace/WorkspacePanel.tsx: // before <head> run before the policy existed. A leading meta makes the
apps/web/components/workspace/WorkspacePanel.tsx: // parser open the head itself; the page's own <head> tag is then ignored.
apps/web/lib/chat/memory.ts: // Each rule names the assistant or the act of asking it, ADJACENT to the
apps/web/lib/chat/memory.ts: // verb. The old ".*" and bare-word rules threw away real facts: "requested
apps/web/lib/chat/memory.ts: // replies in Tagalog", "his manager asked him to lead Q3", "is talking with
apps/web/lib/chat/memory.ts: // investors about his AI app", "is using the Notion app".
apps/web/lib/chat/save-tool-media.ts: // Read in chunks and stop at the cap: with no content-length, arrayBuffer()
apps/web/lib/chat/save-tool-media.ts: // pulled the whole body into memory before any size check.
apps/web/lib/chat/tool-activity.ts: // Prose punctuation and markdown around a link ("…/a.png." or
apps/web/lib/chat/tool-activity.ts: // "**…/a.png**") is not part of it, and kept the extension check failing.
apps/web/lib/mcp/catalog.ts: // A connection that opens AFTER the 5s cap would never be closed (host is
apps/web/lib/mcp/catalog.ts: // still unset in finally). Same late-close guard as the chat route.
apps/web/lib/mcp/host.ts: /**
apps/web/lib/mcp/host.ts: * Full results by toolCallId. The model gets a trimmed copy (forModel); tool
apps/web/lib/mcp/host.ts: * cards, widgets and media saving need the real one.
apps/web/lib/mcp/host.ts: */
apps/web/lib/mcp/host.ts: /**
apps/web/lib/mcp/host.ts: * What the model sees of a tool result. Inline base64 media (a 2MB image is
apps/web/lib/mcp/host.ts: * ~2.7M characters) went straight into the next step's prompt and blew the
apps/web/lib/mcp/host.ts: * context window, surfacing as a misleading "all models busy". Media becomes a
apps/web/lib/mcp/host.ts: * one-line note (the user still sees it in the tool card), and text is capped.
apps/web/lib/mcp/host.ts: */
apps/web/lib/mcp/host.ts: // Token refresh and auth discovery go to URLs the server names, so
apps/web/lib/mcp/host.ts: // every hop is checked, not just the server URL.
apps/web/lib/mcp/oauth.ts: /**
apps/web/lib/mcp/oauth.ts: * A client registered by a consent that has not finished yet (a start from
apps/web/lib/mcp/oauth.ts: * another origin, e.g. dev, which shares Firestore). It only replaces
apps/web/lib/mcp/oauth.ts: * `client` once that consent returns tokens, so an abandoned consent no
apps/web/lib/mcp/oauth.ts: * longer swaps the client under a grant that still works.
apps/web/lib/mcp/oauth.ts: */
apps/web/lib/mcp/oauth.ts: /** httpOnly cookie binding a consent round trip to the browser that started it. */
apps/web/lib/mcp/oauth.ts: // The server list is cached 60s; without this chat kept retrying a dead
apps/web/lib/mcp/oauth.ts: // connector (or ignoring a revived one) until the cache ran out.
apps/web/lib/mcp/oauth.ts: /** The access token this provider started from, to tell if another request refreshed since. */
apps/web/lib/mcp/oauth.ts: /**
apps/web/lib/mcp/oauth.ts: * Patch the STORED record in a transaction. Chat, the catalog and widget
apps/web/lib/mcp/oauth.ts: * routes each hold their own provider for one connector; writing back a
apps/web/lib/mcp/oauth.ts: * whole stale copy let one request erase what another had just saved.
apps/web/lib/mcp/oauth.ts: */
apps/web/lib/mcp/oauth.ts: /**
apps/web/lib/mcp/oauth.ts: * True when someone else already replaced the tokens we started from. Two
apps/web/lib/mcp/oauth.ts: * requests refreshing one rotating refresh token at once: the loser gets
apps/web/lib/mcp/oauth.ts: * invalid_grant, and the SDK then deletes the tokens and asks for consent.
apps/web/lib/mcp/oauth.ts: * When the winner's fresh tokens are already stored, that would sign the
apps/web/lib/mcp/oauth.ts: * user out for nothing.
apps/web/lib/mcp/oauth.ts: */
apps/web/lib/mcp/oauth.ts: // A grant from another origin still works: park the new client until this
apps/web/lib/mcp/oauth.ts: // consent returns tokens (saveTokens promotes it).
apps/web/lib/mcp/oauth.ts: // Tokens from a consent made with a parked client: that client is now the one.
apps/web/lib/mcp/plan-gate.ts: /**
apps/web/lib/mcp/plan-gate.ts: * Connectors (MCP) are a paid feature (his call, 2026-11-04). Free accounts can
apps/web/lib/mcp/plan-gate.ts: * see the directory but not connect, browse a connector or run its tools.
apps/web/lib/mcp/plan-gate.ts: * Records a free account already has are kept, just unused until they upgrade.
apps/web/lib/mcp/plan-gate.ts: */
apps/web/lib/mcp/plan-gate.ts: /** Both add routes share one ceiling, so the OAuth path can't skip it. */
apps/web/lib/pinecone.ts: /**
apps/web/lib/pinecone.ts: * Comparison key for "same memory". Letters and digits in ANY script: the old
apps/web/lib/pinecone.ts: * [a-z0-9] version turned every Chinese, Japanese, Arabic... fact into "", so
apps/web/lib/pinecone.ts: * each one counted as a duplicate of the last and was never saved.
apps/web/lib/pinecone.ts: */
apps/web/lib/secret-box.ts: * Key: SECRET_BOX_KEY when set (rotate via SECRET_BOX_KEY_OLD, see openKeys), else derived from
apps/web/lib/secret-box.ts: /**
apps/web/lib/secret-box.ts: * Every key a sealed value may have been made with, current first. Rotating
apps/web/lib/secret-box.ts: * used to wipe every stored grant: open() only knew the new key, returned null,
apps/web/lib/secret-box.ts: * and the next save overwrote the record. To rotate, move the old value to
apps/web/lib/secret-box.ts: * SECRET_BOX_KEY_OLD and set the new one; values re-seal on their next save.
apps/web/lib/secret-box.ts: */
apps/web/lib/ssrf.ts: /**
apps/web/lib/ssrf.ts: * fetch() that refuses private targets on EVERY hop, for code that fetches URLs
apps/web/lib/ssrf.ts: * a foreign server chose (MCP OAuth discovery hands back resource metadata,
apps/web/lib/ssrf.ts: * authorization server, token and registration URLs). Checking only the first
apps/web/lib/ssrf.ts: * URL let a custom server point those at 169.254.169.254 and have us call it.
apps/web/lib/ssrf.ts: * Redirects are followed by hand so each Location is checked too.
apps/web/lib/ssrf.ts: */
apps/web/lib/ssrf.ts: // 303 (and 301/302 after POST, as browsers do) become a body-less GET.
apps/web/lib/workspace-client.ts: // Vercel refuses request bodies over 4.5MB before our route runs, with a
apps/web/lib/workspace-client.ts: // non-JSON 413 that read as "Upload failed". Say the real limit instead.
apps/web/lib/workspace-client.ts: /** Under Vercel's 4.5MB request body limit, with room for the form fields. */
apps/web/lib/workspace-store.ts: // Random suffix: two writers racing for version n used to save to the
apps/web/lib/workspace-store.ts: // same object, and the loser's bytes replaced the winner's even though
apps/web/lib/workspace-store.ts: // its commit then failed.
apps/web/lib/workspace.ts: /** Removes the file record itself (its versions must already be gone). */
apps/web/lib/workspace.ts: /**
apps/web/lib/workspace.ts: * `baseVersion`: the version the writer last read. The editor sends it, so a
apps/web/lib/workspace.ts: * Save no longer silently replaces an edit the model made in the meantime.
apps/web/lib/workspace.ts: */
apps/web/lib/workspace.ts: // Soft delete (the model's delete_file): the versions stay so the user can
apps/web/lib/workspace.ts: // restore, and so the bytes stay counted. The panel's Delete uses purge().
apps/web/lib/workspace.ts: /**
apps/web/lib/workspace.ts: * Permanent delete: every version, its stored bytes and the record, and the
apps/web/lib/workspace.ts: * bytes come off the account total. Soft delete was the only kind, so
apps/web/lib/workspace.ts: * deleting files never freed space and "Delete files to make room" was false.
apps/web/lib/workspace.ts: */
apps/web/lib/workspace.ts: // Same rule as write(): a text file renamed to x.png was stored as text
apps/web/lib/workspace.ts: // labelled image/png.
apps/web/lib/workspace.ts: // Purge, not soft delete: a move leaves nothing to restore at the old
apps/web/lib/workspace.ts: // path, and a soft-deleted binary kept its bytes counted twice.
apps/web/lib/workspace.ts: // Branch on the VERSION's own kind. The path's current kind can differ (a
apps/web/lib/workspace.ts: // binary deleted, then a text file renamed onto the path), which restored
apps/web/lib/workspace.ts: // an empty text file or failed with "Stored file is missing".
apps/web/scripts/verify-workspace.ts: // Fresh workspace: the main one above runs at its 5-file cap, and the
apps/web/scripts/verify-workspace.ts: // quota checks below depend on its exact contents.
apps/web/scripts/verify-workspace.ts: // Panel delete = purge: bytes really come back.
apps/web/scripts/verify-workspace.ts: // Editor save against a stale version is refused.
apps/web/scripts/verify-workspace.ts: // Rename a text file to a binary extension is refused.
apps/web/scripts/verify-workspace.ts: // Restore follows the version's kind, not the path's current kind.
