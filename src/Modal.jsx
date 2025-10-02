import React, { useState } from "react";
import './Modal.css'

function Modal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
    >
      <div className="modal-content">
        <h2>일정 추가</h2>
        <input
          type="text"
          placeholder="일정 제목 입력"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>취소</button>
          <button onClick={() => { onSave(title); setTitle(""); }}>저장</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;