const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-lg">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-xl">{title}</h3>

          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {children}
      </div>

      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </dialog>
  );
};

export default Modal;
