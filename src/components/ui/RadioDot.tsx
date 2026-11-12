export function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-4 shrink-0 place-items-center rounded-full border ${selected ? 'border-ink' : 'border-strong'}`}
    >
      {selected && <span className="size-2 rounded-full bg-ink" />}
    </span>
  );
}
