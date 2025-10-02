import './Modal.css'

function DeleteModal({ isOpen, onClose, onDelete, eventTitle }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>일정 삭제</h2>
        <p>“{eventTitle}” 일정을 정말 삭제하시겠습니까?</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>취소</button>
          <button onClick={onDelete} style={{ background: "red", color: "white" }}>삭제</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;