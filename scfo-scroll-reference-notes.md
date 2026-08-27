# SCFO Scroll Interaction Reference

The referenced homepage advances its visual narrative by section. A single normal viewport scroll moved the browser to the next named section and updated the hash to `#in-zahlen`, rather than leaving the viewer between unrelated visual states. Its transition reads as continuous because the scene changes across a long scrolling field rather than as a browser smooth-scroll jump, while the visual content remains coherent throughout the movement.

The restaurant adaptation should use this principle only while the cinematic is active: gate a wheel or touch gesture to one story checkpoint, interpolate each accepted input with a single request-animation-frame easing curve, preserve the native video-completion lock, and never programmatically reset the document scroll position after playback completes. The reference’s WebGL camera motion and the restaurant’s native video sequence use different rendering approaches, so the implementation should borrow interaction rhythm rather than duplicate the reference’s interface or content.

## Mobile observation, 390px reference capture

The reference’s public mobile view uses a deliberately rethought phone composition rather than a simple scaled desktop frame. It keeps the hierarchy in a narrow, left-aligned text column, uses a stable viewport without decorative edge treatment, and allows the primary scene to remain readable before the visitor advances. The Naatures Scuup adaptation should follow these general principles with its own light-grey dessert scene: preserve a stable cropped video, keep one readable story card in a designated safe column, and use the matched stage colour only as a clean fallback rather than a blurred decorative band.
