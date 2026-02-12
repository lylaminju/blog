export function initCopyButtons() {
	document.querySelectorAll("pre").forEach((pre) => {
		const btn = document.createElement("button");
		btn.className = "copy-btn";
		btn.textContent = "Copy";
		btn.addEventListener("click", async () => {
			const code = pre.querySelector("code");
			await navigator.clipboard.writeText(code.textContent);
			btn.textContent = "Copied!";
			setTimeout(() => (btn.textContent = "Copy"), 1500);
		});
		pre.appendChild(btn);
	});
}
