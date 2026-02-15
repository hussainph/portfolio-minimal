<script lang="ts">
	import { spring } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';

	/* ─────────────────────────────────────────────────────────
	 * ANIMATION STORYBOARD
	 *
	 *   idle    card rests at bottom, placeholder visible
	 *   focus   card springs up 6px ("excited to listen")
	 *   typing  aurora glow fades in behind top edge (400ms)
	 *   grow    card bounces upward as textarea expands
	 *   blur    card settles back, aurora fades out
	 * ───────────────────────────────────────────────────────── */

	const SPRING = {
		focus: { stiffness: 0.15, damping: 0.7 },
		bounce: { stiffness: 0.3, damping: 0.35 }
	} as const;

	const ANIM = {
		focusLift: -6, // px — how far the card rises on focus
		bounceScale: 0.35, // multiplier — overshoot relative to height diff
		auroraFadeMs: 400, // ms — aurora fade in/out duration
		typingDebounceMs: 1500 // ms — inactivity before "stopped typing"
	} as const;

	interface Props {
		onsubmit: (message: string) => void;
		disabled?: boolean;
		placeholder?: string;
	}

	let { onsubmit, disabled = false, placeholder = 'Ask me anything...' }: Props = $props();

	let value = $state('');
	let isFocused = $state(false);
	let isTyping = $state(false);
	let textarea: HTMLTextAreaElement;
	let typingTimer: ReturnType<typeof setTimeout>;
	let lastTextareaHeight = 0;
	let prefersReducedMotion = $state(false);

	let showGlow = $derived(isFocused && isTyping && value.length > 0);

	// Detect reduced motion preference
	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		prefersReducedMotion = mq.matches;
		const handler = (e: MediaQueryListEvent) => (prefersReducedMotion = e.matches);
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	const focusY = spring(0, SPRING.focus);
	const bounceY = spring(0, SPRING.bounce);

	function springSet(s: typeof focusY, value: number) {
		s.set(value, { hard: prefersReducedMotion });
	}

	function resize() {
		if (!textarea) return;
		textarea.style.height = 'auto';
		const newHeight = Math.min(textarea.scrollHeight, 200);
		textarea.style.height = newHeight + 'px';

		if (lastTextareaHeight > 0 && newHeight > lastTextareaHeight) {
			const diff = newHeight - lastTextareaHeight;
			bounceY.set(-diff * ANIM.bounceScale, { hard: true });
			tick().then(() => springSet(bounceY, 0));
		}
		lastTextareaHeight = newHeight;
	}

	function handleInput() {
		isTyping = true;
		clearTimeout(typingTimer);
		typingTimer = setTimeout(() => {
			isTyping = false;
		}, ANIM.typingDebounceMs);
		resize();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	function handleFocus() {
		isFocused = true;
		springSet(focusY, ANIM.focusLift);
	}

	function handleBlur() {
		isFocused = false;
		springSet(focusY, 0);
	}

	function submit() {
		const trimmed = value.trim();
		if (!trimmed || disabled) return;
		onsubmit(trimmed);
		value = '';
		isTyping = false;
		clearTimeout(typingTimer);
		lastTextareaHeight = 0;
		requestAnimationFrame(resize);
	}
</script>

<div class="fixed inset-x-0 bottom-0 z-10" style="transform: translateY({$focusY + $bounceY}px)">
	<!-- Northern lights aurora (behind the card, above page) -->
	{#if showGlow}
		<div
			transition:fade={{ duration: ANIM.auroraFadeMs }}
			class="aurora-container"
			aria-hidden="true"
		>
			<div class="aurora-layer aurora-wide"></div>
			<div class="aurora-layer aurora-narrow"></div>
		</div>
	{/if}

	<!-- Card -->
	<div class="input-card">
		<div class="input-inner">
			<textarea
				bind:this={textarea}
				bind:value
				oninput={handleInput}
				onkeydown={handleKeydown}
				onfocus={handleFocus}
				onblur={handleBlur}
				{disabled}
				{placeholder}
				rows={1}
				aria-label="Message"
				class="input-textarea"
			></textarea>
		</div>
	</div>
</div>

<style>
	.input-card {
		position: relative;
		z-index: 1;
		width: 100%;
		background-color: var(--color-surface);
		border-radius: 20px 20px 0 0;
		box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.06);
	}

	.input-inner {
		padding: 2.5rem 1.5rem 3.5rem;
	}

	@media (min-width: 640px) {
		.input-inner {
			padding: 2.5rem 2.5rem 3.75rem;
		}
	}

	/* ---- Northern Lights ---- */

	.aurora-container {
		position: absolute;
		bottom: calc(100% - 10px);
		left: 0;
		right: 0;
		height: 48px;
		pointer-events: none;
		z-index: 0;
	}

	.aurora-layer {
		position: absolute;
		left: 5%;
		right: 5%;
		border-radius: 50%;
	}

	.aurora-wide {
		top: 0;
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--color-ai),
			#7a3a6e,
			var(--color-human),
			#5a4a8e,
			var(--color-ai)
		);
		background-size: 300% 100%;
		filter: blur(24px);
		opacity: 0.35;
		animation: aurora-flow 4s ease-in-out infinite;
	}

	.aurora-narrow {
		top: 30%;
		height: 50%;
		left: 15%;
		right: 15%;
		background: linear-gradient(
			90deg,
			#5a4a8e,
			var(--color-human),
			#7a3a6e,
			var(--color-ai),
			#5a4a8e
		);
		background-size: 300% 100%;
		filter: blur(14px);
		opacity: 0.3;
		animation: aurora-flow-reverse 3s ease-in-out infinite;
	}

	/* ---- Textarea ---- */

	.input-textarea {
		position: relative;
		z-index: 1;
		width: 100%;
		resize: none;
		border: none;
		background: transparent;
		outline: none;
		font-family: var(--font-sans);
		font-size: 1rem;
		line-height: 1.625;
		color: var(--color-text);
		caret-color: var(--color-text);
		padding: 0;
	}

	.input-textarea::placeholder {
		color: var(--color-text-muted);
	}
</style>
