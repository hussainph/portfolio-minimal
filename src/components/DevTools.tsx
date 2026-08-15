/**
 * Dev-only overlays (InterfaceKit, Agentation), loaded via dynamic import so
 * their code never enters the production client bundle. Bundlers only
 * constant-fold the *untaken* branch of an `if` away, so the dynamic imports
 * have to sit inside the `NODE_ENV === "development"` branch itself — an
 * early return before them still ships the chunks in production.
 */
export async function DevTools() {
  if (process.env.NODE_ENV === "development") {
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
  return null;
}
