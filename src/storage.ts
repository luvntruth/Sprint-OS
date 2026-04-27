const STORAGE_KEY = 'ax-hr-sprint-os-state-v1';

type MaybeTicket = {
  id?: unknown;
  status?: unknown;
  generatedBy?: unknown;
};
type MaybeParticipant = {
  checklist?: unknown;
  weeklyReflection?: unknown;
  blocker?: unknown;
};
type MaybeStateWithTickets = { tickets?: MaybeTicket[]; participants?: MaybeParticipant[] };

function ensureParticipantShape<T>(saved: T): T {
  const savedState = saved as MaybeStateWithTickets;
  if (!Array.isArray(savedState.participants)) return saved;
  let mutated = false;
  const participants = savedState.participants.map((p) => {
    if (!p || typeof p !== 'object') return p;
    const next: Record<string, unknown> = { ...p };
    let changed = false;
    if (!next.checklist || typeof next.checklist !== 'object') {
      next.checklist = {};
      changed = true;
    }
    if (!next.weeklyReflection || typeof next.weeklyReflection !== 'object') {
      next.weeklyReflection = {};
      changed = true;
    }
    if (!('blocker' in next)) {
      next.blocker = null;
      changed = true;
    }
    if (changed) mutated = true;
    return next as MaybeParticipant;
  });
  if (!mutated) return saved;
  return { ...(saved as object), participants } as T;
}

function mergeTemplateTickets<T>(saved: T, fallback: T): T {
  const savedState = saved as MaybeStateWithTickets;
  const fallbackState = fallback as MaybeStateWithTickets;
  if (!Array.isArray(savedState.tickets) || !Array.isArray(fallbackState.tickets)) return saved;

  const templateTicketById = new Map(fallbackState.tickets.map((ticket) => [ticket.id, ticket]));
  const savedIds = new Set(savedState.tickets.map((ticket) => ticket.id));
  const refreshedSavedTickets = savedState.tickets.map((ticket) => {
    const templateTicket = templateTicketById.get(ticket.id);
    if (!templateTicket || ticket.generatedBy === 'manual') return ticket;
    return { ...templateTicket, status: ticket.status ?? templateTicket.status };
  });
  const missingTemplateTickets = fallbackState.tickets.filter((ticket) => !savedIds.has(ticket.id));

  if (missingTemplateTickets.length === 0 && refreshedSavedTickets === savedState.tickets) return saved;
  return {
    ...(saved as object),
    tickets: [...refreshedSavedTickets, ...missingTemplateTickets],
  } as T;
}

export function loadState<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    return ensureParticipantShape(mergeTemplateTickets(JSON.parse(raw) as T, fallback));
  } catch {
    return fallback;
  }
}

export function saveState<T>(state: T): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearSavedState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
