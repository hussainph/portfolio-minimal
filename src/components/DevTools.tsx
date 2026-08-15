/**
 * Dev-only overlays (InterfaceKit, Agentation), loaded via dynamic import so
 * their code never enters the production client bundle — a static import in
 * layout.tsx ships the chunks even when the render is NODE_ENV-gated.
 */
export async function DevTools() {
  if (process.env.NODE_ENV !== "development") return null;

  const [{ InterfaceKit }, { Agentation }] = await Promise.all([
    import("interface-kit/react"),
    import("agentation"),
  ]);

  return (
    <>
      <InterfaceKit />
      <Agentation />
    </>
  );
}
