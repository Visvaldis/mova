interface Props {
  icon: string;
  title: string;
  desc: string;
  badge: string;
  comingSoon: string;
  note: string;
}

/**
 * Topic-styled stand-in for an interactive component that is not built yet.
 * Renders the spec's one-line description so no article ships as plain text.
 * Static (no client directive) for now; real components will hydrate as islands.
 */
export default function Placeholder({ icon, title, desc, badge, comingSoon, note }: Props) {
  return (
    <div className="placeholder">
      <div className="head">
        <div className="icon" aria-hidden="true">
          {icon}
        </div>
        <div>
          <div className="badge">
            {badge} · {comingSoon}
          </div>
          <div className="title">{title}</div>
        </div>
      </div>
      <p className="note">{note}</p>
      <p className="desc">{desc}</p>
      <div className="pulse-row" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
