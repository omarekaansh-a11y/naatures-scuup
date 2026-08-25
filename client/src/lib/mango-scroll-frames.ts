/** Clean high-detail AI-rendered still-frame orbit sequence, ordered front-to-side. */
export const MANGO_SCROLL_FRAMES = [
  "/manus-storage/ai-mango-orbit-keyframe-001_d41ca58e.png",
  "/manus-storage/ai-mango-orbit-keyframe-038_991b0655.png",
  "/manus-storage/ai-mango-orbit-keyframe-075_0c3af8ea.png",
  "/manus-storage/ai-mango-orbit-keyframe-113_99ec155d.png",
  "/manus-storage/ai-mango-orbit-keyframe-150_e943dec1.png",
  "/manus-storage/ai-mango-orbit-keyframe-188_2e805ccc.png",
  "/manus-storage/ai-mango-orbit-keyframe-225_ae96d4da.png",
  "/manus-storage/ai-mango-orbit-keyframe-263_e770a248.png",
  "/manus-storage/ai-mango-orbit-keyframe-300_9fb2452f.png",
] as const;

/** The canvas maps its scroll playhead across 300 virtual positions while blending the crisp anchor stills. */
export const MANGO_SCROLL_FRAME_COUNT = 300;
