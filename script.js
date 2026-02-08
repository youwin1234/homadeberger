/*
	Enlarge-on-click behavior

	Click an image (.image) to toggle an enlarged view. Clicking the overlay,
	pressing Escape, or clicking the image again will close the enlarged view.

	This keeps the previous track interaction (commented out) intact for
	future reference.
*/

const track = document.getElementById("image-track");
if (track) {
	let currentEnlarged = null;
	let _scrollPos = 0;
    let enlargedClone = null;

	// Create overlay
	const overlay = document.createElement('div');
	overlay.id = 'enlarge-overlay';
	overlay.setAttribute('aria-hidden', 'true');
	Object.assign(overlay.style, {
		position: 'fixed',
		inset: '0',
		background: 'rgba(0,0,0,0.6)',
		display: 'none',
		zIndex: '14000',
		cursor: 'zoom-out'
	});
	document.body.appendChild(overlay);

		function openImage(img) {
			if (!img) return;
			if (currentEnlarged === img) return;
			closeImage();
			currentEnlarged = img;
			// store scroll position so we can restore it when closing
			_scrollPos = window.scrollY || document.documentElement.scrollTop || 0;

			// lock the scroll by fixing body in place and preserving the visual position
			document.body.style.position = 'fixed';
			document.body.style.top = `-${_scrollPos}px`;
			document.body.style.left = '0';
			document.body.style.right = '0';

			// Create a cloned enlarged image inside the overlay so it sits above
			// the overlay background and avoids stacking-context issues.
			enlargedClone = img.cloneNode(true);
			enlargedClone.classList.add('is-enlarged');
			overlay.appendChild(enlargedClone);
			overlay.style.display = 'block';
		}

		function closeImage() {
			if (!currentEnlarged) return;
			// remove cloned enlarged image from overlay
			if (enlargedClone && enlargedClone.parentNode === overlay) {
				enlargedClone.parentNode.removeChild(enlargedClone);
				enlargedClone = null;
			}
			currentEnlarged = null;
			overlay.style.display = 'none';

			// restore scroll position and remove the fixed positioning
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.left = '';
			document.body.style.right = '';

			window.scrollTo(0, _scrollPos);
			_scrollPos = 0;
		}

	// Click handler on image track (delegation)
	track.addEventListener('click', (ev) => {
		const img = ev.target.closest('.image');
		if (!img || !track.contains(img)) return;
		if (img.classList.contains('is-enlarged')) {
			closeImage();
		} else {
			openImage(img);
		}
	});

	// Close when clicking overlay
	overlay.addEventListener('click', closeImage);

	// Close with Escape key
	window.addEventListener('keydown', (ev) => {
		if (ev.key === 'Escape' || ev.key === 'Esc') {
			closeImage();
		}
	});

	// Prevent accidental dragging while enlarged
	window.addEventListener('dragstart', (ev) => {
		if (currentEnlarged) ev.preventDefault();
	});
}

/*
	Original track interaction (drag-to-scroll) was commented out in the
	repository; kept intentionally for future use.
*/