<script lang="ts">
	import ChatInput from '$lib/components/chat/ChatInput.svelte';

	function handleSubmit(message: string) {
		console.log('submit:', message);
	}
</script>

<svelte:head>
	<title>Portfolio</title>
</svelte:head>

<main class="min-h-screen bg-background">
	<ChatInput onsubmit={handleSubmit} />
</main>
