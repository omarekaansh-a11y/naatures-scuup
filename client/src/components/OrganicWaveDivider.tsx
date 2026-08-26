type OrganicWaveTone =
  | "cream-to-maroon"
  | "maroon-to-night"
  | "night-to-cream"
  | "maroon-to-cream"
  | "cream-to-sage"
  | "sage-to-maroon"
  | "sage-to-cream";

type OrganicWaveDividerProps = {
  tone: OrganicWaveTone;
};

/** A print-like, organic seam between editorial sections. It is decorative and never covers content. */
export function OrganicWaveDivider({ tone }: OrganicWaveDividerProps) {
  return (
    <div className={`organic-wave organic-wave--${tone}`} aria-hidden="true">
      <svg viewBox="0 0 1440 128" preserveAspectRatio="none" focusable="false">
        <path d="M0 62C198 7 458 102 720 54C982 6 1206 93 1440 48V128H0Z" />
        <path className="organic-wave__stitch" d="M0 62C198 7 458 102 720 54C982 6 1206 93 1440 48" />
        <path className="organic-wave__stitch organic-wave__stitch--echo" d="M0 83C206 28 462 119 720 75C978 27 1201 108 1440 65" />
        <path className="organic-wave__stitch organic-wave__stitch--echo organic-wave__stitch--quiet" d="M0 102C220 54 476 128 720 96C964 54 1203 124 1440 88" />
      </svg>
    </div>
  );
}
