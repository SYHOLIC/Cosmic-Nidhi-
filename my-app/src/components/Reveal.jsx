import { useReveal } from "../hooks/useReveal";

function Reveal({ children, delay = 0, className = "" }) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      data-visible={visible}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default Reveal;