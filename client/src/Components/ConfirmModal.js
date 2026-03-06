import React from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({
    title = "Confirmation",
    message = "Êtes-vous sûr de vouloir effectuer cette action ?",
    onConfirm,
    onCancel,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    danger = true
}) {
    return (
        <div className="confirmBackdrop" onClick={onCancel}>
            <div className="confirmModal" onClick={(e) => e.stopPropagation()}>
                <div className="confirmHeader">
                    <div className="confirmIcon">{danger ? "⚠️" : "❓"}</div>
                    <h3 className="confirmTitle">{title}</h3>
                </div>
                <p className="confirmMessage">{message}</p>
                <div className="confirmActions">
                    <button className="confirmBtn cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className={`confirmBtn ${danger ? 'danger' : 'primary'}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
