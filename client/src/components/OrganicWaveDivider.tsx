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
        <path d="M0 44C238 12 486 88 720 54C954 21 1208 75 1440 44V128H0Z" />
        <path className="organic-wave__stitch" d="M0 44C238 12 486 88 720 54C954 21 1208 75 1440 44" />
      </svg>
    </div>
  );
}
